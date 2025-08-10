// utils/checkout.js
// ----------------------------------------------------------------------------
// Stripe Checkout starter for Newbuddy
// - Accepts product + booking details
// - Chooses the right backend endpoint (local vs Netlify)
// - Gives clear errors + returns a result you can use in the UI
// ----------------------------------------------------------------------------

import { loadStripe } from "@stripe/stripe-js";

/**
 * Lazily load Stripe using the publishable key from Vite env.
 */
function getStripePromise() {
  const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  if (!pk) {
    throw new Error(
      "Missing VITE_STRIPE_PUBLISHABLE_KEY. Add it to your .env and restart the dev server."
    );
  }
  return loadStripe(pk);
}

/**
 * Build the backend endpoint depending on environment.
 * - Local dev: your Express server (change the port/path if needed)
 * - Production: Netlify function
 */
function getCheckoutEndpoint() {
  return import.meta.env.DEV
    ? "http://localhost:4242/create-checkout-session"
    : "/.netlify/functions/create-checkout-session";
}

/**
 * Optional sanitizer to keep booking payload tidy (only primitives).
 */
function sanitizeBooking(booking = {}) {
  const s = (v) =>
    v === undefined || v === null ? "" : typeof v === "string" ? v : String(v);

  return {
    guide: s(booking.guide),
    bookingType: s(booking.bookingType),
    date: s(booking.date),
    hours: s(booking.hours),
    notes: s(booking.notes),
  };
}

/**
 * Start Stripe Checkout
 * @param {Object} args
 * @param {string} args.productName - e.g. "Half-Day Local Buddy (🍜 Foodie)"
 * @param {number} args.price - in USD, e.g. 125
 * @param {string} [args.cancelPath="/"] - where to return if user cancels
 * @param {Object} [args.booking] - { guide, bookingType, date, hours, notes }
 * @returns {Promise<{ok:boolean, sessionId?:string, error?:string}>}
 */
export async function handleCheckout({
  productName,
  price,
  cancelPath = "/",
  booking = {},
}) {
  try {
    // Basic validation
    if (!productName || typeof productName !== "string") {
      return { ok: false, error: "Product name is required." };
    }
    if (typeof price !== "number" || Number.isNaN(price) || price <= 0) {
      return { ok: false, error: "Price must be a positive number." };
    }

    const stripe = await getStripePromise();
    if (!stripe) {
      return { ok: false, error: "Stripe failed to initialize." };
    }

    const endpoint = getCheckoutEndpoint();
    const payload = {
      product: { name: productName, price },
      cancelPath,
      booking: sanitizeBooking(booking),
    };

    // Helpful console logs for debugging
    console.log("📡 POST", endpoint, payload);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // Non-2xx -> show backend error text (often contains useful info)
    if (!res.ok) {
      const text = await res.text();
      console.error("❌ Backend error:", res.status, text);
      return { ok: false, error: "Failed to create checkout session." };
    }

    const data = await res.json();
    if (!data?.id) {
      console.error("❌ No session ID returned from backend:", data);
      return { ok: false, error: "No session ID returned." };
    }

    console.log("✅ Session created:", data.id);

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
    if (error) {
      console.error("❌ Stripe redirect error:", error);
      return { ok: false, error: error.message || "Stripe redirect failed." };
    }

    // If redirect succeeds, this code won’t run (browser navigates away).
    return { ok: true, sessionId: data.id };
  } catch (err) {
    console.error("❌ Checkout error:", err);
    return {
      ok: false,
      error:
        err?.message ||
        "Something went wrong starting checkout. Please try again.",
    };
  }
}

/* ---------------------------------------------------------------------------
Example usage (in your booking page):

const result = await handleCheckout({
  productName: "Half-Day Local Buddy (🍜 Foodie)",
  price: 125,
  cancelPath: "/book",
  booking: {
    guide: "Aisha",
    bookingType: "Half-Day",
    date: "2025-08-13",
    hours: 4,
    notes: "Vegetarian options please!"
  }
});

if (!result.ok) {
  toast.error(result.error);
}
--------------------------------------------------------------------------- */

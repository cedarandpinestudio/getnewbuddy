// utils/checkout.js
// ----------------------------------------------------------------------------
// Stripe Checkout starter for Newbuddy
// ----------------------------------------------------------------------------

import { loadStripe } from "@stripe/stripe-js";

// Cache the promise so we don't load Stripe multiple times
let stripePromise;

/** Lazily load Stripe using the publishable key from Vite env. */
function getStripePromise() {
  if (!stripePromise) {
    const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!pk) {
      throw new Error(
        "Missing VITE_STRIPE_PUBLISHABLE_KEY. Add it to your .env and restart the dev server."
      );
    }
    stripePromise = loadStripe(pk);
  }
  return stripePromise;
}

/** Backend endpoint (local dev vs Netlify prod). */
function getCheckoutEndpoint() {
  return import.meta.env.DEV
    ? "http://localhost:4242/create-checkout-session"
    : "/.netlify/functions/create-checkout-session";
}

/** Keep booking payload tidy (only primitives / strings). */
function sanitizeBooking(booking = {}) {
  const s = (v) =>
    v === undefined || v === null ? "" : typeof v === "string" ? v : String(v);

  return {
    guide: s(booking.guide),
    bookingType: s(booking.bookingType),
    date: s(booking.date),
    hours: s(booking.hours),
    notes: s(booking.notes),
    // feel free to include other keys (e.g., contactEmail, vibe) if you need them
    contactEmail: s(booking.contactEmail),
    vibe: s(booking.vibe),
  };
}

/**
 * Start Stripe Checkout
 * @param {Object} args
 * @param {string} args.productName - e.g. "Half-Day Local Buddy (🍜 Foodie)"
 * @param {number} args.price - in USD, e.g. 125
 * @param {string} [args.cancelPath="/"] - where to return if user cancels
 * @param {Object} [args.booking] - { guide, bookingType, date, hours, notes, contactEmail, vibe }
 * @returns {Promise<{ok:boolean, sessionId?:string, error?:string}>}
 */
export async function handleCheckout({
  productName,
  price,
  cancelPath = "/",
  booking = {}, // ✅ FIX: no references to unknown variables
}) {
  try {
    // Basic validation
    if (!productName || typeof productName !== "string") {
      return { ok: false, error: "Product name is required." };
    }
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      return { ok: false, error: "Price must be a positive number." };
    }

    const stripe = await getStripePromise();
    if (!stripe) {
      return { ok: false, error: "Stripe failed to initialize." };
    }

    const endpoint = getCheckoutEndpoint();
    const payload = {
      product: { name: productName, price: numericPrice },
      cancelPath,
      booking: sanitizeBooking(booking),
    };

    console.log("📡 POST", endpoint, payload);

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

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

    const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
    if (error) {
      console.error("❌ Stripe redirect error:", error);
      return { ok: false, error: error.message || "Stripe redirect failed." };
    }

    // Normally unreachable because the browser navigates away
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

// utils/checkout.js
import { loadStripe } from "@stripe/stripe-js";

// ✅ Ensure your .env has: VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export async function handleCheckout(productName, price, cancelPath) {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      console.error("❌ Stripe failed to initialize — check your publishable key.");
      alert("Payment system is not available. Please try again later.");
      return;
    }

    // ✅ Decide endpoint based on environment
    const checkoutEndpoint = import.meta.env.DEV
      ? "http://localhost:4242/create-checkout-session" // Local Express backend
      : "/.netlify/functions/create-checkout-session"; // Netlify prod

    // 🔍 DEBUG LOGS — these will show in your browser console
    console.log("📡 Sending checkout request to:", checkoutEndpoint);
    console.log("🛒 Product:", productName, "| 💵 Price:", price);

    // ✅ Call backend to create checkout session
    const res = await fetch(checkoutEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: { name: productName, price },
        cancelPath,
        booking
      }),
    });

    // 🔍 Log the raw response status
    console.log("📡 Response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("❌ Backend error response:", errorText);
      alert("Failed to start checkout. Please try again.");
      return;
    }

    const data = await res.json();

    // 🔍 DEBUG — log what the backend sent back
    console.log("📦 Checkout session response:", data);

    if (!data.id) {
      console.error("❌ No session ID returned from backend.");
      alert("No session ID returned. Please check backend logs.");
      return;
    }

    // ✅ Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId: data.id });

    if (error) {
      console.error("❌ Stripe redirect error:", error);
      alert("Payment failed. Please try again.");
    }
  } catch (err) {
    console.error("❌ Checkout error:", err);
    alert("Something went wrong starting checkout. Please try again.");
  }
}

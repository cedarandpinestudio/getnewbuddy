// utils/checkout.js
import { loadStripe } from "@stripe/stripe-js";

// ✅ Make sure you have this in your .env
// VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export async function handleCheckout(productName, price, cancelPath) {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      console.error("Stripe failed to initialize — check your publishable key.");
      alert("Payment system is not available. Please try again later.");
      return;
    }

    // ✅ Decide endpoint based on environment
    const endpoint = import.meta.env.DEV
      ? "http://localhost:4242/create-checkout-session" // Local Express backend
      : "/.netlify/functions/create-checkout-session"; // Netlify function in prod

    // ✅ Call backend to create checkout session
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: { name: productName, price },
        cancelPath,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Backend error:", errorText);
      alert("Failed to start checkout. Please try again.");
      return;
    }

    const data = await res.json();
    console.log("Checkout session response:", data);

    if (!data.id) {
      console.error("No session ID returned from backend.");
      alert("No session ID returned. Please check backend logs.");
      return;
    }

    // ✅ Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId: data.id });

    if (error) {
      console.error("Stripe redirect error:", error);
      alert("Payment failed. Please try again.");
    }
  } catch (err) {
    console.error("Checkout error:", err);
    alert("Something went wrong starting checkout. Please try again.");
  }
}

// utils/checkout.js
import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe with your public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

/**
 * Handle checkout with Stripe
 * @param {string} productName - Name of the product (e.g., "Half-Day Local Buddy")
 * @param {number} price - Price in USD (e.g., 150)
 * @param {string} cancelPath - Path to redirect on cancel (e.g., "/book" or "/itineraries")
 */
export async function handleCheckout(productName, price, cancelPath) {
  try {
    const stripe = await stripePromise;

    // Call backend to create a Stripe session
    const response = await fetch("http://localhost:4242/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: {
          name: productName,
          price: price,
          cancelPath: cancelPath
        }
      })
    });

    const session = await response.json();

    if (!session.id) {
      throw new Error("No session ID returned from server.");
    }

    // Redirect to Stripe Checkout
    const { error } = await stripe.redirectToCheckout({ sessionId: session.id });

    if (error) {
      console.error("Stripe redirect error:", error);
      alert("Payment failed. Please try again.");
    }
  } catch (err) {
    console.error("Checkout error:", err);
    alert("Something went wrong starting checkout. Please try again.");
  }
}

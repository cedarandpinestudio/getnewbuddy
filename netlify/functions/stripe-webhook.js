// netlify/functions/stripe-webhook.js
import Stripe from "stripe";
import fetch from "node-fetch"; // for calling Brevo API

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler({ body, headers }) {
  const sig = headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Send email via Brevo API
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          sender: { name: "NewBuddy", email: "aishainparis@gmail.com" },
          to: [{ email: session.customer_details.email }],
          subject: "Your NewBuddy Booking Confirmation",
          htmlContent: `<html><body><p>Thanks for booking your NewBuddy day!</p></body></html>`
        })
      });
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error("Webhook error:", err);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }
}
ß
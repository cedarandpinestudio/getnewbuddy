import Stripe from "stripe";
import fetch from "node-fetch";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Needed so Netlify gives us raw body
export const config = {
  bodyParser: false,
};

export async function handler(event) {
  const sig = event.headers["stripe-signature"];
  let stripeEvent;

  try {
    // Read raw body for signature verification
    const rawBody = Buffer.from(event.body, "utf8");
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object;
      const email = session.customer_details?.email;

      console.log("✅ Payment completed for:", email);

      // Send Brevo confirmation email
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          sender: { name: "NewBuddy", email: "aishainparis@gmailß.com" },
          to: [{ email }],
          subject: "Your NewBuddy Booking Confirmation",
          htmlContent: `<p>Thanks for booking with NewBuddy!</p>`,
        }),
      });
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error("❌ Webhook Error:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }
}

import Stripe from "stripe";
import fetch from "node-fetch";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Required for Stripe signature verification
export const config = {
  bodyParser: false,
};

export async function handler(event) {
  const sig = event.headers["stripe-signature"];
  let stripeEvent;

  try {
    // Read raw body
    const rawBody = Buffer.from(event.body, "utf8");

    // Verify Stripe webhook signature
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("✅ Stripe event verified:", stripeEvent.type);

    if (stripeEvent.type === "checkout.session.completed") {
      const session = stripeEvent.data.object;
      console.log("session", session)
      const customerEmail = session.customer_details?.email;

      console.log("📦 Checkout completed for:", customerEmail);

      if (!customerEmail) {
        console.error("❌ No customer email found");
        return { statusCode: 400, body: "No customer email found" };
      }

      // ---------------------------
      // 1️⃣ Send confirmation to customer
      // ---------------------------
      const customerEmailPayload = {
        sender: { name: "newbuddy", email: "hello@getnewbuddy.com" },
        to: [{ email: customerEmail }],
        subject: "Your newbuddy Booking Confirmation",
        htmlContent: `
          <html>
            <body>
              <h2>Thanks for booking your newbuddy day in Seattle! 🎉</h2>
              <p>We’ll be in touch soon with your host details and itinerary.</p>
            </body>
          </html>
        `,
      };

      console.log("📨 Sending confirmation email to:", customerEmail);
      await sendBrevoEmail(customerEmailPayload);

      // ---------------------------
      // 2️⃣ Send booking notification to owner
      // ---------------------------
      const ownerEmailPayload = {
        sender: { name: "newbuddy Booking Bot", email: "hello@getnewbuddy.com" },
        to: [{ email: "hello@getnewbuddy.com" }],
        subject: "📢 New newbuddy Booking!",
        htmlContent: `
          <html>
            <body>
              <h2>New Booking Alert 🚀</h2>
              <p><strong>Customer Email:</strong> ${customerEmail}</p>
              <p><strong>Amount Paid:</strong> $${session.amount_total / 100}</p>
              <p><strong>Session ID:</strong> ${session.id}</p>
            </body>
          </html>
        `,
      };

      console.log("📨 Sending owner notification email to: hello@getnewbuddy.com");
      await sendBrevoEmail(ownerEmailPayload);

      console.log("✅ Both emails sent successfully");
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }
}

// 📧 Helper function to send Brevo emails
async function sendBrevoEmail(payload) {
  try {
    const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const brevoText = await brevoRes.text();
    console.log("📧 Brevo API response:", brevoRes.status, brevoText);

    if (!brevoRes.ok) {
      throw new Error(`Brevo send failed: ${brevoRes.status} ${brevoText}`);
    }
  } catch (error) {
    console.error("❌ Brevo send error:", error.message);
  }
}

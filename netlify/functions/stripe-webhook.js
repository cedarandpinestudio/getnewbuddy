import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Netlify raw body parsing for Stripe signature verification
export const config = {
  bodyParser: false,
};

export async function handler(event) {
  const sig = event.headers["stripe-signature"];
  let stripeEvent;

  try {
    // Read raw body as buffer
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
      const customerEmail = session.customer_details?.email;

      console.log("📦 Checkout session completed for:", customerEmail);

      if (!customerEmail) {
        console.error("❌ No customer email found in session");
        return { statusCode: 400, body: "No customer email found" };
      }

      // 📧 Send confirmation email via Brevo
      const brevoPayload = {
        sender: { name: "NewBuddy", email: "aishainparis@gmail.com" },
        to: [{ email: customerEmail }],
        subject: "Your NewBuddy Booking Confirmation",
        htmlContent: `
          <html>
            <body>
              <h2>Thanks for booking your NewBuddy day in Seattle! 🎉</h2>
              <p>We’ll be in touch soon with your host details and itinerary.</p>
            </body>
          </html>
        `,
      };

      console.log("📨 Sending Brevo email to:", customerEmail);
      console.log("📨 Brevo payload:", JSON.stringify(brevoPayload));

      const brevoRes = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify(brevoPayload),
      });

      const brevoText = await brevoRes.text();
      console.log("📧 Brevo API response:", brevoRes.status, brevoText);

      if (!brevoRes.ok) {
        throw new Error(
          `Brevo send failed: ${brevoRes.status} ${brevoText}`
        );
      }

      console.log("✅ Brevo email sent successfully to:", customerEmail);
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }
}

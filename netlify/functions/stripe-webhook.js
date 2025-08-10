// netlify/functions/stripe-webhook.js (your file)
import Stripe from "stripe";
import fetch from "node-fetch";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = { bodyParser: false };

export async function handler(event) {
  const sig = event.headers["stripe-signature"];
  try {
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : Buffer.from(event.body, "utf8");

    const evt = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    if (evt.type === "checkout.session.completed") {
      const session = evt.data.object;

      // If you want line items too:
      const full = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "customer"]
      });

      const { guide, bookingType, date, hours, notes } = session.metadata || {};
      const items = (full.line_items?.data || []).map(li => ({
        name: li.description,
        qty: li.quantity,
        total: (li.amount_total / 100).toFixed(2)
      }));

      const customerEmail = session.customer_details?.email;

      const itemsHtml = items.map(
        i => `<li>${i.qty} × ${i.name} — $${i.total}</li>`
      ).join("");

      const detailsHtml = `
        <ul>
          ${guide ? `<li><strong>Guide:</strong> ${guide}</li>` : ""}
          ${bookingType ? `<li><strong>Booking Type:</strong> ${bookingType}</li>` : ""}
          ${date ? `<li><strong>Date:</strong> ${date}</li>` : ""}
          ${hours ? `<li><strong>Hours:</strong> ${hours}</li>` : ""}
          ${notes ? `<li><strong>Notes:</strong> ${notes}</li>` : ""}
        </ul>
      `;

      // Customer email
      await sendBrevoEmail({
        sender: { name: "newbuddy", email: "hello@getnewbuddy.com" },
        to: [{ email: customerEmail }],
        subject: "Your newbuddy Booking Confirmation",
        htmlContent: `
          <h2>Thanks for booking your newbuddy day in Seattle! 🎉</h2>
          <p>We’ll be in touch soon with your host details and itinerary.</p>
          <h3>Your Booking</h3>
          ${detailsHtml}
          <h3>Summary</h3>
          <ul>${itemsHtml}</ul>
          <p><strong>Total Paid:</strong> $${(session.amount_total/100).toFixed(2)}</p>
        `,
      });

      // Owner email
      await sendBrevoEmail({
        sender: { name: "newbuddy Booking Bot", email: "hello@getnewbuddy.com" },
        to: [{ email: "hello@getnewbuddy.com" }],
        subject: "📢 New newbuddy Booking!",
        htmlContent: `
          <h2>New Booking Alert 🚀</h2>
          <p><strong>Customer:</strong> ${customerEmail}</p>
          ${detailsHtml}
          <h3>Items</h3>
          <ul>${itemsHtml}</ul>
          <p><strong>Total Paid:</strong> $${(session.amount_total/100).toFixed(2)}</p>
          <p><strong>Session ID:</strong> ${session.id}</p>
        `,
      });
    }

    return { statusCode: 200, body: JSON.stringify({ received: true }) };
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }
}

async function sendBrevoEmail(payload) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  console.log("📧 Brevo API response:", res.status, text);
  if (!res.ok) throw new Error(text);
}

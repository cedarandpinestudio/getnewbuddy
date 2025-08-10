// netlify/functions/create-checkout-session.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { product, cancelPath, booking = {} } = JSON.parse(event.body || "{}");

    console.log("📦 Incoming checkout request:", { product, booking, cancelPath });

    if (!product?.name || typeof product?.price !== "number") {
      console.error("❌ Missing/invalid product payload", product);
      return { statusCode: 400, body: JSON.stringify({ error: "Product name and numeric price are required." }) };
    }

    const siteUrl = process.env.SITE_URL || "https://getnewbuddy.com";

    // Metadata MUST be strings
    const md = {
      productName: product.name,
      guide: booking.guide ? String(booking.guide) : "",
      bookingType: booking.bookingType ? String(booking.bookingType) : "",
      date: booking.date ? String(booking.date) : "",
      hours: booking.hours != null ? String(booking.hours) : "",
      notes: booking.notes ? String(booking.notes) : "",
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // payment_method_types is optional; Stripe will pick automatically
      // payment_method_types: ["card"],

      metadata: md,

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: product.name }, // keep minimal
            unit_amount: Math.round(product.price * 100), // integer cents
          },
          quantity: 1,
        },
      ],

      success_url: `${siteUrl}/success`,
      cancel_url: `${siteUrl}${cancelPath || ""}`,
    });

    console.log("✅ Session created:", session.id);
    return { statusCode: 200, body: JSON.stringify({ id: session.id }) };
  } catch (err) {
    // Log EVERYTHING useful
    console.error("❌ Stripe create session error:", err?.message || err);
    if (err?.raw) console.error("Stripe raw:", JSON.stringify(err.raw));
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to create checkout session." }) };
  }
}

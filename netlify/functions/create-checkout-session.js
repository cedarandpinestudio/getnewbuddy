// netlify/functions/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { product, cancelPath } = JSON.parse(event.body);

    if (!product?.name || !product?.price) {
      return { statusCode: 400, body: JSON.stringify({ error: "Product name and price are required." }) };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: product.name },
            unit_amount: product.price * 100
          },
          quantity: 1
        }
      ],
      mode: "payment",
      success_url: `${process.env.SITE_URL}/success`,
      cancel_url: `${process.env.SITE_URL}${cancelPath || ""}`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id })
    };
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create checkout session." })
    };
  }
}

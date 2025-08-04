import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get the absolute path to the project root .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootEnvPath = path.resolve(__dirname, "../.env");

// Load .env from project root
dotenv.config({ path: rootEnvPath });

console.log("Stripe key from env:", process.env.STRIPE_SECRET_KEY); // sanity check

import express from "express";
import Stripe from "stripe";
import cors from "cors";
import SibApiV3Sdk from "@sendinblue/client";

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- STRIPE SETUP --------------------
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const siteUrl = process.env.SITE_URL;

// -------------------- BREVO SETUP --------------------
const brevo = new SibApiV3Sdk.TransactionalEmailsApi();
brevo.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

// -------------------- SEND ITINERARY FORM --------------------
app.post("/send-itinerary-request", async (req, res) => {
  const { email, goals, productName } = req.body;

  if (!email || !productName) {
    return res.status(400).json({ error: "Email and product are required." });
  }

  try {
    await brevo.sendTransacEmail({
      sender: { email: "youremail@domain.com", name: "Newbuddy" },
      to: [{ email: "youremail@domain.com" }], // Send to YOU
      subject: `New Itinerary Request – ${productName}`,
      htmlContent: `
        <h2>New Itinerary Request</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Goals:</strong> ${goals || "(none provided)"}</p>
      `
    });

    res.json({ success: true, message: "Itinerary request sent successfully." });
  } catch (error) {
    console.error("Brevo Email Error:", error);
    res.status(500).json({ error: "Failed to send itinerary request." });
  }
});

// -------------------- CREATE STRIPE CHECKOUT SESSION --------------------
app.post("/create-checkout-session", async (req, res) => {
  const { product, cancelPath } = req.body;
  console.log("Incoming checkout request:", req.body);

  if (!product?.name || !product?.price) {
    return res.status(400).json({ error: "Product name and price are required." });
  }

  try {
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
      success_url: `${siteUrl}/success`,
      cancel_url: `${siteUrl}${cancelPath || ""}`
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    res.status(500).json({ error: "Failed to create checkout session." });
  }
});

// -------------------- START SERVER --------------------
app.listen(4242, () => console.log("✅ Server running on port 4242"));

// netlify/functions/send-itinerary-request.js
import SibApiV3Sdk from "@sendinblue/client";

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }

  try {
    const { email, goals, productName } = JSON.parse(event.body);

    if (!email || !productName) {
      return { statusCode: 400, body: JSON.stringify({ error: "Email and product are required." }) };
    }

    const brevo = new SibApiV3Sdk.TransactionalEmailsApi();
    brevo.setApiKey(
      SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    await brevo.sendTransacEmail({
      sender: { email: "youremail@domain.com", name: "Newbuddy" },
      to: [{ email: "youremail@domain.com" }],
      subject: `New Itinerary Request – ${productName}`,
      htmlContent: `
        <h2>New Itinerary Request</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>Goals:</strong> ${goals || "(none provided)"}</p>
      `,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: "Itinerary request sent successfully." }),
    };
  } catch (error) {
    console.error("Brevo Email Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: "Failed to send itinerary request." }) };
  }
}

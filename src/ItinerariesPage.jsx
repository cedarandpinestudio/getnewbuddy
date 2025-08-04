import { useState } from "react";
import { handleCheckout } from "./utils/checkout";
import { FaMapMarkerAlt, FaBolt } from "react-icons/fa";

export default function Itineraries() {
  const [formData, setFormData] = useState({
    oneDay: { name: "", email: "", goals: "" },
    threeDay: { name: "", email: "", goals: "" },
    quick: { name: "", email: "", goals: "" },
  });

  const [errors, setErrors] = useState({
    oneDay: { name: "", email: "" },
    threeDay: { name: "", email: "" },
    quick: { email: "" },
  });

  const handleChange = (plan, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [plan]: { ...prev[plan], [field]: value },
    }));

    // Clear error when user types
    setErrors((prev) => ({
      ...prev,
      [plan]: { ...prev[plan], [field]: "" },
    }));
  };

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (planName, price) => {
    const { name, email, goals } = formData[planName];
    let valid = true;
    const newErrors = { ...errors };

    // Name validation for 1-day and 3-day
    if (planName !== "quick") {
      if (!name.trim()) {
        newErrors[planName].name = "Name is required.";
        valid = false;
      } else {
        newErrors[planName].name = "";
      }
    }

    // Email validation for all plans
    if (!isValidEmail(email)) {
      newErrors[planName].email = "Please enter a valid email address.";
      valid = false;
    } else {
      newErrors[planName].email = "";
    }

    setErrors(newErrors);

    if (!valid) return;

    try {
      // ✅ Call Netlify Function instead of /send-itinerary-request
      await fetch("/.netlify/functions/send-itinerary-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          goals,
          productName: planName,
        }),
      });

      // ✅ Proceed to checkout via Netlify Function Stripe integration
      handleCheckout(`${planName} Plan`, price, "/itineraries");
    } catch (error) {
      console.error("Error sending itinerary request:", error);
      alert("Something went wrong sending your request. Please try again.");
    }
  };

  return (
    <div className="itineraries-page">
      <div className="itineraries-header">
        <h1><FaMapMarkerAlt className="icon" /> Custom Seattle Itineraries</h1>
        <p>
          Explore Seattle like a local — even without a guide. Get a curated plan tailored
          to your vibe and interests. Tell us what you’re looking for, and we’ll email your
          custom itinerary within 24 hours.
        </p>
      </div>

      {/* 1-Day Plan */}
      <div className="plan-card">
        <h3>1‑Day Plan</h3>
        <p className="price">$50 — Full‑day schedule with dining & activity recommendations.</p>
        <input
          type="text"
          placeholder="Your name"
          value={formData.oneDay.name}
          onChange={(e) => handleChange("oneDay", "name", e.target.value)}
        />
        {errors.oneDay.name && <p className="error-text">{errors.oneDay.name}</p>}

        <input
          type="email"
          placeholder="Your email"
          value={formData.oneDay.email}
          onChange={(e) => handleChange("oneDay", "email", e.target.value)}
        />
        {errors.oneDay.email && <p className="error-text">{errors.oneDay.email}</p>}

        <textarea
          placeholder="Tell us about your goals, vibe, or must‑do's..."
          value={formData.oneDay.goals}
          onChange={(e) => handleChange("oneDay", "goals", e.target.value)}
        />
        <button
          className="buy-button"
          onClick={() => handleSubmit("oneDay", 50)}
        >
          Buy 1‑Day Plan
        </button>
      </div>

      {/* 3-Day Plan */}
      <div className="plan-card">
        <h3>3‑Day Plan</h3>
        <p className="price">$120 — Three days of curated activities & food stops.</p>
        <input
          type="text"
          placeholder="Your name"
          value={formData.threeDay.name}
          onChange={(e) => handleChange("threeDay", "name", e.target.value)}
        />
        {errors.threeDay.name && <p className="error-text">{errors.threeDay.name}</p>}

        <input
          type="email"
          placeholder="Your email"
          value={formData.threeDay.email}
          onChange={(e) => handleChange("threeDay", "email", e.target.value)}
        />
        {errors.threeDay.email && <p className="error-text">{errors.threeDay.email}</p>}

        <textarea
          placeholder="Tell us about your goals, vibe, or must‑do's..."
          value={formData.threeDay.goals}
          onChange={(e) => handleChange("threeDay", "goals", e.target.value)}
        />
        <button
          className="buy-button"
          onClick={() => handleSubmit("threeDay", 120)}
        >
          Buy 3‑Day Plan
        </button>
      </div>

      {/* Quick Rec List */}
      <div className="quick-rec">
        <h3><FaBolt className="icon" /> Quick Rec List</h3>
        <p className="price">$25 — Our “top picks” for a fast but authentic trip.</p>
        <input
          type="email"
          placeholder="Your email"
          value={formData.quick.email}
          onChange={(e) => handleChange("quick", "email", e.target.value)}
        />
        {errors.quick.email && <p className="error-text">{errors.quick.email}</p>}

        <button
          className="buy-button"
          onClick={() => handleSubmit("quick", 25)}
        >
          Buy Quick Rec List
        </button>
      </div>
    </div>
  );
}

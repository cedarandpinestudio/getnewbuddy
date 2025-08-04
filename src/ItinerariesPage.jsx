import { useState } from "react";
import { handleCheckout } from "./utils/checkout";
import { FaMapMarkerAlt, FaBolt } from "react-icons/fa";

export default function Itineraries() {
  const [formData, setFormData] = useState({
    oneDay: { name: "", email: "", goals: "" },
    threeDay: { name: "", email: "", goals: "" },
    quick: { name: "", email: "", goals: "" },
  });

  const handleChange = (plan, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [plan]: { ...prev[plan], [field]: value },
    }));
  };

  const handleSubmit = (planName, price) => {
    const { name, email, goals } = formData[planName];
    if (!name || !email) {
      alert("Please fill in your name and email.");
      return;
    }

    // Send itinerary request to backend
    fetch("/send-itinerary-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        goals,
        productName: planName,
      }),
    });

    // Proceed to checkout
    handleCheckout(`${planName} Plan`, price, "/itineraries");
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

      {/* Custom Plans */}
      <div className="plan-card">
        <h3>1‑Day Plan</h3>
        <p className="price">$50 — Full‑day schedule with dining & activity recommendations.</p>
        <input
          type="text"
          placeholder="Your name"
          value={formData.oneDay.name}
          onChange={(e) => handleChange("oneDay", "name", e.target.value)}
        />
        <input
          type="email"
          placeholder="Your email"
          value={formData.oneDay.email}
          onChange={(e) => handleChange("oneDay", "email", e.target.value)}
        />
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

      <div className="plan-card">
        <h3>3‑Day Plan</h3>
        <p className="price">$120 — Three days of curated activities & food stops.</p>
        <input
          type="text"
          placeholder="Your name"
          value={formData.threeDay.name}
          onChange={(e) => handleChange("threeDay", "name", e.target.value)}
        />
        <input
          type="email"
          placeholder="Your email"
          value={formData.threeDay.email}
          onChange={(e) => handleChange("threeDay", "email", e.target.value)}
        />
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
          type="text"
          placeholder="Your name"
          value={formData.quick.name}
          onChange={(e) => handleChange("quick", "name", e.target.value)}
        />
        <input
          type="email"
          placeholder="Your email"
          value={formData.quick.email}
          onChange={(e) => handleChange("quick", "email", e.target.value)}
        />
        <textarea
          placeholder="Tell us about your goals, vibe, or must‑do's..."
          value={formData.quick.goals}
          onChange={(e) => handleChange("quick", "goals", e.target.value)}
        />
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

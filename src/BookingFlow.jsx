import { useState } from "react";
import { handleCheckout } from "./utils/checkout";
import { parseISO, format } from "date-fns";

// Guide images
import aisha from "./assets/aisha-prof-pic.svg";
import jan from "./assets/jan-prof-pic.svg";
import jacob from "./assets/jacob-prof-pic.svg";

export default function BookingFlow() {
  // State
  const [selectedVibe, setSelectedVibe] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [price, setPrice] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGuide, setSelectedGuide] = useState("");

  // Data
  const vibes = [
    { id: "foodie", label: "🍽️ Foodie" },
    { id: "artsy", label: "🎨 Artsy" },
    { id: "nature", label: "🌿 Nature Lover" },
    { id: "mix", label: "✨ Mix" },
  ];

  const guides = [
    {
      id: "aisha",
      name: "Aisha",
      bio: "Loves coffee shops, views, and ferry rides.",
      img: aisha,
    },
    {
      id: "janel",
      name: "Janel",
      bio: "Loves live music, art, and exploring neighborhoods.",
      img: jan,
    },
    {
      id: "jacob",
      name: "Jacob",
      bio: "Passionate about music, coffee, and hidden gems.",
      img: jacob,
    },
  ];

  return (
    <div className="booking-flow">

      {/* Step 1: Pick Your Vibe */}
      <div className="booking-step vibe-step">
        <h2>✨ Step 1: Pick Your Vibe</h2>
        <div className="vibe-options">
          {vibes.map((v) => (
            <button
              key={v.id}
              className={`vibe-btn ${selectedVibe === v.label ? "selected" : ""}`}
              onClick={() => setSelectedVibe(v.label)}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Choose Your Package */}
      {selectedVibe && (
        <div className="booking-step">
          <h2>📦 Step 2: Choose Your Package</h2>
          <div className="package-options">
            <button
              className={`package-btn ${selectedPackage === "Half-Day" ? "selected" : ""}`}
              onClick={() => {
                setSelectedPackage("Half-Day");
                setPrice(150);
              }}
            >
              Half-Day (4 hrs) — $150
            </button>
            <button
              className={`package-btn ${selectedPackage === "Full-Day" ? "selected" : ""}`}
              onClick={() => {
                setSelectedPackage("Full-Day");
                setPrice(250);
              }}
            >
              Full-Day (8 hrs) — $250
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select Date */}
      {selectedPackage && (
        <div className="booking-step">
          <h2>📅 Step 3: Select Your Date</h2>
          <input
            type="date"
            className="date-picker"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
      )}

      {/* Step 4: Choose Your Guide */}
      {selectedDate && (
        <div className="booking-step">
          <h2>🧑‍🤝‍🧑 Step 4: Choose Your Guide</h2>
          <div className="guide-list">
            {guides.map((g) => (
              <div
                key={g.id}
                className={`guide-card ${selectedGuide === g.name ? "selected" : ""}`}
                onClick={() => setSelectedGuide(g.name)}
              >
                <img src={g.img} className="guide-img" alt={g.name} />
                <div>
                  <p className="guide-name">{g.name}</p>
                  <p>{g.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 5: Confirm & Pay */}
      {selectedGuide && (
        <div className="booking-step confirm-pay">
          <h2>💳 Step 5: Confirm & Pay</h2>

          <div className="summary-card">
            <div className="summary-row">
              <span className="label">Vibe:</span>
              <span className="value">{selectedVibe}</span>
            </div>
            <div className="summary-row">
              <span className="label">Package:</span>
              <span className="value">
                {selectedPackage} — ${price}
              </span>
            </div>
            <div className="summary-row">
              <span className="label">Date:</span>
              <span className="value">
                {format(parseISO(selectedDate), "MMMM do, yyyy")}
              </span>
            </div>
            <div className="summary-row">
              <span className="label">Guide:</span>
              <span className="value">{selectedGuide}</span>
            </div>
          </div>

          <button
            className="pay-button"
            onClick={() =>
              handleCheckout(
                `${selectedPackage} Local Buddy (${selectedVibe})`,
                price,
                "/book"
              )
            }
          >
            Confirm & Pay ${price}
          </button>
        </div>
      )}
    </div>
  );
}

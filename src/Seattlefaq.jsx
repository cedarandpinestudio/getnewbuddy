import React, { useState, useRef, useEffect } from "react";

function AccordionItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (isOpen) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  return (
    <div className="accordion-item">
      <button className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <span>{title}</span>
        <span className="accordion-icon">{isOpen ? "−" : "+"}</span>
      </button>
      <div
        ref={contentRef}
        className="accordion-content"
        style={{ maxHeight: height }}
      >
        <div className="accordion-inner">{children}</div>
      </div>
    </div>
  );
}

export default function SeattleFAQPage() {
  return (
    <div
      className="faq-page"
      style={{ maxWidth: "768px", margin: "0 auto", padding: "24px", color: "#333" }}
    >
      <h1 style={{ fontSize: "32px", fontWeight: "bold", marginBottom: "24px" }}>
        Our Seattle FAQ Guide
      </h1>

      <p style={{ marginBottom: "24px" }}>
        Welcome to Seattle! Whether you're planning your trip or just booked your
        Newbuddy experience, this guide is here to help you get the most out of
        your time in the Emerald City. We’ve got you covered with everything
        from neighborhood insights to transportation tips.
      </p>

      <AccordionItem title="🌊 Popular Neighborhoods">
        <p><strong>Capitol Hill:</strong> Trendy, vibrant, and full of life. Expect great nightlife, coffee shops, LGBTQ+ friendly spaces, and indie boutiques.</p>
        <p><strong>Ballard:</strong> Laid-back with Scandinavian roots. You'll find cute cafes, breweries, and the famous Ballard Locks.</p>
        <p><strong>Fremont:</strong> Quirky and artsy with vintage shops, murals, and the iconic Fremont Troll. Great for creative vibes.</p>
        <p><strong>Belltown:</strong> Walkable and central. Close to Pike Place Market and the waterfront. Ideal if you want to be in the middle of the action.</p>
        <p><strong>Queen Anne:</strong> Quiet and scenic. Known for Kerry Park's view of the Space Needle and charming architecture.</p>
      </AccordionItem>

      <AccordionItem title="🚆 How to Get to Seattle">
        <p><strong>From Seattle-Tacoma International Airport (SEA):</strong></p>
        <ul>
          <li><strong>Link Light Rail:</strong> Direct train from the airport to downtown. ~$3. Easy and reliable.</li>
          <li><strong>Rideshare:</strong> Uber/Lyft pickup is clearly marked at the parking garage. Expect $35–50 to downtown.</li>
          <li><strong>Shuttle/Taxi:</strong> Available, but often more expensive than rideshare.</li>
        </ul>
        <p><strong>From Portland/Vancouver BC:</strong></p>
        <ul>
          <li><strong>Amtrak:</strong> Beautiful scenic ride. Drops you at King Street Station in downtown Seattle.</li>
          <li><strong>Driving:</strong> I-5 northbound can be traffic-heavy during peak hours, so plan ahead.</li>
        </ul>
      </AccordionItem>

      <AccordionItem title="🌧️ Weather + Packing Tips">
        <ul>
          <li><strong>Spring/Fall:</strong> Pack layers. It can go from sunny to drizzly within an hour.</li>
          <li><strong>Summer:</strong> Usually gorgeous and dry. Still bring a light jacket for evenings.</li>
          <li><strong>Winter:</strong> Cool and rainy. Waterproof shoes and an umbrella recommended.</li>
        </ul>
        <p><strong>Essentials:</strong></p>
        <ul>
          <li>Comfortable walking shoes</li>
          <li>Reusable water bottle</li>
          <li>Portable phone charger</li>
        </ul>
      </AccordionItem>

      <AccordionItem title="❓ How Does Newbuddy Work?">
        <ol>
          <li>Book your experience through our website.</li>
          <li>We’ll match you with a friendly local host based on your vibe and goals.</li>
          <li>You'll receive an itinerary and confirmation email before your adventure begins.</li>
          <li>Show up, explore, and enjoy your day in Seattle like a local!</li>
        </ol>
      </AccordionItem>

      <AccordionItem title="🌍 Bonus Tips">
        <ul>
          <li>Seattle is very walkable, but you can also use the <strong>One Bus Away</strong> app to navigate public transit.</li>
          <li>Many local spots are card-only, so bring a credit/debit card.</li>
          <li>Tipping is standard: 15–20% at restaurants and for guides if you're happy with the experience.</li>
        </ul>
      </AccordionItem>

      <p style={{ marginTop: "24px" }}>
        Got more questions? DM us on Instagram
        <a
          href="https://instagram.com/getnewbuddy"
          style={{ color: "#1d4ed8", textDecoration: "underline", marginLeft: "4px" }}
        >@getnewbuddy </a>
        or email <a href="mailto:hello@getnewbuddy.com" style={{ color: "#1d4ed8", textDecoration: "underline" }}>hello@getnewbuddy.com</a>.
      </p>
    </div>
  );
}

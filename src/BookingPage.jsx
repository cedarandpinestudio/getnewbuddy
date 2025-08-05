import BookingFlow from "./BookingFlow.jsx";

export default function BookingPage() {
  return (
    <div className="booking-container">
      <div className="booking-page">
        <h1>Book Your Local Buddy</h1>
        <p>Pick your vibe, date, choose your guide, and book your custom local experience.</p>

        <BookingFlow /> {/* ← This is the new component */}
      </div>
    </div>
  );
}

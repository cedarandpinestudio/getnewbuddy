import { Link } from "react-router-dom";

export default function SuccessPage() {
  return (
    <div className="booking-container">
      <div className="success-card">
        <h1>🎉  Booking Confirmed!</h1>
        <p>Yay! We can’t wait to show you around Seattle.  
        We’ll email you with your local buddy’s details soon.</p>

        <Link to="/">
          <button className="success-button">Back to Home</button>
        </Link>
      </div>
    </div>
  );
}

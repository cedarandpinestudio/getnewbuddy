import { Link } from "react-router-dom";

export default function CancelPage() {
  return (
    <div className="cancel-page" style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Booking Cancelled</h1>
      <p>Your booking was not completed. No payment was made.</p>
      <Link to="/book">
        <button style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}>
          Try Again
        </button>
      </Link>
    </div>
  );
}
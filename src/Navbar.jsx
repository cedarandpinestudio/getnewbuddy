import { Link } from "react-router-dom";
import logo from "./assets/white-newbuddy-logo.svg"; // ⬅️ replace with your logo path in public/images

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-content">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <img src={logo} alt="NewBuddy Logo"className="site-nav-logo"/>
        </Link>

        {/* Links */}
        <div className="nav-links">
          <Link to="/itineraries">Itineraries</Link>
          <Link to="/book">Book Now</Link>
        </div>
      </div>
    </nav>
  );
}

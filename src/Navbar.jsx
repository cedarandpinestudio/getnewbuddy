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
          <Link to="/itineraries" className="hide-on-mobile">Itineraries</Link>
          <Link to="/book" className="hide-on-mobile">Book Now</Link>
          <Link to="/seattledeets" className="hide-on-mobile">Seattle FAQ</Link>
        </div>
      </div>
    </nav>
  );
}

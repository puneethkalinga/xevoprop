import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Bell,
  Menu,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";

import { LogoWordmark } from "./Logo";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* PUBLIC NAVIGATION */
  const publicLinks = [
    { label: "Properties", path: "/properties" },
    { label: "Projects", path: "/projects" },
    { label: "Developers", path: "/developers" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  /* BUYER NAVIGATION */
  const buyerLinks = [
    { label: "Properties", path: "/properties" },
    { label: "Projects", path: "/projects" },
    { label: "Saved", path: "/favorites" },
    { label: "Enquiries", path: "/my-enquiries" },
    { label: "Visits", path: "/my-visits" },
  ];

  /* SELLER NAVIGATION */
  const sellerLinks = [
    { label: "Properties", path: "/properties" },
    { label: "My Properties", path: "/my-properties" },
    { label: "List Property", path: "/list-property" },
    { label: "Leads", path: "/leads" },
  ];

  /* DEVELOPER / BUILDER NAVIGATION */
  const developerLinks = [
    { label: "Properties", path: "/properties" },
    { label: "Projects", path: "/projects" },
    { label: "My Projects", path: "/my-projects" },
    { label: "Add Project", path: "/add-project" },
    { label: "List Property", path: "/list-property" },
    { label: "Leads", path: "/leads" },
  ];

  let navLinks = publicLinks;
  if (user) {
    const role = user.role || "Buyer";
    if (role === "Seller") navLinks = sellerLinks;
    else if (role === "Developer" || role === "Builder") navLinks = developerLinks;
    else navLinks = buyerLinks;
  }

  const closeMenu = () => {
    setMobileOpen(false);
  };

  return (
    <header className={`xevoprop-nav-header ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-container">
        {/* BRAND LOGO */}
        <Link to="/" className="nav-logo" onClick={closeMenu} aria-label="XevopropTech Home">
          <LogoWordmark size="default" />
        </Link>

        {/* DESKTOP CENTER NAVIGATION */}
        <nav className="nav-center-menu">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* DESKTOP RIGHT ACTIONS */}
        <div className="nav-right-actions">
          {!user ? (
            <>
              <Link to="/login" className="nav-login-btn">
                Sign In
              </Link>

              <Link to="/register" className="nav-cta-btn">
                Get Started
              </Link>
            </>
          ) : (
            <div className="nav-auth-group">
              <Link to="/notifications" className="nav-action-icon-btn" aria-label="Notifications" title="Notifications">
                <Bell size={18} />
              </Link>

              <Link to="/dashboard" className="nav-dashboard-pill">
                Dashboard
              </Link>

              <Link to="/profile" className="nav-avatar-btn" aria-label="Profile" title="My Profile">
                <span>{user.name?.charAt(0).toUpperCase() || "U"}</span>
              </Link>
            </div>
          )}

          {/* MOBILE HAMBURGER BUTTON */}
          <button
            type="button"
            className="nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileOpen && (
        <div className="nav-mobile-drawer">
          <nav className="nav-mobile-links">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  isActive ? "nav-mobile-item active" : "nav-mobile-item"
                }
              >
                <span>{link.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="nav-mobile-auth">
            {!user ? (
              <>
                <Link to="/login" onClick={closeMenu} className="nav-mobile-btn-outline">
                  Sign In
                </Link>
                <Link to="/register" onClick={closeMenu} className="nav-mobile-btn-primary">
                  Get Started
                </Link>
              </>
            ) : (
              <Link to="/dashboard" onClick={closeMenu} className="nav-mobile-btn-primary">
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
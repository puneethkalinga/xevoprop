import { Link, NavLink, useLocation } from "react-router-dom";
import {
  Search,
  Heart,
  MessageCircle,
  Home,
  Plus,
  Bell,
  Building2,
  BarChart3,
  UserRound,
  LogIn,
  Menu,
  X,
  CalendarDays,
  ChevronDown,
  Info,
  Phone,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";

import { LogoWordmark } from "./Logo";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
  const { user } = useAuth();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* PUBLIC NAVIGATION */
  const publicLinks = [
    { label: "Properties", path: "/properties", icon: Search },
    { label: "Projects", path: "/projects", icon: Building2 },
    { label: "Developers", path: "/developers", icon: Building2 },
  ];

  /* BUYER NAVIGATION */
  const buyerLinks = [
    { label: "Properties", path: "/properties", icon: Search },
    { label: "Projects", path: "/projects", icon: Building2 },
    { label: "Saved", path: "/favorites", icon: Heart },
    { label: "Enquiries", path: "/my-enquiries", icon: MessageCircle },
    { label: "Visits", path: "/my-visits", icon: CalendarDays },
  ];

  /* SELLER NAVIGATION */
  const sellerLinks = [
    { label: "Properties", path: "/properties", icon: Search },
    { label: "My Properties", path: "/my-properties", icon: Home },
    { label: "List Property", path: "/list-property", icon: Plus },
    { label: "Leads", path: "/leads", icon: BarChart3 },
  ];

  /* DEVELOPER NAVIGATION */
  const developerLinks = [
    { label: "Properties", path: "/properties", icon: Search },
    { label: "Projects", path: "/projects", icon: Building2 },
    { label: "My Projects", path: "/my-projects", icon: Building2 },
    { label: "Add Project", path: "/add-project", icon: Plus },
    { label: "Leads", path: "/leads", icon: BarChart3 },
  ];

  let navLinks = publicLinks;
  if (user) {
    const role = user.role || "Buyer";
    if (role === "Seller") navLinks = sellerLinks;
    else if (role === "Developer") navLinks = developerLinks;
    else navLinks = buyerLinks;
  }

  const moreLinks = [
    { label: "About Xevotech", path: "/about", icon: Info },
    { label: "Contact Us", path: "/contact", icon: Phone },
  ];

  const closeMenu = () => {
    setMobileOpen(false);
    setMoreOpen(false);
  };

  const isMoreActive = moreLinks.some((link) => location.pathname === link.path);

  return (
    <header className={`xevoprop-nav-header ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="nav-container">
        {/* LOGO */}
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <LogoWordmark size="default" />
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="nav-center-menu">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  isActive ? "nav-item active" : "nav-item"
                }
              >
                {Icon && <Icon size={14} className="nav-icon" />}
                <span>{link.label}</span>
              </NavLink>
            );
          })}

          {/* MORE DROPDOWN */}
          <div className="nav-more-wrapper">
            <button
              type="button"
              className={`nav-item nav-more-trigger ${isMoreActive ? "active" : ""}`}
              onClick={() => setMoreOpen(!moreOpen)}
              aria-expanded={moreOpen}
            >
              <span>More</span>
              <ChevronDown size={13} className={`nav-chevron ${moreOpen ? "open" : ""}`} />
            </button>

            {moreOpen && (
              <div className="nav-dropdown-glass">
                {moreLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.path}
                      to={link.path}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        isActive ? "nav-dropdown-item active" : "nav-dropdown-item"
                      }
                    >
                      <Icon size={15} />
                      <span>{link.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT ACTIONS */}
        <div className="nav-right-actions">
          {!user ? (
            <>
              <Link to="/login" className="nav-login-btn">
                <LogIn size={15} />
                <span>Sign In</span>
              </Link>

              <Link to="/register" className="nav-cta-btn">
                <span>Get Started</span>
                <Sparkles size={14} />
              </Link>
            </>
          ) : (
            <div className="nav-auth-group">
              <Link to="/notifications" className="nav-action-icon-btn" aria-label="Notifications">
                <Bell size={18} />
              </Link>

              <Link to="/dashboard" className="nav-dashboard-pill">
                Dashboard
              </Link>

              <Link to="/profile" className="nav-avatar-btn" aria-label="Profile">
                <span>{user.name?.charAt(0).toUpperCase() || "U"}</span>
              </Link>
            </div>
          )}

          {/* MOBILE TOGGLE */}
          <button
            type="button"
            className="nav-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {mobileOpen && (
        <div className="nav-mobile-drawer">
          <nav className="nav-mobile-links">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? "nav-mobile-item active" : "nav-mobile-item"
                  }
                >
                  {Icon && <Icon size={18} />}
                  <span>{link.label}</span>
                </NavLink>
              );
            })}

            <div className="nav-mobile-divider" />

            {moreLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMenu}
                  className="nav-mobile-item"
                >
                  <Icon size={18} />
                  <span>{link.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="nav-mobile-auth">
            {!user ? (
              <>
                <Link to="/login" onClick={closeMenu} className="nav-mobile-btn-outline">
                  <LogIn size={16} />
                  <span>Sign In</span>
                </Link>
                <Link to="/register" onClick={closeMenu} className="nav-mobile-btn-primary">
                  <span>Create Account (OTP)</span>
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
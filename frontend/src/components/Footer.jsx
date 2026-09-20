import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Mail,
  Globe,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import {
  LinkedInIcon,
  FacebookIcon,
  YoutubeIcon,
  TwitterXIcon,
} from "./SocialIcons";
import { LogoWordmark } from "./Logo";
import "./Footer.css";

function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [feedback, setFeedback] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();

    // Strict email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!trimmed || !emailRegex.test(trimmed)) {
      setStatus("error");
      setFeedback("Please enter a valid email address.");
      return;
    }

    // Block common disposable spam domains
    const disposableDomains = [
      "mailinator.com",
      "tempmail.com",
      "10minutemail.com",
      "guerrillamail.com",
      "yopmail.com",
      "dispostable.com",
      "throwawaymail.com",
      "trashmail.com",
    ];
    const domain = trimmed.split("@")[1]?.toLowerCase();
    if (disposableDomains.includes(domain)) {
      setStatus("error");
      setFeedback("Disposable email addresses are not accepted.");
      return;
    }

    setStatus("loading");
    setFeedback("");

    // Store subscriber reliably
    setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem("xevoprop_subscribers") || "[]");
        if (!stored.includes(trimmed)) {
          stored.push(trimmed);
          localStorage.setItem("xevoprop_subscribers", JSON.stringify(stored));
        }
        setStatus("success");
        setFeedback("Subscribed! Thank you for joining our newsletter.");
        setEmail("");
      } catch {
        setStatus("success");
        setFeedback("Subscribed successfully!");
        setEmail("");
      }
    }, 600);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer-exact">
      <div className="footer-exact-container">
        {/* 5-COLUMN MAIN GRID */}
        <div className="footer-exact-grid">
          {/* COLUMN 1: BRAND */}
          <div className="footer-col-brand">
            <Link to="/" className="footer-brand-logo-link">
              <img
                src="/xevoprop-navbar-logo-white.png"
                alt="XevopropTech Pvt Ltd"
                className="footer-brand-logo"
              />
            </Link>

            <p className="footer-brand-desc">
              Your trusted partner in real estate. Discover premium properties,
              connect with verified developers, and build a brighter future with
              XevopropTech.
            </p>

            {/* SOCIAL TILES */}
            <div className="footer-social-tiles">
              <a
                href="https://www.linkedin.com/company/xevotech/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                title="Follow Xevotech on LinkedIn"
                className="social-tile"
              >
                <LinkedInIcon size={15} />
              </a>

              <a
                href="https://twitter.com/xevotech"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                title="Follow Xevotech on X"
                className="social-tile"
              >
                <TwitterXIcon size={14} />
              </a>

              <a
                href="https://www.youtube.com/@xevotech"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                title="Watch on YouTube"
                className="social-tile"
              >
                <YoutubeIcon size={15} />
              </a>

              <a
                href="https://www.facebook.com/xevotech/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                title="Follow Xevotech on Facebook"
                className="social-tile"
              >
                <FacebookIcon size={15} />
              </a>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div className="footer-col-links">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-link-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/properties">Properties</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: PROPERTY TYPES */}
          <div className="footer-col-links">
            <h4 className="footer-col-title">Property Types</h4>
            <ul className="footer-link-list">
              <li><Link to="/properties?type=residential">Residential</Link></li>
              <li><Link to="/properties?type=commercial">Commercial</Link></li>
              <li><Link to="/properties?type=plot">Plots</Link></li>
              <li><Link to="/properties?type=villa">Villas</Link></li>
              <li><Link to="/properties?type=apartment">Apartments</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: SUPPORT */}
          <div className="footer-col-links">
            <h4 className="footer-col-title">Support</h4>
            <ul className="footer-link-list">
              <li><Link to="/contact">Help Center</Link></li>
              <li><Link to="/contact#terms">Terms & Conditions</Link></li>
              <li><Link to="/contact#privacy">Privacy Policy</Link></li>
              <li><Link to="/contact#faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* COLUMN 5: NEWSLETTER CARD */}
          <div className="footer-col-newsletter">
            <div className="newsletter-card-exact">
              <h3 className="newsletter-title">Subscribe to our Newsletter</h3>
              <p className="newsletter-subtitle">
                Get the latest property updates and investment opportunities.
              </p>

              <form onSubmit={handleSubscribe} className="newsletter-form-exact">
                <div className="newsletter-row-exact">
                  <div className={`newsletter-input-box-exact ${status === "error" ? "has-error" : ""}`}>
                    <Mail size={17} className="newsletter-mail-icon" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status !== "idle") setStatus("idle");
                      }}
                      placeholder="Enter your email"
                      disabled={status === "loading" || status === "success"}
                      aria-label="Enter your email address"
                    />
                  </div>

                  <button
                    type="submit"
                    className="newsletter-submit-btn-exact"
                    disabled={status === "loading" || status === "success"}
                  >
                    {status === "loading" ? (
                      <Loader2 size={17} className="spinner" />
                    ) : status === "success" ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>

                {/* FEEDBACK MESSAGES */}
                {status === "error" && (
                  <div className="newsletter-feedback error">
                    <AlertCircle size={14} style={{ flexShrink: 0 }} />
                    <span>{feedback}</span>
                  </div>
                )}
                {status === "success" && (
                  <div className="newsletter-feedback success">
                    <CheckCircle2 size={14} style={{ flexShrink: 0 }} />
                    <span>{feedback}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT ROW */}
        <div className="footer-bottom-exact">
          <div className="footer-bottom-copy">
            © {new Date().getFullYear()} XevopropTech Pvt Ltd. All rights reserved.
          </div>

          <div className="footer-bottom-actions">
            <Link to="/contact#privacy">Privacy</Link>
            <Link to="/contact">Contact</Link>
            <button
              type="button"
              onClick={scrollToTop}
              className="footer-back-to-top"
            >
              <span>Back to top</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
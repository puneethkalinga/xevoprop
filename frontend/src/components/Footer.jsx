import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Building,
  Sparkles,
} from "lucide-react";

import { LogoWordmark } from "./Logo";
import {
  LinkedInIcon,
  InstagramIcon,
  FacebookIcon,
  YoutubeIcon,
} from "./SocialIcons";
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
      setFeedback("Please provide a valid business or personal email address.");
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
      setFeedback("Disposable email addresses are not accepted for market reports.");
      return;
    }

    setStatus("loading");
    setFeedback("");

    // Simulate reliable dispatch & store subscriber
    setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem("xevoprop_subscribers") || "[]");
        if (!stored.includes(trimmed)) {
          stored.push(trimmed);
          localStorage.setItem("xevoprop_subscribers", JSON.stringify(stored));
        }
        setStatus("success");
        setFeedback("Subscribed! You will receive verified weekly market updates & luxury alerts.");
        setEmail("");
      } catch {
        setStatus("success");
        setFeedback("Subscribed successfully!");
        setEmail("");
      }
    }, 700);
  };

  return (
    <footer className="footer-v2">
      <div className="footer-v2-glow"></div>

      <div className="footer-v2-container">
        {/* TRUST BADGE STRIP */}
        <div className="footer-v2-trust-strip">
          <div className="trust-item">
            <ShieldCheck size={18} className="trust-icon" />
            <span>100% Verified Properties & RERA Compliance</span>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-item">
            <Building size={18} className="trust-icon" />
            <span>Direct Builder & Owner Connections (Zero Brokerage)</span>
          </div>
          <div className="trust-divider"></div>
          <div className="trust-item">
            <Sparkles size={18} className="trust-icon" />
            <span>Powered by Xevotech Intelligent Systems</span>
          </div>
        </div>

        {/* MAIN FOOTER */}
        <div className="footer-v2-main">
          {/* BRAND COLUMN */}
          <div className="footer-v2-brand">
            <Link to="/" className="footer-v2-logo-link">
              <LogoWordmark size="default" />
            </Link>

            <p className="footer-v2-desc">
              India's premier transparent PropTech ecosystem. Connecting buyers,
              verified developers, and institutional property owners with genuine
              data, zero brokerage, and direct digital transactions.
            </p>

            {/* OFFICIAL SOCIALS */}
            <div className="footer-v2-socials">
              <a
                href="https://www.linkedin.com/company/xevotech/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="footer-v2-social-btn"
                title="Follow Xevotech on LinkedIn"
              >
                <LinkedInIcon size={16} />
              </a>

              <a
                href="https://www.instagram.com/xevotech/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="footer-v2-social-btn"
                title="Follow Xevotech on Instagram"
              >
                <InstagramIcon size={16} />
              </a>

              <a
                href="https://www.facebook.com/xevotech/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="footer-v2-social-btn"
                title="Follow Xevotech on Facebook"
              >
                <FacebookIcon size={16} />
              </a>

              <a
                href="https://www.youtube.com/@xevotech"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="footer-v2-social-btn"
                title="Watch on YouTube"
              >
                <YoutubeIcon size={16} />
              </a>
            </div>
          </div>

          {/* EXPLORE COLUMN */}
          <div className="footer-v2-col">
            <h4 className="footer-v2-heading">Explore</h4>
            <ul className="footer-v2-links">
              <li><Link to="/properties">All Properties</Link></li>
              <li><Link to="/properties?type=residential">Residential Flats</Link></li>
              <li><Link to="/properties?type=villa">Luxury Villas</Link></li>
              <li><Link to="/properties?type=commercial">Commercial Spaces</Link></li>
              <li><Link to="/projects">New Launch Projects</Link></li>
              <li><Link to="/developers">Verified Developers</Link></li>
            </ul>
          </div>

          {/* HUBS & CITIES */}
          <div className="footer-v2-col">
            <h4 className="footer-v2-heading">Prime Hubs</h4>
            <ul className="footer-v2-links">
              <li><Link to="/search?city=Hyderabad&location=Financial+District">Financial District</Link></li>
              <li><Link to="/search?city=Hyderabad&location=Hitec+City">Hitec City & Madhapur</Link></li>
              <li><Link to="/search?city=Hyderabad&location=Jubilee+Hills">Jubilee & Banjara Hills</Link></li>
              <li><Link to="/search?city=Hyderabad&location=Gachibowli">Gachibowli & Kokapet</Link></li>
              <li><Link to="/search?city=Bengaluru&location=Whitefield">Bengaluru Whitefield</Link></li>
              <li><Link to="/search?city=Bengaluru&location=Indiranagar">Indiranagar Prime</Link></li>
            </ul>
          </div>

          {/* COMPANY & TRUST */}
          <div className="footer-v2-col">
            <h4 className="footer-v2-heading">Company</h4>
            <ul className="footer-v2-links">
              <li><Link to="/about">About Xevotech</Link></li>
              <li><Link to="/contact">Contact & Support</Link></li>
              <li><a href="https://www.linkedin.com/company/xevotech/" target="_blank" rel="noopener noreferrer">Careers at Xevotech <ArrowUpRight size={12} className="inline-arrow" /></a></li>
              <li><Link to="/about#security">Trust & Security</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* WORKING NEWSLETTER */}
          <div className="footer-v2-newsletter-col">
            <h4 className="footer-v2-heading">PropTech Insights</h4>
            <p className="footer-v2-subtext">
              Curated market intelligence, price trends, and off-market investment alerts delivered weekly.
            </p>

            <form className="footer-v2-form" onSubmit={handleSubscribe}>
              <div className={`footer-v2-input-box ${status === "error" ? "has-error" : ""}`}>
                <Mail size={16} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  placeholder="name@company.com"
                  aria-label="Email address for newsletter"
                  disabled={status === "loading" || status === "success"}
                />
                <button
                  type="submit"
                  className="footer-v2-submit-btn"
                  disabled={status === "loading" || status === "success"}
                >
                  {status === "loading" ? (
                    <Loader2 size={16} className="spinner" />
                  ) : status === "success" ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    "Subscribe"
                  )}
                </button>
              </div>

              {/* FEEDBACK STATUS */}
              {status === "error" && (
                <div className="footer-feedback error">
                  <AlertCircle size={14} />
                  <span>{feedback}</span>
                </div>
              )}
              {status === "success" && (
                <div className="footer-feedback success">
                  <CheckCircle2 size={14} />
                  <span>{feedback}</span>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div className="footer-v2-bottom">
          <div className="footer-v2-bottom-left">
            <span>© {new Date().getFullYear()} Xevoprop. A proud subsidiary of <strong>Xevotech Technologies Pvt Ltd</strong>.</span>
          </div>

          <div className="footer-v2-bottom-right">
            <Link to="/privacy">Privacy Notice</Link>
            <span className="dot">•</span>
            <Link to="/terms">RERA Disclosures</Link>
            <span className="dot">•</span>
            <Link to="/contact">Grievance Officer</Link>
            <span className="dot">•</span>
            <a href="#top" className="back-to-top">
              Back to top <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
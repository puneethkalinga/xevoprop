import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  Clock,
} from "lucide-react";

import { LogoWordmark } from "../components/Logo";
import { apiFetch } from "../lib/api";
import { registerPendingUser } from "../lib/adminStore";
import "./Auth.css";

// Block known spam and disposable domains
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "yopmail.com",
  "dispostable.com",
  "throwawaymail.com",
  "trashmail.com",
  "sharklasers.com",
  "getairmail.com",
  "fakemailgenerator.com",
  "fakeinbox.com",
  "maildrop.cc",
  "test.com",
  "example.com",
]);

function Register() {
  const navigate = useNavigate();

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Buyer");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSubmittedForApproval, setIsSubmittedForApproval] = useState(false);

  // Validate form
  const validateInitialForm = () => {
    setError("");

    if (!name.trim() || name.trim().length < 2) {
      setError("Please enter your legal full name (minimum 2 characters).");
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError("Please enter a valid, active email address.");
      return false;
    }

    const domain = email.trim().split("@")[1]?.toLowerCase();
    if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
      setError("Disposable or temporary email services are blocked to prevent spam.");
      return false;
    }

    const digitsOnly = phone.replace(/\D/g, "");
    if (digitsOnly.length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return false;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  // Direct Registration (Pending Admin Approval)
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateInitialForm()) return;

    setLoading(true);
    setError("");

    try {
      // 1. Register user in central store as PENDING ADMIN APPROVAL
      try {
        registerPendingUser({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          role,
        });
      } catch (storeErr) {
        if (storeErr.message?.includes("already exists")) {
          throw storeErr;
        }
      }

      // 2. Sync to backend API if available
      apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
          role,
        }),
      }).catch((e) => console.log("Backend register sync notice:", e.message));

      setIsSubmittedForApproval(true);
    } catch (err) {
      setError(err.message || "Registration failed. Please verify credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* BRAND LOGO */}
        <div className="auth-logo-wrap">
          <Link to="/" style={{ textDecoration: "none" }}>
            <LogoWordmark size="default" />
          </Link>
        </div>

        <div className="auth-badge">
          <ShieldCheck size={13} />
          VERIFIED ONBOARDING
        </div>

        {isSubmittedForApproval ? (
          <div style={{ textAlign: "center", padding: "10px 0 16px" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                background: "#fef3c7",
                color: "#d97706",
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 16px",
                border: "2px solid #fde68a",
              }}
            >
              <Clock size={32} />
            </div>

            <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 6px" }}>
              Registration Submitted!
            </h1>

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "#fffbeb",
                border: "1px solid #fde68a",
                color: "#b45309",
                fontWeight: "700",
                fontSize: "12px",
                padding: "4px 14px",
                borderRadius: "999px",
                margin: "8px 0 16px",
                letterSpacing: "0.03em",
              }}
            >
              ⏳ AWAITING ADMIN APPROVAL
            </div>

            <p style={{ color: "#475569", fontSize: "14px", lineHeight: "1.6", margin: "0 0 20px" }}>
              Thank you, <strong>{name}</strong>. Your <strong>{role}</strong> profile has been registered.
              To ensure verified authenticity across Xevoprop, your account must first be reviewed and <strong>approved by the Administrator</strong> before you can log in, access your dashboard, and upload properties or projects.
            </p>

            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "10px",
                padding: "16px",
                textAlign: "left",
                marginBottom: "24px",
                fontSize: "13px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#64748b" }}>Registered Role:</span>
                <strong style={{ color: "#0f172a" }}>{role}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#64748b" }}>Email Address:</span>
                <strong style={{ color: "#0f172a" }}>{email}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748b" }}>Mobile Phone:</span>
                <strong style={{ color: "#0f172a" }}>+91 {phone.replace(/\D/g, "")}</strong>
              </div>
            </div>

            <button
              type="button"
              className="auth-submit"
              onClick={() => navigate("/login")}
              style={{ width: "100%", justifyContent: "center" }}
            >
              Go to Sign In
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <>
            <h1>Create an Account</h1>
            <p className="auth-subtitle">
              Join India's premier verified PropTech ecosystem. Zero spam, direct owner & developer connections.
            </p>

            {error && (
              <div className="auth-banner error">
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

        <form className="auth-form" onSubmit={handleRegister}>
          {/* FULL NAME */}
          <div className="auth-field">
            <div className="auth-label-row">
              <label>Legal Full Name</label>
            </div>
            <div className="auth-input-wrapper">
              <User size={16} className="auth-input-icon" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Puneeth"
                required
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="auth-field">
            <div className="auth-label-row">
              <label>Work or Personal Email</label>
              <span className="auth-field-hint">Spam-protected</span>
            </div>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />
            </div>
          </div>

          {/* MOBILE PHONE */}
          <div className="auth-field">
            <div className="auth-label-row">
              <label>Mobile Number</label>
              <span className="auth-field-hint">10 digits</span>
            </div>
            <div className="auth-input-wrapper">
              <Phone size={16} className="auth-input-icon" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 94821 73650"
                required
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div className="auth-field">
            <div className="auth-label-row">
              <label>Password</label>
              <span className="auth-field-hint">Min 6 characters</span>
            </div>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* ROLE SELECTOR */}
          <div className="role-group">
            <div className="role-title">Account Type</div>
            <div className="role-grid">
              {[
                { label: "Buyer", value: "Buyer" },
                { label: "Seller", value: "Seller" },
                { label: "Builder / Developer", value: "Developer" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.value}
                  className={`role-option ${role === item.value ? "active" : ""}`}
                  onClick={() => setRole(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={16} className="spinner" />
                Submitting Registration...
              </>
            ) : (
              <>
                Create Account & Request Approval
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Register;
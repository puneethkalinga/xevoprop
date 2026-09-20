import "./Logo.css";

export function LogoImage({ className = "logo-img", size = 40, variant = "light" }) {
  const isDark = variant === "dark";
  return (
    <img
      src={isDark ? "/x-symbol-white.png" : "/x-symbol.png"}
      alt="Xevoprop"
      className={className}
      style={{ height: size, width: "auto", objectFit: "contain" }}
    />
  );
}

export function LogoWordmark({ size = "default", variant = "light", showSubtitle = true, className = "" }) {
  const isDark = variant === "dark";
  const iconHeight = size === "small" ? 32 : size === "large" ? 48 : 40;

  return (
    <div className={`logo-wordmark logo-${size} ${isDark ? "logo-dark" : "logo-light"} ${className}`}>
      <img
        src={isDark ? "/x-symbol-white.png" : "/x-symbol.png"}
        alt="Xevoprop"
        className="logo-symbol-icon"
        style={{ height: iconHeight, width: "auto", objectFit: "contain" }}
      />
      <div className="logo-text-group">
        <div className="logo-brand-name">
          <span className="logo-brand-xevo">XEVO</span>
          <span className="logo-brand-prop">PROP</span>
        </div>
        {showSubtitle && (
          <span className="logo-brand-sub">
            Xevotech • PropTech Ecosystem
          </span>
        )}
      </div>
    </div>
  );
}

export default LogoWordmark;

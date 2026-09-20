import "./Logo.css";

export function LogoImage({ className = "logo-img", size = 36 }) {
  return (
    <img
      src="/logo.jpeg"
      alt="Xevoprop by Xevotech"
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}

export function LogoWordmark({ size = "default", showSubtitle = true }) {
  return (
    <div className={`logo-wordmark logo-${size}`}>
      <LogoImage size={size === "small" ? 28 : size === "large" ? 44 : 36} />
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

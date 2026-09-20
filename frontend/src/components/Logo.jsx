import "./Logo.css";

export function LogoImage({ className = "logo-img", size = 50, variant = "light" }) {
  const isDark = variant === "dark";
  return (
    <img
      src={isDark ? "/xevoprop-logo.png" : "/logo.png"}
      alt="XevopropTech"
      className={className}
      style={{ height: size, width: "auto", objectFit: "contain" }}
    />
  );
}

export function LogoWordmark({ size = "default", variant = "light", className = "" }) {
  const isDark = variant === "dark";
  const height = size === "small" ? 38 : size === "large" ? 64 : 50;

  return (
    <div className={`logo-brand-container logo-${size} ${isDark ? "logo-dark" : "logo-light"} ${className}`}>
      <img
        src={isDark ? "/xevoprop-logo.png" : "/logo.png"}
        alt="XevopropTech"
        className="brand-official-logo"
        style={{ height, width: "auto", objectFit: "contain" }}
      />
    </div>
  );
}

export default LogoWordmark;

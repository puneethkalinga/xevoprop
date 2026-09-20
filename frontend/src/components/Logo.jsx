import "./Logo.css";

export function LogoImage({ className = "logo-img", size = 42, variant = "light" }) {
  const isDark = variant === "dark";
  return (
    <img
      src={isDark ? "/xevoprop-navbar-logo-white.png" : "/xevoprop-navbar-logo.png"}
      alt="XevopropTech Pvt Ltd"
      className={className}
      style={{ height: size, width: "auto", objectFit: "contain" }}
    />
  );
}

export function LogoWordmark({ size = "default", variant = "light", className = "" }) {
  const isDark = variant === "dark";
  const height = size === "small" ? 32 : size === "large" ? 48 : 42;

  return (
    <div className={`logo-wordmark logo-${size} ${isDark ? "logo-dark" : "logo-light"} ${className}`}>
      <img
        src={isDark ? "/xevoprop-navbar-logo-white.png" : "/xevoprop-navbar-logo.png"}
        alt="XevopropTech Pvt Ltd"
        className="logo-official-horizontal"
        style={{ height, width: "auto", objectFit: "contain", display: "block" }}
      />
    </div>
  );
}

export default LogoWordmark;

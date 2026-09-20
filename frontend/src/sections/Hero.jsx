import { useState } from "react";
import {
  Search,
  MapPin,
  ChevronDown,
  Building2,
  Home,
  LandPlot,
  ShieldCheck,
  CheckCircle,
  Building,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

function Hero() {
  const navigate = useNavigate();

  const [searchType, setSearchType] = useState("buy");
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");

  const handleSearch = (customLocation) => {
    const loc = customLocation !== undefined ? customLocation : location;
    const params = new URLSearchParams();

    if (searchType) params.set("type", searchType);
    if (loc.trim()) {
      params.set("city", loc.trim());
      params.set("location", loc.trim());
    }
    if (propertyType) {
      params.set("propertyType", propertyType);
      params.set("type", propertyType);
    }
    if (budget) {
      params.set("budget", budget);
      params.set("maxPrice", budget);
    }

    navigate(`/search?${params.toString()}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const quickHotspots = [
    { label: "Hyderabad", query: "Hyderabad" },
    { label: "Nizamabad", query: "Nizamabad" },
    { label: "Mumbai", query: "Mumbai" },
    { label: "Pune", query: "Pune" },
    { label: "Thane", query: "Thane" },
    { label: "Sambhaji Nagar", query: "Sambhaji Nagar" },
    { label: "Banglore", query: "Banglore" },
    { label: "Manglore", query: "Manglore" },
  ];

  const propertyOptions = [
    { value: "", label: "All Property Types" },
    { value: "apartment", label: "Apartment" },
    { value: "house", label: "House" },
    { value: "villa", label: "Villa" },
    { value: "plot", label: "Plot" },
    { value: "commercial", label: "Commercial" },
  ];

  const budgetOptions = [
    { value: "", label: "Any Budget" },
    { value: "2500000", label: "25 Lakh" },
    { value: "5000000", label: "50 Lakh" },
    { value: "7500000", label: "75 Lakh" },
    { value: "10000000", label: "1 CR" },
    { value: "15000000", label: "1.5 CR" },
    { value: "20000000", label: "2 CR" },
    { value: "30000000", label: "3 CR" },
  ];

  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* HEADER COPY */}
        <div className="hero-header">
          <div className="hero-eyebrow">
            <ShieldCheck size={14} />
            <span>Verified Real Estate Portal</span>
          </div>

          <h1 className="hero-title">
            Find Your Next Property in India’s Top Metros
          </h1>

          <p className="hero-subtitle">
            Explore verified residential apartments, luxury villas, and commercial
            developments from verified sellers across Hyderabad, Bengaluru, and beyond.
          </p>
        </div>

        {/* SEARCH CARD */}
        <div className="hero-search-card">
          {/* TABS */}
          <div className="hero-tabs">
            <button
              type="button"
              className={`hero-tab ${searchType === "buy" ? "active" : ""}`}
              onClick={() => setSearchType("buy")}
            >
              <Home size={15} />
              <span>Buy</span>
            </button>

            <button
              type="button"
              className={`hero-tab ${searchType === "commercial" ? "active" : ""}`}
              onClick={() => setSearchType("commercial")}
            >
              <Building2 size={15} />
              <span>Commercial</span>
            </button>

            <button
              type="button"
              className={`hero-tab ${searchType === "plot" ? "active" : ""}`}
              onClick={() => setSearchType("plot")}
            >
              <LandPlot size={15} />
              <span>Plots & Land</span>
            </button>
          </div>

          {/* SEARCH FORM ROW */}
          <div className="hero-form-row">
            {/* LOCATION */}
            <div className="hero-field field-location">
              <MapPin size={18} className="field-icon" />
              <div className="field-inner">
                <label>Location / City</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. Financial District, Jubilee Hills..."
                  aria-label="Location search"
                />
              </div>
            </div>

            <div className="field-separator" />

            {/* PROPERTY TYPE */}
            <div className="hero-field field-type">
              <div className="field-inner">
                <label>Property Type</label>
                <div className="select-wrapper">
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                  >
                    {propertyOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="select-caret" />
                </div>
              </div>
            </div>

            <div className="field-separator" />

            {/* BUDGET */}
            <div className="hero-field field-budget">
              <div className="field-inner">
                <label>Budget</label>
                <div className="select-wrapper">
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  >
                    {budgetOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="select-caret" />
                </div>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="button"
              className="hero-submit-btn"
              onClick={() => handleSearch()}
            >
              <Search size={17} />
              <span>Search</span>
            </button>
          </div>

          {/* POPULAR SEARCHES */}
          <div className="hero-popular-row">
            <span className="popular-label">Popular Searches:</span>
            <div className="popular-tags">
              {quickHotspots.map((spot) => (
                <button
                  key={spot.label}
                  type="button"
                  className="popular-tag"
                  onClick={() => {
                    setLocation(spot.query);
                    handleSearch(spot.query);
                  }}
                >
                  {spot.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* TRUST BADGES BAR */}
        <div className="hero-trust-bar">
          <div className="trust-item">
            <CheckCircle size={16} className="trust-icon" />
            <span>Verified Properties</span>
          </div>

          <div className="trust-dot">•</div>

          <div className="trust-item">
            <CheckCircle size={16} className="trust-icon" />
            <span>Direct Connections</span>
          </div>

          <div className="trust-dot">•</div>

          <div className="trust-item">
            <CheckCircle size={16} className="trust-icon" />
            <span>Zero Brokerage*</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
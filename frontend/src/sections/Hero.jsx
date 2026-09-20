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
    { label: "Financial District", query: "Financial District, Hyderabad" },
    { label: "Hitec City", query: "Hitec City, Hyderabad" },
    { label: "Jubilee Hills", query: "Jubilee Hills, Hyderabad" },
    { label: "Gachibowli", query: "Gachibowli, Hyderabad" },
    { label: "Whitefield (BLR)", query: "Whitefield, Bengaluru" },
  ];

  const propertyOptions = [
    { value: "", label: "All Property Types" },
    { value: "apartment", label: "Apartments & Flats" },
    { value: "villa", label: "Villas & Gated Communities" },
    { value: "house", label: "Independent Houses" },
    { value: "commercial", label: "Commercial Office Spaces" },
    { value: "plot", label: "Residential Plots" },
  ];

  const budgetOptions = [
    { value: "", label: "Any Budget" },
    { value: "0-5000000", label: "Under ₹50 Lakh" },
    { value: "5000000-10000000", label: "₹50L – ₹1 Crore" },
    { value: "10000000-25000000", label: "₹1 Cr – ₹2.5 Cr" },
    { value: "25000000-50000000", label: "₹2.5 Cr – ₹5 Cr" },
    { value: "50000000+", label: "Above ₹5 Crore" },
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
            Explore RERA-approved residential apartments, luxury villas, and commercial
            developments from verified builders across Hyderabad, Bengaluru, and beyond.
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
            <span>100% RERA Verified</span>
          </div>

          <div className="trust-dot">•</div>

          <div className="trust-item">
            <CheckCircle size={16} className="trust-icon" />
            <span>Direct Builder Pricing</span>
          </div>

          <div className="trust-dot">•</div>

          <div className="trust-item">
            <CheckCircle size={16} className="trust-icon" />
            <span>Zero Brokerage Markup</span>
          </div>

          <div className="trust-dot">•</div>

          <div className="trust-item">
            <Building size={16} className="trust-icon" />
            <span>Top Tier Developers</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
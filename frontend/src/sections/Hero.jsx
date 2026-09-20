import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  MapPin,
  ChevronDown,
  Building2,
  Home,
  LandPlot,
  Sparkles,
  ShieldCheck,
  Zap,
  Building,
  ArrowRight,
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
    { value: "", label: "All Asset Classes" },
    { value: "apartment", label: "Luxury Apartments" },
    { value: "villa", label: "Gated Villas" },
    { value: "house", label: "Independent House" },
    { value: "commercial", label: "Grade-A Commercial" },
    { value: "plot", label: "Plotted Development" },
  ];

  const budgetOptions = [
    { value: "", label: "Any Budget" },
    { value: "0-5000000", label: "Under ₹50 Lakh" },
    { value: "5000000-10000000", label: "₹50L – ₹1 Crore" },
    { value: "10000000-25000000", label: "₹1 Cr – ₹2.5 Cr" },
    { value: "25000000-50000000", label: "₹2.5 Cr – ₹5 Cr" },
    { value: "50000000+", label: "Ultra Luxury (> ₹5 Cr)" },
  ];

  return (
    <section className="hero-pro">
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="hero-pro-grid"></div>
      <div className="hero-pro-glow-left"></div>
      <div className="hero-pro-glow-right"></div>

      <div className="hero-pro-container">
        {/* TRUST BADGE */}
        <motion.div
          className="hero-pro-badge"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="badge-pulse-dot"></span>
          <span>India's Most Transparent PropTech Ecosystem</span>
          <span className="badge-divider">•</span>
          <span className="badge-sub">Zero Brokerage</span>
        </motion.div>

        {/* HERO MAIN TITLE */}
        <motion.h1
          className="hero-pro-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Discover Verified Real Estate.
          <br />
          <span className="hero-gradient-text">Direct Deals. Zero Friction.</span>
        </motion.h1>

        {/* SUBTITLE */}
        <motion.p
          className="hero-pro-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Explore RERA-verified luxury residences, commercial towers, and premium plots
          across Hyderabad and leading metros with direct developer pricing.
        </motion.p>

        {/* FROSTED GLASS SEARCH ENGINE */}
        <motion.div
          className="hero-search-capsule"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          {/* SEARCH TABS */}
          <div className="hero-tab-row">
            <button
              type="button"
              className={`hero-tab-pill ${searchType === "buy" ? "active" : ""}`}
              onClick={() => setSearchType("buy")}
            >
              <Home size={15} />
              <span>Buy Properties</span>
            </button>

            <button
              type="button"
              className={`hero-tab-pill ${searchType === "commercial" ? "active" : ""}`}
              onClick={() => setSearchType("commercial")}
            >
              <Building2 size={15} />
              <span>Commercial Hubs</span>
            </button>

            <button
              type="button"
              className={`hero-tab-pill ${searchType === "plot" ? "active" : ""}`}
              onClick={() => setSearchType("plot")}
            >
              <LandPlot size={15} />
              <span>Plots & Land</span>
            </button>
          </div>

          {/* INPUT FIELDS ROW */}
          <div className="hero-inputs-strip">
            {/* LOCATION INPUT */}
            <div className="hero-input-cell cell-location">
              <MapPin size={18} className="cell-icon" />
              <div className="cell-content">
                <span className="cell-label">Prime Location</span>
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

            <div className="cell-divider"></div>

            {/* PROPERTY TYPE SELECT */}
            <div className="hero-input-cell cell-type">
              <div className="cell-content">
                <span className="cell-label">Property Category</span>
                <div className="custom-select-box">
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
                  <ChevronDown size={14} className="select-arrow" />
                </div>
              </div>
            </div>

            <div className="cell-divider"></div>

            {/* BUDGET SELECT */}
            <div className="hero-input-cell cell-budget">
              <div className="cell-content">
                <span className="cell-label">Target Budget</span>
                <div className="custom-select-box">
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
                  <ChevronDown size={14} className="select-arrow" />
                </div>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="button"
              className="hero-search-exec-btn"
              onClick={() => handleSearch()}
            >
              <Search size={18} />
              <span>Find Properties</span>
            </button>
          </div>

          {/* QUICK HOTSPOT PILLS */}
          <div className="hero-hotspots-row">
            <span className="hotspots-title">Trending Locations:</span>
            <div className="hotspots-pills">
              {quickHotspots.map((spot) => (
                <button
                  key={spot.label}
                  type="button"
                  className="hotspot-chip"
                  onClick={() => {
                    setLocation(spot.query);
                    handleSearch(spot.query);
                  }}
                >
                  <MapPin size={11} />
                  <span>{spot.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* METRIC STRIP */}
        <motion.div
          className="hero-metric-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="metric-item">
            <ShieldCheck size={18} className="metric-icon" />
            <div>
              <strong>100% RERA Verified</strong>
              <span>Clean titles & approvals</span>
            </div>
          </div>

          <div className="metric-sep"></div>

          <div className="metric-item">
            <Zap size={18} className="metric-icon" />
            <div>
              <strong>Direct Developer Terms</strong>
              <span>Zero intermediary markup</span>
            </div>
          </div>

          <div className="metric-sep"></div>

          <div className="metric-item">
            <Building size={18} className="metric-icon" />
            <div>
              <strong>₹4,500+ Cr Inventory</strong>
              <span>Across Hyderabad & Bangalore</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Search,
  ArrowRight,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  Building2,
  IndianRupee,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./IntelligentDiscovery.css";

const PRESET_QUERIES = [
  {
    label: "3 BHK High-rise in Financial District",
    city: "Hyderabad",
    location: "Financial District",
    bedrooms: "3",
    type: "apartment",
    budget: "10000000-25000000",
  },
  {
    label: "Luxury Villa in Jubilee Hills with Garden",
    city: "Hyderabad",
    location: "Jubilee Hills",
    bedrooms: "4",
    type: "villa",
    budget: "50000000+",
  },
  {
    label: "Ready-to-move in Hitec City under ₹2 Cr",
    city: "Hyderabad",
    location: "Hitec City",
    bedrooms: "3",
    type: "apartment",
    budget: "10000000-20000000",
  },
  {
    label: "Tech Park Residences in Whitefield (BLR)",
    city: "Bengaluru",
    location: "Whitefield",
    bedrooms: "3",
    type: "apartment",
    budget: "10000000-20000000",
  },
];

function IntelligentDiscovery() {
  const navigate = useNavigate();
  const [userQuery, setUserQuery] = useState("");
  const [selectedPreset, setSelectedPreset] = useState(PRESET_QUERIES[0]);

  const handleLaunchDiscovery = (preset) => {
    const target = preset || selectedPreset;
    const params = new URLSearchParams();

    if (target.city) params.set("city", target.city);
    if (target.location) params.set("location", target.location);
    if (target.type) params.set("type", target.type);
    if (target.bedrooms) params.set("bedrooms", target.bedrooms);
    if (target.budget) {
      params.set("budget", target.budget);
      params.set("maxPrice", target.budget);
    }

    navigate(`/search?${params.toString()}`);
  };

  const handleCustomQuerySubmit = (e) => {
    e.preventDefault();
    const query = userQuery.trim();
    if (!query) return;

    const params = new URLSearchParams();
    params.set("location", query);
    params.set("city", query);

    // Simple natural language parsing
    if (/villa/i.test(query)) params.set("type", "villa");
    else if (/commercial|office|shop/i.test(query)) params.set("type", "commercial");
    else if (/apartment|flat/i.test(query)) params.set("type", "apartment");

    if (/4\s*bhk/i.test(query)) params.set("bedrooms", "4");
    else if (/3\s*bhk/i.test(query)) params.set("bedrooms", "3");
    else if (/2\s*bhk/i.test(query)) params.set("bedrooms", "2");

    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="intelligent-v2" id="discovery">
      <div className="intelligent-v2-glow" />

      <div className="intelligent-v2-container">
        {/* LEFT COLUMN */}
        <div className="intelligent-v2-content">
          <div className="discovery-eyebrow">
            <Sparkles size={14} className="eyebrow-icon" />
            <span>ALGORITHMIC PROPERTY MATCHING</span>
          </div>

          <h2>
            Describe What You Need. <br />
            <span>Let Xevoprop Match It.</span>
          </h2>

          <p className="discovery-lead">
            Bypass endless scroll. Our intelligent engine matches your exact commute
            corridor, carpet area requirement, and target budget against verified builder inventories.
          </p>

          <div className="discovery-features-list">
            <div className="discovery-feat-item">
              <CheckCircle2 size={16} className="feat-check" />
              <div>
                <strong>Direct Developer Yield Calculator</strong>
                <span>Instant rental yield and capital appreciation estimates.</span>
              </div>
            </div>

            <div className="discovery-feat-item">
              <CheckCircle2 size={16} className="feat-check" />
              <div>
                <strong>RERA Clean Title Guarantee</strong>
                <span>All listings cross-referenced against TS-RERA & KRERA public registries.</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE DISCOVERY CONSOLE */}
        <div className="discovery-console-glass">
          <div className="console-top-bar">
            <div className="console-status-pill">
              <span className="live-dot" />
              <span>Xevotech Match Engine v2.4</span>
            </div>
            <span className="console-tag">Zero Brokerage</span>
          </div>

          {/* CUSTOM PROMPT INPUT */}
          <form className="console-prompt-form" onSubmit={handleCustomQuerySubmit}>
            <div className="console-input-wrap">
              <Search size={18} className="console-search-icon" />
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="e.g. 4 BHK Sky Villa in Kokapet with 3 car parks..."
              />
              <button type="submit" className="console-submit-btn">
                <span>Filter</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </form>

          {/* INTENT CHIPS */}
          <div className="console-presets-block">
            <span className="presets-label">Popular High-Intent Matches:</span>
            <div className="presets-grid">
              {PRESET_QUERIES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className={`preset-query-pill ${
                    selectedPreset.label === preset.label ? "active" : ""
                  }`}
                  onClick={() => {
                    setSelectedPreset(preset);
                    handleLaunchDiscovery(preset);
                  }}
                >
                  <Sparkles size={13} className="preset-sparkle" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVE PREVIEW CARD */}
          <div className="console-preview-card">
            <div className="preview-card-header">
              <span className="preview-label">Live Parameters Identified</span>
              <span className="preview-match-rate">98% Accuracy</span>
            </div>

            <div className="preview-chips-row">
              <div className="preview-param-chip">
                <MapPin size={12} />
                <span>{selectedPreset.location}, {selectedPreset.city}</span>
              </div>
              <div className="preview-param-chip">
                <Building2 size={12} />
                <span style={{ textTransform: "capitalize" }}>{selectedPreset.type}</span>
              </div>
              <div className="preview-param-chip">
                <IndianRupee size={12} />
                <span>Direct Builder Pricing</span>
              </div>
            </div>

            <button
              type="button"
              className="console-execute-btn"
              onClick={() => handleLaunchDiscovery(selectedPreset)}
            >
              <span>View Verified Results for this Criteria</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntelligentDiscovery;
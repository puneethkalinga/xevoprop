import { useState } from "react";
import {
  Search,
  ArrowRight,
  CheckCircle2,
  Building2,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./IntelligentDiscovery.css";

const PRESET_QUERIES = [
  {
    label: "3 BHK in Financial District",
    city: "Hyderabad",
    location: "Financial District",
    bedrooms: "3",
    type: "apartment",
    budget: "10000000-25000000",
  },
  {
    label: "Gated Villa in Jubilee Hills",
    city: "Hyderabad",
    location: "Jubilee Hills",
    bedrooms: "4",
    type: "villa",
    budget: "50000000+",
  },
  {
    label: "Ready to Move in Hitec City",
    city: "Hyderabad",
    location: "Hitec City",
    bedrooms: "3",
    type: "apartment",
    budget: "10000000-20000000",
  },
  {
    label: "Premium Apartments in Whitefield",
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

  const handleLaunchDiscovery = (preset) => {
    const params = new URLSearchParams();

    if (preset.city) params.set("city", preset.city);
    if (preset.location) params.set("location", preset.location);
    if (preset.type) params.set("type", preset.type);
    if (preset.bedrooms) params.set("bedrooms", preset.bedrooms);
    if (preset.budget) {
      params.set("budget", preset.budget);
      params.set("maxPrice", preset.budget);
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

    if (/villa/i.test(query)) params.set("type", "villa");
    else if (/commercial|office|shop/i.test(query)) params.set("type", "commercial");
    else if (/apartment|flat/i.test(query)) params.set("type", "apartment");

    if (/4\s*bhk/i.test(query)) params.set("bedrooms", "4");
    else if (/3\s*bhk/i.test(query)) params.set("bedrooms", "3");
    else if (/2\s*bhk/i.test(query)) params.set("bedrooms", "2");

    navigate(`/search?${params.toString()}`);
  };

  return (
    <section className="discovery-section" id="discovery">
      <div className="discovery-container">
        {/* LEFT COLUMN */}
        <div className="discovery-content">
          <div className="discovery-badge">
            <Compass size={14} />
            <span>Targeted Property Search</span>
          </div>

          <h2>
            Find Properties Matched to Your Exact Requirements
          </h2>

          <p className="discovery-desc">
            Save time and explore properties that align with your specific commute corridor,
            budget, and bedroom configuration directly from verified builder inventories.
          </p>

          <div className="discovery-points">
            <div className="discovery-point">
              <CheckCircle2 size={18} className="point-icon" />
              <div>
                <strong>Verified Developer Inventories</strong>
                <span>Direct access to available units without broker intermediaries.</span>
              </div>
            </div>

            <div className="discovery-point">
              <CheckCircle2 size={18} className="point-icon" />
              <div>
                <strong>RERA Clean Title Guarantee</strong>
                <span>All listed projects are cross-referenced with official state RERA records.</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="discovery-card">
          <div className="discovery-card-header">
            <h3>Quick Property Search</h3>
            <span>Zero Brokerage</span>
          </div>

          <form className="discovery-form" onSubmit={handleCustomQuerySubmit}>
            <div className="discovery-input-box">
              <Search size={18} className="discovery-search-icon" />
              <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                placeholder="e.g. 3 BHK in Financial District, villa in Jubilee Hills..."
              />
              <button type="submit" className="discovery-submit-btn">
                Search
              </button>
            </div>
          </form>

          <div className="discovery-presets">
            <span className="presets-title">Popular Curated Searches:</span>
            <div className="presets-list">
              {PRESET_QUERIES.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  className="preset-btn"
                  onClick={() => handleLaunchDiscovery(preset)}
                >
                  <Building2 size={13} />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntelligentDiscovery;
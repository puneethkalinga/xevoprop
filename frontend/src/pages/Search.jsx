import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  Search as SearchIcon,
  Home,
  BedDouble,
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
  Heart,
  Calendar,
  ArrowUpRight,
  Maximize2,
  Bath,
  SlidersHorizontal,
} from "lucide-react";

import { apiFetch } from "../lib/api";
import "./Search.css";

export default function Search() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  /* INITIAL STATE FROM QUERY PARAMS */
  const initialCity = params.get("city") || params.get("location") || "";
  const initialType = params.get("type") || params.get("propertyType") || "All";
  const initialBedrooms = params.get("bedrooms") || params.get("bhk") || "All";
  const initialBudget = params.get("budget") || params.get("maxPrice") || "";

  const [city, setCity] = useState(initialCity);
  const [type, setType] = useState(initialType);
  const [bedrooms, setBedrooms] = useState(initialBedrooms);
  const [maxPrice, setMaxPrice] = useState(initialBudget);

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("xevoprop_favorites") || "[]");
    } catch {
      return [];
    }
  });

  /* RUN SEARCH QUERY */
  useEffect(() => {
    const searchProperties = async () => {
      try {
        setLoading(true);

        const query = new URLSearchParams({
          city,
          type,
          bedrooms,
          maxPrice,
        });

        const data = await apiFetch(`/search?${query.toString()}`).catch(() => null);

        if (data && Array.isArray(data.properties)) {
          const LEGACY_IDS = new Set([1, 18, 19, 20, 21, 22]);
          const clean = data.properties.filter((p) => !LEGACY_IDS.has(Number(p.id)));
          setResults(clean);
          return;
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }

      setResults([]);
    };

    searchProperties();
  }, [city, type, bedrooms, maxPrice]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();

    if (city.trim()) query.set("city", city.trim());
    if (type !== "All") query.set("type", type);
    if (bedrooms !== "All") query.set("bedrooms", bedrooms);
    if (maxPrice) query.set("budget", maxPrice);

    navigate(`/search?${query.toString()}`);
  };

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("xevoprop_favorites", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="search-page-v2">
      {/* SEARCH HERO */}
      <section className="search-v2-hero">
        <div className="search-v2-hero-content">
          <span className="search-v2-eyebrow">
            <ShieldCheck size={14} />
            DIRECT BUILDER & OWNER REGISTRY
          </span>

          <h1>
            Verified Properties <span>For Connoisseurs</span>
          </h1>

          <p>
            Explore verified residential homes, villas, and commercial spaces.
            Filter by city, property type, BHK layout, and budget.
          </p>
        </div>
      </section>

      {/* SEARCH COMMAND PANEL */}
      <div className="search-v2-container">
        <form className="search-v2-panel" onSubmit={handleSearch}>
          <div className="search-v2-fields">
            {/* LOCATION */}
            <div className="search-v2-field">
              <label>Location / Corridor</label>
              <div className="search-v2-input-wrap">
                <MapPin size={16} className="field-icon" />
                <input
                  type="text"
                  placeholder="e.g. Financial District, Jubilee Hills..."
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            {/* TYPE */}
            <div className="search-v2-field">
              <label>Asset Class</label>
              <div className="search-v2-input-wrap">
                <Home size={16} className="field-icon" />
                <select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="All">All Types</option>
                  <option value="Apartment">Apartment / Flat</option>
                  <option value="Villa">Gated Villa</option>
                  <option value="Commercial">Commercial Space</option>
                  <option value="Plot">Plotted Development</option>
                </select>
              </div>
            </div>

            {/* BEDROOMS */}
            <div className="search-v2-field">
              <label>BHK Layout</label>
              <div className="search-v2-input-wrap">
                <BedDouble size={16} className="field-icon" />
                <select
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                >
                  <option value="All">Any BHK</option>
                  <option value="2">2+ BHK</option>
                  <option value="3">3+ BHK</option>
                  <option value="4">4+ BHK</option>
                  <option value="5">5+ BHK Mansions</option>
                </select>
              </div>
            </div>

            {/* BUDGET */}
            <div className="search-v2-field">
              <label>Target Budget</label>
              <div className="search-v2-input-wrap">
                <IndianRupee size={16} className="field-icon" />
                <select
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                >
                  <option value="">Any Budget</option>
                  <option value="0-5000000">Under ₹50 Lakh</option>
                  <option value="5000000-10000000">₹50L – ₹1 Crore</option>
                  <option value="10000000-25000000">₹1 Cr – ₹2.5 Cr</option>
                  <option value="25000000-50000000">₹2.5 Cr – ₹5 Cr</option>
                  <option value="50000000+">Ultra Luxury (&gt; ₹5 Cr)</option>
                </select>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <button type="submit" className="search-v2-submit-btn">
              <SearchIcon size={16} />
              <span>Filter Results</span>
            </button>
          </div>
        </form>

        {/* RESULTS HEADER */}
        <div className="search-v2-results-header">
          <div>
            <h2>Verified Listings Matching Your Criteria</h2>
            <span className="results-count">
              Showing {results.length} verified prime properties
            </span>
          </div>
        </div>

        {/* RESULTS GRID */}
        {loading ? (
          <div className="search-v2-loading">
            <div className="loading-spinner" />
            <span>Retrieving verified registry...</span>
          </div>
        ) : (
          <div className="search-v2-grid">
            {results.map((item) => {
              const isFav = favorites.includes(item.id);
              const priceText =
                item.priceLabel ||
                (item.price ? `₹${(item.price / 10000000).toFixed(2)} Cr` : "Price on request");

              return (
                <article
                  key={item.id}
                  className="search-prop-card"
                  onClick={() => navigate(`/properties/${item.id}`)}
                >
                  <div className="search-card-media">
                    <img
                      src={
                        item.image ||
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
                      }
                      alt={item.title}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";
                      }}
                    />
                    <div className="search-card-scrim" />

                    <div className="search-card-badges">
                      {item.verified && (
                        <span className="chip-verified">
                          <CheckCircle2 size={12} />
                          Verified
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className={`search-card-heart ${isFav ? "active" : ""}`}
                      onClick={(e) => toggleFavorite(item.id, e)}
                      aria-label="Save property"
                    >
                      <Heart
                        size={16}
                        fill={isFav ? "#EF4444" : "none"}
                        color={isFav ? "#EF4444" : "#FFFFFF"}
                      />
                    </button>

                    <div className="search-card-price-tag">
                      <span className="search-price-val">{priceText}</span>
                      {item.pricePerSqft && (
                        <span className="search-sqft-val">{item.pricePerSqft}</span>
                      )}
                    </div>
                  </div>

                  <div className="search-card-info">
                    <div className="search-card-meta-top">
                      <span className="search-asset-pill">
                        {item.type || "Apartment"}
                      </span>
                    </div>

                    <h3 className="search-card-title">{item.title}</h3>

                    <div className="search-card-loc">
                      <MapPin size={14} />
                      <span>{item.location || item.city}</span>
                    </div>

                    <div className="search-card-spec-bar">
                      <div className="spec-item">
                        <BedDouble size={14} />
                        <span>{item.bedrooms || 3} BHK</span>
                      </div>
                      <span className="spec-dot">•</span>
                      <div className="spec-item">
                        <Bath size={14} />
                        <span>{item.bathrooms || 3} Baths</span>
                      </div>
                      <span className="spec-dot">•</span>
                      <div className="spec-item">
                        <Maximize2 size={14} />
                        <span>{item.area || 2400} sq.ft</span>
                      </div>
                    </div>

                    <div className="search-card-actions">
                      <button
                        type="button"
                        className="search-visit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/properties/${item.id}`);
                        }}
                      >
                        <Calendar size={13} />
                        <span>Schedule Visit</span>
                      </button>

                      <button
                        type="button"
                        className="search-arrow-btn"
                        aria-label="View details"
                      >
                        <ArrowUpRight size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
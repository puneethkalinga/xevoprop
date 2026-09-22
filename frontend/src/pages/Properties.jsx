import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  MapPin,
  BedDouble,
  Maximize,
  Heart,
  CheckCircle2,
  Home,
  SlidersHorizontal,
} from "lucide-react";

import "./Properties.css";

const API_BASE =
  import.meta.env.VITE_API_URL || "https://xevoprop.onrender.com/api";

const isVideoUrl = (url) => {
  if (!url || typeof url !== "string") return false;
  return /\.(mp4|mov|webm|mkv|avi|m4v)(\?.*)?$/i.test(url) || url.includes("/video/upload/");
};

function Properties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [bedrooms, setBedrooms] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minArea, setMinArea] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [readyOnly, setReadyOnly] = useState(false);

  const [sortBy, setSortBy] = useState("newest");
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("xevoprop_favorites") || "[]");
    } catch {
      return [];
    }
  });

  /* LOAD PROPERTIES */
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE}/properties`, {
        signal: AbortSignal.timeout(6000),
      });

      const data = await response.json();

      if (response.ok && data && Array.isArray(data.properties)) {
        // Exclude the 6 legacy placeholder properties [1, 18, 19, 20, 21, 22] so the platform is completely clean
        const LEGACY_IDS = new Set([1, 18, 19, 20, 21, 22]);
        const cleanProperties = data.properties.filter(
          (p) => !LEGACY_IDS.has(Number(p.id))
        );
        setProperties(cleanProperties);
      } else {
        setProperties([]);
      }
    } catch (err) {
      console.warn("Properties fetch error:", err.message);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  /* FAVORITES */
  const toggleFavorite = (event, propertyId) => {
    event.preventDefault();
    event.stopPropagation();

    const id = Number(propertyId);
    setFavorites((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];

      try {
        localStorage.setItem("xevoprop_favorites", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });

    const token = localStorage.getItem("token");
    if (!token) return;

    const isFav = favorites.includes(id);
    fetch(`${API_BASE}/favorites`, {
      method: isFav ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ property_id: id }),
    }).catch(() => {});
  };

  /* PRICE FORMAT */
  const formatPrice = (property) => {
    if (property.priceLabel) return property.priceLabel;
    if (property.price && isNaN(property.price)) return property.price;

    const value = Number(property.price_value || property.price) || 0;
    if (!value) return "Price on Request";

    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)} L`;
    }
    return `₹${value.toLocaleString("en-IN")}`;
  };

  /* FILTER + SORT */
  const filteredProperties = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = properties.filter((property) => {
      /* SEARCH */
      if (query) {
        const text = [
          property.title,
          property.type,
          property.location,
          property.city,
          property.state,
          property.description,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!text.includes(query)) return false;
      }

      /* PROPERTY TYPE */
      if (
        propertyType !== "all" &&
        String(property.type || "").toLowerCase() !== propertyType.toLowerCase()
      ) {
        return false;
      }

      /* BEDROOMS */
      if (bedrooms !== "all") {
        const bhk = Number(property.bedrooms) || 0;
        if (bedrooms === "4+" && bhk < 4) return false;
        if (bedrooms !== "4+" && bhk !== Number(bedrooms)) return false;
      }

      /* PRICE */
      const priceVal = Number(property.price_value || property.price) || 0;
      if (minPrice && (!priceVal || priceVal < Number(minPrice))) return false;
      if (maxPrice && (!priceVal || priceVal > Number(maxPrice))) return false;

      /* AREA */
      const areaVal = Number(property.area) || 0;
      if (minArea && (!areaVal || areaVal < Number(minArea))) return false;

      /* VERIFIED ONLY */
      if (verifiedOnly && !property.verified) return false;

      /* READY TO MOVE */
      if (readyOnly && !property.ready_to_move) return false;

      return true;
    });

    /* SORT */
    result = [...result].sort((a, b) => {
      const priceA = Number(a.price_value || a.price) || 0;
      const priceB = Number(b.price_value || b.price) || 0;

      if (sortBy === "price-low") return priceA - priceB;
      if (sortBy === "price-high") return priceB - priceA;
      if (sortBy === "area") return (Number(b.area) || 0) - (Number(a.area) || 0);

      // Default: newest
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });

    return result;
  }, [
    properties,
    search,
    propertyType,
    bedrooms,
    minPrice,
    maxPrice,
    minArea,
    verifiedOnly,
    readyOnly,
    sortBy,
  ]);

  /* RESET FILTERS */
  const resetFilters = () => {
    setSearch("");
    setPropertyType("all");
    setBedrooms("all");
    setMinPrice("");
    setMaxPrice("");
    setMinArea("");
    setVerifiedOnly(false);
    setReadyOnly(false);
    setSortBy("newest");
  };

  const activeFilterCount = [
    search.trim() !== "",
    propertyType !== "all",
    bedrooms !== "all",
    minPrice !== "",
    maxPrice !== "",
    minArea !== "",
    verifiedOnly,
    readyOnly,
  ].filter(Boolean).length;

  return (
    <main className="properties-page">
      {/* HERO SECTION */}
      <section className="properties-hero">
        <div className="properties-hero-inner">
          <div className="properties-hero-copy">
            <span className="properties-badge">The Collection</span>
            <h1>
              Find a place
              <br />
              worth coming home to.
            </h1>
            <p>
              Explore thoughtfully selected properties across prime locations, verified
              budgets, and institutional developer portfolios.
            </p>
          </div>

          <div className="properties-hero-count">
            <strong>{filteredProperties.length}</strong>
            <span>properties available</span>
          </div>
        </div>
      </section>

      {/* 2-COLUMN MARKETPLACE LAYOUT */}
      <div className="properties-main">
        <div className="properties-layout">
          {/* LEFT FILTERS SIDEBAR */}
          <aside className="filters-sidebar">
            <div className="filters-header">
              <h2>Filters</h2>
              {activeFilterCount > 0 && (
                <button type="button" onClick={resetFilters} className="clear-btn">
                  Clear all ({activeFilterCount})
                </button>
              )}
            </div>

            {/* SEARCH */}
            <div className="filter-group">
              <label>Search Location</label>
              <div className="search-input-wrap">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="City, locality, project..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search properties"
                />
              </div>
            </div>

            {/* PROPERTY TYPE */}
            <div className="filter-group">
              <label>Property Type</label>
              <select
                className="filter-select"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                aria-label="Select property type"
              >
                <option value="all">All types</option>
                <option value="apartment">Apartments & Flats</option>
                <option value="villa">Luxury Villas</option>
                <option value="house">Independent Houses</option>
                <option value="plot">Residential Plots</option>
                <option value="commercial">Commercial Spaces</option>
              </select>
            </div>

            {/* BEDROOMS */}
            <div className="filter-group">
              <label>Bedrooms (BHK)</label>
              <select
                className="filter-select"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                aria-label="Select bedrooms"
              >
                <option value="all">Any BHK</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4+ BHK</option>
              </select>
            </div>

            {/* PRICE RANGE */}
            <div className="filter-group">
              <label>Price Range (₹)</label>
              <div className="price-range-row">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  aria-label="Minimum price"
                />
                <span className="price-sep">–</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  aria-label="Maximum price"
                />
              </div>
            </div>

            {/* MIN AREA */}
            <div className="filter-group">
              <label>Min Area (Sq. Ft.)</label>
              <input
                type="number"
                placeholder="e.g. 1500"
                value={minArea}
                onChange={(e) => setMinArea(e.target.value)}
                className="filter-select"
                aria-label="Minimum area"
              />
            </div>

            {/* STATUS TOGGLES */}
            <div className="filter-group">
              <label>Status</label>
              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                />
                <span>Verified Only</span>
              </label>

              <label className="filter-checkbox">
                <input
                  type="checkbox"
                  checked={readyOnly}
                  onChange={(e) => setReadyOnly(e.target.checked)}
                />
                <span>Ready to Move</span>
              </label>
            </div>
          </aside>

          {/* RIGHT PROPERTIES CONTENT */}
          <div className="properties-content">
            {/* TOOLBAR */}
            <div className="results-bar">
              <div className="results-count">
                Showing <strong>{filteredProperties.length}</strong> verified properties
              </div>

              <div className="results-sort-wrap">
                <label>Sort by:</label>
                <select
                  className="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  aria-label="Sort properties"
                >
                  <option value="newest">Newest first</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="area">Largest area</option>
                </select>
              </div>
            </div>

            {/* PROPERTIES CATALOG GRID */}
            {loading ? (
              <div className="properties-loading-card">
                <p>Loading verified catalog...</p>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="properties-empty-state">
                <Home size={36} />
                <h3>{properties.length === 0 ? "No Properties Available Right Now" : "No properties match your filters"}</h3>
                <p>
                  {properties.length === 0
                    ? "There are no active property listings at the moment. New verified listings will appear here once published."
                    : "Try clearing filters or expanding your price and location range."}
                </p>
                {properties.length === 0 ? (
                  <Link
                    to="/list-property"
                    className="empty-reset-btn"
                    style={{ textDecoration: "none", display: "inline-block", marginTop: "8px" }}
                  >
                    List Your Property
                  </Link>
                ) : (
                  <button type="button" onClick={resetFilters} className="empty-reset-btn">
                    Reset all filters
                  </button>
                )}
              </div>
            ) : (
              <div className="property-grid">
                {filteredProperties.map((property) => {
                  const id = Number(property.id);
                  const isFav = favorites.includes(id);

                  return (
                    <Link
                      key={property.id}
                      to={`/properties/${property.id}`}
                      className="property-card"
                    >
                      {/* CARD MEDIA */}
                      <div className="card-image-wrap">
                        {isVideoUrl(property.image) ? (
                          <video
                            src={property.image}
                            muted
                            loop
                            playsInline
                            autoPlay
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <img
                            src={
                              property.image ||
                              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
                            }
                            alt={property.title}
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";
                            }}
                          />
                        )}
                        <div className="card-badges">
                          {isVideoUrl(property.image) && (
                            <span className="card-badge" style={{ background: "rgba(15, 23, 42, 0.85)", color: "#38bdf8" }}>
                              🎥 Video Tour
                            </span>
                          )}
                          {property.verified && (
                            <span className="card-badge verified">
                              <CheckCircle2 size={11} />
                              Verified
                            </span>
                          )}
                          {property.ready_to_move && (
                            <span className="card-badge ready">Ready to Move</span>
                          )}
                        </div>

                        <button
                          type="button"
                          className={`card-favorite-btn ${isFav ? "active" : ""}`}
                          onClick={(e) => toggleFavorite(e, property.id)}
                          aria-label="Save property"
                        >
                          <Heart
                            size={16}
                            fill={isFav ? "#EF4444" : "none"}
                            color={isFav ? "#EF4444" : "#FFFFFF"}
                          />
                        </button>
                      </div>

                      {/* CARD CONTENT */}
                      <div className="card-body">
                        <div className="card-price">{formatPrice(property)}</div>
                        <h3 className="card-title">{property.title}</h3>

                        <div className="card-location">
                          <MapPin size={14} />
                          <span>{property.location || property.city}</span>
                        </div>

                        <div className="card-specs">
                          {property.bedrooms && (
                            <span className="card-spec-item">
                              <BedDouble size={14} />
                              {property.bedrooms} BHK
                            </span>
                          )}
                          {property.area && (
                            <span className="card-spec-item">
                              <Maximize size={14} />
                              {Number(property.area).toLocaleString("en-IN")} sq.ft
                            </span>
                          )}
                          <span className="card-spec-item" style={{ marginLeft: "auto", color: "#1E40AF", fontWeight: 600 }}>
                            Explore →
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Properties;
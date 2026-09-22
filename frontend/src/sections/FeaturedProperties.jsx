import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Heart,
  MapPin,
  ShieldCheck,
  Building,
  BedDouble,
  Bath,
  Maximize2,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./FeaturedProperties.css";

const API_URL = import.meta.env.VITE_API_URL || "https://xevoprop.onrender.com/api";

function FeaturedProperties() {
  const navigate = useNavigate();

  const [propertiesList, setPropertiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("xevoprop_favorites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch(`${API_URL}/properties`, {
          signal: AbortSignal.timeout(6000),
        });

        if (response.ok) {
          const data = await response.json();
          const items = Array.isArray(data) ? data : data.properties || [];
          const LEGACY_IDS = new Set([1, 18, 19, 20, 21, 22]);
          const cleanItems = items.filter((p) => !LEGACY_IDS.has(Number(p.id)));
          if (cleanItems.length > 0) {
            setPropertiesList(cleanItems.slice(0, 3));
            return;
          }
        }
      } catch (err) {
        console.warn("Featured properties fetch error:", err.message);
      } finally {
        setLoading(false);
      }

      setPropertiesList([]);
    };

    fetchProperties();
  }, []);

  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem("xevoprop_favorites", JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
  };

  return (
    <section className="featured-v2" id="properties">
      <div className="featured-v2-container">
        {/* SECTION HEADER */}
        <div className="featured-v2-header">
          <div className="header-text-group">
            <div className="header-eyebrow">
              <ShieldCheck size={14} className="eyebrow-icon" />
              <span>HANDPICKED FOR INVESTORS</span>
            </div>
            <h2>
              Prime Verified Listings <span>In Top Corridors</span>
            </h2>
            <p>
              Direct developer and institutional owner listings. Zero brokerage markup, 100% legal title verification.
            </p>
          </div>

          <button
            type="button"
            className="featured-view-all-btn"
            onClick={() => navigate("/properties")}
          >
            <span>Explore All Listings</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* PROPERTY CARDS GRID */}
        {propertiesList.length > 0 ? (
          <div className="featured-v2-grid">
            {propertiesList.map((item, idx) => {
            const isFav = favorites.includes(item.id);
            const priceText = item.priceLabel || (item.price ? `₹${item.price}` : "Price on Request");

            return (
              <motion.article
                key={item.id}
                className="prop-card-glass"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                onClick={() => navigate(`/properties/${item.id}`)}
              >
                {/* CARD MEDIA */}
                <div className="card-media-wrap">
                  <img
                    src={
                      item.image ||
                      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
                    }
                    alt={item.title}
                    className="card-media-img"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80";
                    }}
                  />
                  <div className="card-media-scrim" />

                  {/* TOP CHIPS */}
                  <div className="media-top-chips">
                    {item.verified && (
                      <span className="media-badge verified">
                        <CheckCircle2 size={12} />
                        Verified
                      </span>
                    )}
                  </div>

                  {/* FAVORITE TOGGLE */}
                  <button
                    type="button"
                    className={`card-heart-toggle ${isFav ? "active" : ""}`}
                    onClick={(e) => toggleFavorite(item.id, e)}
                    aria-label="Save property"
                  >
                    <Heart size={16} fill={isFav ? "#EF4444" : "none"} color={isFav ? "#EF4444" : "#FFFFFF"} />
                  </button>

                  {/* BOTTOM MEDIA OVERLAY */}
                  <div className="media-bottom-stats">
                    <div className="media-price-pill">{priceText}</div>
                    {item.pricePerSqft && (
                      <span className="media-sqft-rate">{item.pricePerSqft}</span>
                    )}
                  </div>
                </div>

                {/* CARD CONTENT */}
                <div className="card-body">
                  <div className="card-type-row">
                    <span className="card-asset-type">{item.type || "Apartment"}</span>
                  </div>

                  <h3 className="card-title">{item.title}</h3>

                  <div className="card-locality-row">
                    <MapPin size={14} className="card-loc-icon" />
                    <span>{item.location || item.city}</span>
                  </div>

                  {/* KEY SPECIFICATIONS */}
                  <div className="card-specs-row">
                    <div className="spec-unit">
                      <BedDouble size={14} />
                      <span>{item.bedrooms || 3} BHK</span>
                    </div>
                    <div className="spec-sep">•</div>
                    <div className="spec-unit">
                      <Bath size={14} />
                      <span>{item.bathrooms || 3} Baths</span>
                    </div>
                    <div className="spec-sep">•</div>
                    <div className="spec-unit">
                      <Maximize2 size={14} />
                      <span>{item.area || 2200} sq.ft</span>
                    </div>
                  </div>

                  {/* ACTION BAR */}
                  <div className="card-footer-action">
                    <span className="card-details-text">View Details</span>
                    <ArrowUpRight size={16} className="card-details-arrow-icon" />
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
        ) : !loading && (
          <div
            style={{
              textAlign: "center",
              padding: "54px 24px",
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px dashed rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              color: "#94A3B8",
              margin: "16px 0 0",
            }}
          >
            <Building size={36} style={{ margin: "0 auto 12px", opacity: 0.5 }} />
            <h3 style={{ color: "#FFFFFF", fontSize: "17px", fontWeight: 600, margin: "0 0 6px" }}>
              No Featured Properties Listed
            </h3>
            <p style={{ fontSize: "13.5px", margin: 0, color: "#94A3B8" }}>
              New verified property listings will appear here as soon as they are published.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProperties;
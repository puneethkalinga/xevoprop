import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Home,
  IndianRupee,
  Layers3,
  CheckCircle2,
  Phone,
  Mail,
  Globe,
  CalendarDays,
  ShieldCheck,
  Play,
  Share2,
  Check,
  Send,
  Compass,
  Maximize2,
  Sparkles,
} from "lucide-react";

import { apiFetch } from "../lib/api";
import { vilvaProjects, VILVA_DEVELOPER } from "../data/vilvaProjects";
import { sbInfraVentures, SB_INFRA_DEVELOPER } from "../data/sbInfraProjects";
import "./ProjectDetails.css";

const ALL_LOCAL_PROJECTS = [...vilvaProjects, ...sbInfraVentures];

const isVideoMedia = (url) => {
  if (!url || typeof url !== "string") return false;
  return /\.(mp4|mov|webm|mkv|avi|m4v)(\?.*)?$/i.test(url) || url.includes("/video/upload/");
};

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Enquiry form state
  const [enquiryForm, setEnquiryForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [enquirySending, setEnquirySending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadProject = async () => {
      try {
        setLoading(true);

        // 1. First check local authoritative Projects dataset (Vilva Projects + SB Infra Ventures)
        const localMatch = ALL_LOCAL_PROJECTS.find(
          (p) =>
            String(p.id) === String(id) ||
            p.slug === id ||
            p.slug === String(id).toLowerCase() ||
            p.name.toLowerCase() === String(id).toLowerCase().replace(/-/g, " ")
        );

        if (localMatch) {
          if (!cancelled) {
            setProject(localMatch);
            setLoading(false);
          }
          return;
        }

        // 2. Fallback to API if not in static dataset
        const data = await apiFetch(`/projects/public/${id}`);
        if (!cancelled) {
          setProject(data.project);
        }
      } catch (error) {
        console.error("Project details error:", error);
        // Fallback to first project if not found
        if (!cancelled && ALL_LOCAL_PROJECTS.length > 0) {
          setProject(ALL_LOCAL_PROJECTS[0]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProject();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    if (!enquiryForm.name || !enquiryForm.phone) return;
    setEnquirySending(true);

    setTimeout(() => {
      setEnquirySending(false);
      setEnquirySubmitted(true);
      setEnquiryForm({ name: "", phone: "", email: "", message: "" });
    }, 600);
  };

  if (loading) {
    return (
      <div className="project-details-page">
        <div className="project-details-container">
          <div className="project-details-loading">
            <div className="project-loading-spinner" />
            <span>Loading technical project specifications...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="project-details-page">
        <div className="project-details-container">
          <div className="project-not-found">
            <div className="project-not-found-icon">
              <Building2 size={28} />
            </div>
            <h1>Project Not Found</h1>
            <p>We couldn't locate the requested project details.</p>
            <button
              className="project-back-main"
              onClick={() => navigate("/projects")}
            >
              <ArrowLeft size={15} />
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  const allImages =
    project.gallery && project.gallery.length > 0
      ? project.gallery
      : project.images && project.images.length > 0
      ? project.images.map((img) => img.image_url || img)
      : project.image
      ? [project.image]
      : [];

  const currentImg = allImages[selectedImageIndex] || project.image;
  const developer = project.developer || (project.isVenture ? SB_INFRA_DEVELOPER : VILVA_DEVELOPER);
  const statusClass = String(project.status || "ongoing").toLowerCase();

  return (
    <div className="project-details-page">
      <div className="project-details-container">
        {/* TOP BAR / BREADCRUMB */}
        <div className="project-details-topbar">
          <button
            className="project-details-back"
            onClick={() => navigate("/projects")}
          >
            <ArrowLeft size={16} />
            Back to Projects
          </button>

          <div className="project-breadcrumbs">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/projects">Projects</Link>
            <span>/</span>
            <span className="current">{project.name}</span>
          </div>

          <button className="project-share-btn" onClick={handleShare}>
            {copied ? <Check size={14} color="#16a34a" /> : <Share2 size={14} />}
            {copied ? "Link Copied!" : "Share"}
          </button>
        </div>

        {/* HERO SECTION */}
        <section className="project-details-hero">
          {/* GALLERY CONTAINER */}
          <div className="project-details-image">
            {showVideo && (project.isLocalVideo || project.video?.endsWith(".mp4") || project.videoUrl?.endsWith(".mp4")) ? (
              <div className="project-video-frame local-video-container">
                <video
                  src={project.video || project.videoUrl}
                  poster={project.image}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  ref={(el) => {
                    if (el) {
                      el.muted = true;
                      el.volume = 0;
                    }
                  }}
                  onVolumeChange={(e) => {
                    e.currentTarget.muted = true;
                    e.currentTarget.volume = 0;
                  }}
                  className="project-html5-video"
                />
                <button
                  className="project-close-video-btn"
                  onClick={() => setShowVideo(false)}
                >
                  ✕ View Photos
                </button>
              </div>
            ) : showVideo && project.videoUrl ? (
              <div className="project-video-frame">
                <iframe
                  src={project.videoUrl}
                  title={`${project.name} Video Walkthrough`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
                <button
                  className="project-close-video-btn"
                  onClick={() => setShowVideo(false)}
                >
                  ✕ View Photos
                </button>
              </div>
            ) : isVideoMedia(currentImg) ? (
              <div className="project-video-frame local-video-container" style={{ width: "100%", height: "100%", minHeight: "360px" }}>
                <video
                  src={currentImg}
                  controls
                  playsInline
                  preload="metadata"
                  className="project-html5-video"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ) : currentImg ? (
              <img
                src={currentImg}
                alt={project.name}
                loading="eager"
              />
            ) : (
              <div className="project-details-placeholder">
                <Building2 size={48} />
                <span>Project Image</span>
              </div>
            )}

            {/* VIDEO TOGGLE BUTTON */}
            {(project.video || project.videoUrl) && !showVideo && (
              <button
                className="project-watch-video-btn"
                onClick={() => setShowVideo(true)}
              >
                <Play size={14} fill="#ffffff" />
                {project.isVenture ? "▶ Watch Venture Video Tour" : "Watch Video Walkthrough"}
              </button>
            )}

            {/* THUMBNAIL SELECTOR */}
            {!showVideo && (
              <div className="project-details-thumbs">
                {(project.video || project.videoUrl) && (
                  <button
                    type="button"
                    className="project-thumb-btn project-thumb-video-launcher"
                    onClick={() => setShowVideo(true)}
                    title="Play Venture Video"
                  >
                    <span>▶ Video</span>
                  </button>
                )}
                {allImages.map((thumbUrl, idx) => {
                  const isVid = isVideoMedia(thumbUrl);
                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`project-thumb-btn ${
                        idx === selectedImageIndex ? "active" : ""
                      }`}
                      onClick={() => setSelectedImageIndex(idx)}
                      title={`View ${isVid ? "video" : "photo"} ${idx + 1}`}
                      style={{ position: "relative", overflow: "hidden" }}
                    >
                      {isVid ? (
                        <div style={{ position: "relative", width: "100%", height: "100%", background: "#0b1736", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <video
                            src={thumbUrl}
                            preload="metadata"
                            style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }}
                          />
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", color: "#fff" }}>
                            <Play size={12} fill="#fff" />
                          </div>
                        </div>
                      ) : (
                        <img src={thumbUrl} alt={`${project.name} photo ${idx + 1}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* INTRO CONTENT */}
          <div className="project-details-intro">
            <div className="project-intro-header-badges">
              <span className="project-details-label">
                {project.projectCategory || "PREMIUM PROJECT"}
              </span>
              <span className={`project-status-pill status-${statusClass}`}>
                {project.status || "Ongoing"}
              </span>
            </div>

            <h1>{project.name}</h1>

            {project.subtitle && (
              <p className="project-tagline">{project.subtitle}</p>
            )}

            <div className="project-details-location">
              <MapPin size={17} />
              <span>
                {project.location}
                {project.city ? `, ${project.city}` : ""}
              </span>
            </div>

            {/* DEVELOPER PILL */}
            <div className="project-developer-badge-row">
              <Building2 size={16} className="dev-icon" />
              <span>Developed by <strong>{developer.name}</strong></span>
              <span className="verified-check" title="Verified Developer">✓</span>
            </div>

            <p className="project-details-description">
              {Array.isArray(project.descriptions)
                ? project.descriptions[0]
                : project.description ||
                  "Discover an architecturally superior gated development designed for modern luxury and lasting value."}
            </p>

            <div className="project-details-actions">
              <a
                href="#developer-contact"
                className="project-primary-button"
              >
                <Phone size={16} />
                Contact Developer
              </a>

              <a
                href={`tel:${developer.phone || "8977761133"}`}
                className="project-secondary-button"
              >
                <Phone size={15} />
                +91 {developer.phone || "89777 61133"}
              </a>
            </div>
          </div>
        </section>

        {/* QUICK STATS */}
        <section className="project-stats">
          <div className="project-stat-card">
            <div className="project-stat-icon">
              <Building2 size={18} />
            </div>
            <div>
              <span>Project Type</span>
              <strong>{project.type || "Luxury Residential"}</strong>
            </div>
          </div>

          <div className="project-stat-card">
            <div className="project-stat-icon">
              <Home size={18} />
            </div>
            <div>
              <span>Total Units</span>
              <strong>{project.totalUnitsText || `${project.units || "—"} Units`}</strong>
            </div>
          </div>

          <div className="project-stat-card">
            <div className="project-stat-icon">
              <Maximize2 size={18} />
            </div>
            <div>
              <span>Unit Sizes / Area</span>
              <strong>{project.area || "Contact for Details"}</strong>
            </div>
          </div>

          <div className="project-stat-card">
            <div className="project-stat-icon">
              <IndianRupee size={18} />
            </div>
            <div>
              <span>Price</span>
              <strong>{project.price || "Price on Request"}</strong>
            </div>
          </div>

          <div className="project-stat-card">
            <div className="project-stat-icon">
              <Compass size={18} />
            </div>
            <div>
              <span>Status</span>
              <strong>{project.status || "Ongoing"}</strong>
            </div>
          </div>

          <div className="project-stat-card">
            <div className="project-stat-icon">
              <ShieldCheck size={18} />
            </div>
            <div>
              <span>Approvals</span>
              <strong>{project.approvals || "RERA & HMDA Compliant"}</strong>
            </div>
          </div>
        </section>

        {/* MAIN BODY: SPECIFICATIONS, AMENITIES & DEVELOPER CARD */}
        <div className="project-body-grid">
          <div className="project-main-column">
            {/* 1. ABOUT & HIGHLIGHTS */}
            <section className="project-section-card">
              <div className="project-section-heading">
                <span>PROJECT OVERVIEW</span>
                <h2>
                  Designed for <em>exceptional living.</em>
                </h2>
              </div>

              {Array.isArray(project.descriptions) ? (
                project.descriptions.map((desc, idx) => (
                  <p key={idx} className="project-paragraph">
                    {desc}
                  </p>
                ))
              ) : (
                <p className="project-paragraph">
                  {project.description}
                </p>
              )}

              {/* HIGHLIGHTS CHECKLIST */}
              {project.highlights && project.highlights.length > 0 && (
                <div className="project-highlights-box">
                  <h3>Key Project Highlights</h3>
                  <div className="project-highlights-grid">
                    {project.highlights.map((item, idx) => (
                      <div key={idx} className="project-highlight-item">
                        <CheckCircle2 size={17} className="check-icon" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* 2. TECHNICAL SPECIFICATIONS (INCH BY INCH) */}
            {project.specifications && project.specifications.length > 0 && (
              <section className="project-section-card">
                <div className="project-section-heading">
                  <span>ENGINEERING EXCELLENCE</span>
                  <h2>
                    Detailed Technical <em>Specifications</em>
                  </h2>
                  <p className="section-subtext">
                    Comprehensive construction details and material specifications as established by {developer.name || "the developer"}.
                  </p>
                </div>

                <div className="project-specs-grid">
                  {project.specifications.map((spec, idx) => {
                    const title = typeof spec === "object" ? spec.title : `Specification ${idx + 1}`;
                    const rawDetails = typeof spec === "object" ? spec.details : spec;
                    // Strip any stray html tags like <strong>
                    const cleanDetails = rawDetails.replace(/<\/?strong>/g, "");

                    return (
                      <div key={idx} className="project-spec-card">
                        <div className="spec-header">
                          <span className="spec-number">{String(idx + 1).padStart(2, "0")}</span>
                          <h4>{title}</h4>
                        </div>
                        <p>{cleanDetails}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 3. WORLD-CLASS AMENITIES */}
            {project.amenities && project.amenities.length > 0 && (
              <section className="project-section-card">
                <div className="project-section-heading">
                  <span>LIFESTYLE & RECREATION</span>
                  <h2>
                    World-Class <em>Amenities</em>
                  </h2>
                  <p className="section-subtext">
                    Designed to provide a wholesome lifestyle for residents of all ages.
                  </p>
                </div>

                <div className="project-amenities-grid">
                  {project.amenities.map((amenity, idx) => {
                    const name = typeof amenity === "object" ? amenity.name : amenity;
                    return (
                      <div key={idx} className="project-amenity-chip">
                        <Sparkles size={15} className="amenity-icon" />
                        <span>{name}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* 4. CLUBHOUSE AMENITIES */}
            {project.clubhouseAmenities && project.clubhouseAmenities.length > 0 && (
              <section className="project-section-card">
                <div className="project-section-heading">
                  <span>CLUBHOUSE PRIVILEGES</span>
                  <h2>
                    Signature Clubhouse <em>Features</em>
                  </h2>
                </div>

                <div className="project-amenities-grid">
                  {project.clubhouseAmenities.map((facility, idx) => (
                    <div key={idx} className="project-amenity-chip clubhouse-chip">
                      <CheckCircle2 size={15} className="amenity-icon" />
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>

                {project.clubhouseProvisions && (
                  <div className="clubhouse-provisions-note">
                    <strong>Planned Provisions:</strong> {project.clubhouseProvisions.join(" • ")}
                  </div>
                )}
              </section>
            )}

            {/* 5. FLOOR PLANS / UNIT SIZES TABLE */}
            {project.floorPlans && project.floorPlans.length > 0 && (
              <section className="project-section-card">
                <div className="project-section-heading">
                  <span>UNIT CONFIGURATIONS</span>
                  <h2>
                    Floor Plans & <em>Dimensions</em>
                  </h2>
                </div>

                <div className="project-table-wrapper">
                  <table className="project-floor-table">
                    <thead>
                      <tr>
                        <th>Unit / Flat</th>
                        <th>Facing</th>
                        <th>Saleable Area</th>
                        <th>Plinth Area</th>
                        <th>Carpet Area</th>
                      </tr>
                    </thead>
                    <tbody>
                      {project.floorPlans.map((fp, idx) => (
                        <tr key={idx}>
                          <td><strong>{fp.flat}</strong></td>
                          <td>
                            <span className="facing-badge">{fp.facing}</span>
                          </td>
                          <td>{fp.saleableArea}</td>
                          <td>{fp.plinthArea}</td>
                          <td>{fp.carpetArea}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* 6. LOCATION CONNECTIVITY */}
            {project.connectivity && project.connectivity.length > 0 && (
              <section className="project-section-card">
                <div className="project-section-heading">
                  <span>STRATEGIC CONNECTIVITY</span>
                  <h2>
                    Location & <em>Proximity</em>
                  </h2>
                </div>

                <div className="project-connectivity-list">
                  {project.connectivity.map((conn, idx) => (
                    <div key={idx} className="project-conn-card">
                      <div className="conn-icon-box">
                        <MapPin size={17} />
                      </div>
                      <div>
                        <h4>{conn.title}</h4>
                        <p>{conn.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 7. PROJECT TEAM & CONSULTANTS */}
            {project.team && (
              <section className="project-section-card">
                <div className="project-section-heading">
                  <span>EXPERT TEAM</span>
                  <h2>
                    Architects & <em>Design Partners</em>
                  </h2>
                </div>

                <div className="project-team-grid">
                  {project.team.architect && (
                    <div className="team-card">
                      <span>Architect & Interior Design</span>
                      <strong>{project.team.architect}</strong>
                    </div>
                  )}
                  {project.team.structuralConsultant && (
                    <div className="team-card">
                      <span>Structural Design Consultants</span>
                      <strong>{project.team.structuralConsultant}</strong>
                    </div>
                  )}
                  {project.team.projectManagementConsultant && (
                    <div className="team-card">
                      <span>Project Management Consultant</span>
                      <strong>{project.team.projectManagementConsultant}</strong>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT SIDEBAR: DEVELOPER PROFILE & DIRECT ENQUIRY */}
          <aside className="project-sidebar-column" id="developer-contact">
            {/* DEVELOPER PROFILE */}
            <div className="developer-profile-card">
              <div className="dev-profile-header">
                <div className="dev-profile-avatar">
                  <Building2 size={24} />
                </div>
                <div>
                  <div className="dev-name-row">
                    <h3>{developer.name}</h3>
                    <span className="dev-verified-tag">Verified</span>
                  </div>
                  <span className="dev-company-sub">{developer.companyName || "VilvaInfra Developers"}</span>
                </div>
              </div>

              <div className="dev-details-list">
                <div className="dev-detail-item">
                  <MapPin size={15} />
                  <span>{developer.officeAddress}</span>
                </div>
                <div className="dev-detail-item">
                  <Phone size={15} />
                  <a href={`tel:${developer.phone}`}>+91 {developer.phone}</a>
                </div>
                <div className="dev-detail-item">
                  <Mail size={15} />
                  <a href={`mailto:${developer.email}`}>{developer.email}</a>
                </div>
                <div className="dev-detail-item">
                  <Globe size={15} />
                  <a href={developer.website} target="_blank" rel="noopener noreferrer">
                    {developer.website.replace("https://", "")}
                  </a>
                </div>
              </div>
            </div>

            {/* DIRECT ENQUIRY FORM */}
            <div className="project-contact-card">
              <div className="project-contact-icon">
                <CalendarDays size={21} />
              </div>

              <span className="project-contact-label">DIRECT BUILDER ENQUIRY</span>
              <h3>Inquire About {project.name}</h3>
              <p>
                Direct connection to {developer.name || "the developer"}. Receive complete pricing sheets, unit availability, and schedule site visits.
              </p>

              {enquirySubmitted ? (
                <div className="enquiry-success-banner">
                  <CheckCircle2 size={22} color="#16a34a" />
                  <h4>Enquiry Sent Successfully!</h4>
                  <p>{developer.name || "Developer"} sales team will contact you shortly.</p>
                  <button
                    type="button"
                    onClick={() => setEnquirySubmitted(false)}
                    className="send-another-btn"
                  >
                    Send another enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="project-enquiry-form">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      required
                      value={enquiryForm.name}
                      onChange={(e) =>
                        setEnquiryForm({ ...enquiryForm, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                      value={enquiryForm.phone}
                      onChange={(e) =>
                        setEnquiryForm({ ...enquiryForm, phone: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      value={enquiryForm.email}
                      onChange={(e) =>
                        setEnquiryForm({ ...enquiryForm, email: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Message / Requirements</label>
                    <textarea
                      rows={3}
                      placeholder={`I am interested in ${project.name}. Please share floor plans, pricing, and available units.`}
                      value={enquiryForm.message}
                      onChange={(e) =>
                        setEnquiryForm({ ...enquiryForm, message: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="project-contact-button"
                    disabled={enquirySending}
                  >
                    {enquirySending ? (
                      "Sending Enquiry..."
                    ) : (
                      <>
                        <Send size={15} />
                        Submit Enquiry to {developer.name || "Developer"}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
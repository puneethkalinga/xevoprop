import { useRef, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Plus,
  Loader2,
  ImagePlus,
  Video,
  Film,
  Play,
  X,
  FileText,
  Download,
  ExternalLink,
  Upload,
  CheckCircle2,
  ShieldCheck,
  FileCheck,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AgreementViewerModal from "../components/AgreementViewerModal";
import { submitProjectWithAgreement } from "../lib/adminStore";
import {
  REAL_ESTATE_STATES,
  CITIES_BY_STATE,
  USAGE_TYPES,
  PROPERTY_TYPES,
  BUDGET_PRESETS,
} from "../data/locationAndTypes";
import "./AddProject.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://xevoprop.onrender.com/api";

function AddProject() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const agreementFileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    location: "All",
    city: "Hyderabad",
    state: "Telegana",
    type: "Apartment",
    usage_type: "Investment",
    units: "",
    price: "",
    description: "",
    status: "Available",
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [signedAgreementFile, setSignedAgreementFile] = useState(null);
  const [declarations, setDeclarations] = useState({
    readAndAgreed: false,
    infoAccurate: false,
    authorized: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleStateChange = (e) => {
    const selectedState = e.target.value;
    const cities = CITIES_BY_STATE[selectedState] || [];
    setFormData((previous) => ({
      ...previous,
      state: selectedState,
      city: cities[0] || "",
    }));
  };

  const handleBudgetPreset = (preset) => {
    setFormData((previous) => ({
      ...previous,
      price: preset.priceText,
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const maxTotal = 30; // Expanded to 30 media items (supports multiple photos and multiple videos)
    const remaining = maxTotal - selectedImages.length;
    if (remaining <= 0) {
      setError(`You can upload a maximum of ${maxTotal} photos and videos.`);
      e.target.value = "";
      return;
    }

    const filesToAdd = files.slice(0, remaining);

    // Validate each file for valid image or video type and respective limits
    for (const f of filesToAdd) {
      const isImage = f.type.startsWith("image/") || /\.(jpg|jpeg|png|webp|heic)$/i.test(f.name);
      const isVideo = f.type.startsWith("video/") || /\.(mp4|mov|webm|mkv|avi|m4v)$/i.test(f.name);

      if (!isImage && !isVideo) {
        setError(`File "${f.name}" is not a supported format. Please upload photos (JPG, PNG, WEBP) or videos (MP4, MOV, WEBM).`);
        e.target.value = "";
        return;
      }

      // 100MB photo limit
      if (isImage && f.size > 100 * 1024 * 1024) {
        setError(`Photo "${f.name}" exceeds the 100MB limit. Max 100MB per photo.`);
        e.target.value = "";
        return;
      }

      // 250MB video limit
      if (isVideo && f.size > 250 * 1024 * 1024) {
        setError(`Video "${f.name}" exceeds the 250MB limit. Max 250MB per video walkthrough.`);
        e.target.value = "";
        return;
      }
    }

    setError("");

    const newMedia = filesToAdd.map((file) => {
      const isVideo = file.type.startsWith("video/") || /\.(mp4|mov|webm|mkv|avi|m4v)$/i.test(file.name);
      return {
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        sizeFormatted: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        type: isVideo ? "video" : "image",
        preview: URL.createObjectURL(file),
      };
    });

    setSelectedImages((prev) => [...prev, ...newMedia]);
    e.target.value = "";
  };

  const removeImage = (id) => {
    setSelectedImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target && target.preview) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  const setCoverImage = (index) => {
    if (index === 0) return;
    setSelectedImages((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      copy.unshift(selected);
      return copy;
    });
  };

  const handleSignedAgreementUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      setError("Document exceeds maximum allowed size of 15MB.");
      e.target.value = "";
      return;
    }

    const nameLower = file.name.toLowerCase();
    const isValidExt = nameLower.endsWith(".pdf") || nameLower.endsWith(".doc") || nameLower.endsWith(".docx");

    if (!isValidExt) {
      setError("Invalid file format. Please upload a PDF, DOC, or DOCX document.");
      e.target.value = "";
      return;
    }

    setError("");
    setSignedAgreementFile({
      name: file.name,
      size: file.size,
      file,
      dataUrl: URL.createObjectURL(file),
    });
    e.target.value = "";
  };

  const handleAgreementDownload = () => {
    const a = document.createElement("a");
    a.href = "/documents/Builder_Listing_Commission_Agreementfinal.docx";
    a.download = "Builder_Listing_Commission_Agreementfinal.docx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDeclarationChange = (key) => {
    setDeclarations((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isReadyToSubmit =
    formData.name.trim() !== "" &&
    formData.location.trim() !== "" &&
    formData.type !== "" &&
    selectedImages.length > 0 &&
    signedAgreementFile !== null &&
    declarations.readAndAgreed &&
    declarations.infoAccurate &&
    declarations.authorized;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Project name is required.");
      return;
    }

    if (!formData.location.trim()) {
      setError("Location is required.");
      return;
    }

    if (!formData.type) {
      setError("Project type is required.");
      return;
    }

    if (selectedImages.length === 0) {
      setError("Please add at least one project photo or video.");
      return;
    }

    if (!signedAgreementFile) {
      setError("Please upload the digitally signed Builder Listing & Commission Agreement.");
      return;
    }

    if (!declarations.readAndAgreed || !declarations.infoAccurate || !declarations.authorized) {
      setError("Please confirm all declarations before submitting your project.");
      return;
    }

    try {
      setLoading(true);
      setUploadStatus("Submitting project and signed agreement for admin approval...");

      const completeLocation = [
        formData.location.trim(),
        formData.city.trim(),
        formData.state.trim(),
      ].filter(Boolean).join(", ");

      // 1. Submit through admin store with agreement and declarations
      submitProjectWithAgreement({
        name: formData.name.trim(),
        location: completeLocation,
        city: formData.city.trim() || "Hyderabad",
        state: formData.state.trim() || "Telangana",
        type: formData.type,
        units: formData.units,
        price: formData.price.trim(),
        description: formData.description.trim(),
        images: selectedImages,
        builder: user || { id: 46, name: "SB Infra", role: "Developer" },
        agreementFile: signedAgreementFile,
        declarations,
      });

      // 2. Also try external API if token is present
      const token = localStorage.getItem("token");
      if (token && !token.startsWith("jwt_token_")) {
        try {
          const res = await fetch(`${API_URL}/projects`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name: formData.name.trim(),
              location: completeLocation,
              city: formData.city.trim() || null,
              type: formData.type,
              units: formData.units ? Number(formData.units) : null,
              price: formData.price.trim() || null,
              description: formData.description.trim() || null,
              status: "Awaiting Approval",
            }),
          });
          const data = await res.json();
          const projectId = data.project?.id;
          if (projectId && selectedImages.length > 0) {
            for (let i = 0; i < selectedImages.length; i++) {
              if (selectedImages[i].file) {
                const imageFormData = new FormData();
                imageFormData.append("image", selectedImages[i].file);
                await fetch(`${API_URL}/upload/project/${projectId}`, {
                  method: "POST",
                  headers: { Authorization: `Bearer ${token}` },
                  body: imageFormData,
                }).catch(() => {});
              }
            }
          }
        } catch (apiErr) {
          console.warn("Backend API sync failed, recorded in local store:", apiErr);
        }
      }

      setLoading(false);
      navigate("/my-projects", {
        state: {
          submittedSuccess: true,
          projectName: formData.name.trim(),
        },
      });
    } catch (err) {
      console.error("CREATE PROJECT ERROR:", err);
      setError(err.message || "Unable to submit project.");
      setLoading(false);
    }
  };

  return (
    <div className="add-project-page">
      <div className="add-project-container">

        <button
          type="button"
          className="add-project-back"
          onClick={() => navigate("/my-projects")}
        >
          <ArrowLeft size={16} />
          Back to my projects
        </button>

        <div className="add-project-header">
          <div className="add-project-icon">
            <Building2 size={22} />
          </div>

          <div>
            <span>DEVELOPER SPACE</span>

            <h1>Create Project</h1>

            <p>
              Add a new property project to
              Xevoprop.
            </p>
          </div>
        </div>

        {error && (
          <div className="add-project-error">
            {error}
          </div>
        )}

        <form
          className="add-project-form"
          onSubmit={handleSubmit}
        >

          {/* BASIC INFORMATION */}

          <section className="project-form-section">
            <div className="project-form-heading">
              <span>01</span>

              <div>
                <h2>Basic information</h2>
                <p>
                  Tell buyers about your project.
                </p>
              </div>
            </div>

            <div className="project-form-grid">

              <div className="project-form-group full">
                <label>
                  Project name
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Green Valley Residency"
                  required
                />
              </div>

              <div className="project-form-group">
                <label>
                  Property Type
                  <span>*</span>
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="project-form-group">
                <label>
                  Usage Type
                  <span>*</span>
                </label>

                <select
                  name="usage_type"
                  value={formData.usage_type}
                  onChange={handleChange}
                  required
                >
                  {USAGE_TYPES.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>

              <div className="project-form-group">
                <label>Status</label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Available">
                    Available
                  </option>
                  <option value="Upcoming">
                    Upcoming
                  </option>
                  <option value="Sold Out">
                    Sold Out
                  </option>
                  <option value="Completed">
                    Completed
                  </option>
                  <option value="Draft">
                    Draft
                  </option>
                </select>
              </div>

            </div>
          </section>

          {/* LOCATION */}

          <section className="project-form-section">
            <div className="project-form-heading">
              <span>02</span>

              <div>
                <h2>Project location</h2>
                <p>
                  Specify the state, city, and locality.
                </p>
              </div>
            </div>

            <div className="project-form-grid">

              <div className="project-form-group">
                <label>
                  State
                  <span>*</span>
                </label>

                <select
                  name="state"
                  value={formData.state}
                  onChange={handleStateChange}
                  required
                >
                  {REAL_ESTATE_STATES.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="project-form-group">
                <label>
                  City
                  <span>*</span>
                </label>

                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                >
                  {(CITIES_BY_STATE[formData.state] || []).map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="project-form-group full">
                <label>
                  Location / Locality
                  <span>*</span>
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. All, Gachibowli, Bandra, Whitefield..."
                  required
                />

                <div className="preset-chips">
                  <span className="preset-label">Quick select:</span>
                  {["All", "Gachibowli", "Financial District", "Bandra", "Whitefield"].map((loc) => (
                    <button
                      type="button"
                      key={loc}
                      className={`preset-chip-btn ${formData.location === loc ? "active" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, location: loc }))}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </section>

          {/* PROJECT DETAILS */}

          <section className="project-form-section">
            <div className="project-form-heading">
              <span>03</span>

              <div>
                <h2>Project details</h2>
                <p>
                  Add pricing, image and
                  availability information.
                </p>
              </div>
            </div>

            <div className="project-form-grid">

              <div className="project-form-group">
                <label>
                  Total units
                  <span>*</span>
                </label>

                <input
                  type="number"
                  name="units"
                  min="0"
                  value={formData.units}
                  onChange={handleChange}
                  placeholder="e.g. 120"
                  required
                />
              </div>

              <div className="project-form-group">
                <label>
                  Unit / Property Type
                  <span>*</span>
                </label>

                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <div className="preset-chips">
                  <span className="preset-label">Quick select:</span>
                  {PROPERTY_TYPES.map((t) => (
                    <button
                      type="button"
                      key={t}
                      className={`preset-chip-btn ${formData.type === t ? "active" : ""}`}
                      onClick={() => setFormData((prev) => ({ ...prev, type: t }))}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="project-form-group full">
                <label>Budget / Price</label>

                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. ₹75 Lakh onwards"
                />

                <div className="preset-chips">
                  <span className="preset-label">Budget presets:</span>
                  {BUDGET_PRESETS.map((p) => (
                    <button
                      type="button"
                      key={p.label}
                      className={`preset-chip-btn ${formData.price === p.priceText ? "active" : ""}`}
                      onClick={() => handleBudgetPreset(p)}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* MULTI-MEDIA GALLERY UPLOAD (PHOTOS & VIDEOS) */}

              <div className="project-form-group full">
                <div className="project-images-header">
                  <label>
                    Project Media (Photos & Videos)
                    <span>*</span>
                  </label>
                  <span className="project-images-counter">
                    {selectedImages.length} / 30 media items selected ({selectedImages.filter((m) => m.type !== "video").length} photos, {selectedImages.filter((m) => m.type === "video").length} videos) · Photos max 100MB · Videos max 250MB
                  </span>
                </div>

                {selectedImages.length === 0 ? (
                  <button
                    type="button"
                    className="project-image-upload"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    <div className="upload-media-icons-row">
                      <ImagePlus size={30} />
                      <Video size={30} />
                    </div>

                    <strong>
                      Upload Project Photos & Walkthrough Videos (Multiple)
                    </strong>

                    <span>
                      JPG, PNG, WEBP, MP4, MOV, WEBM, MKV · Max 100MB per photo · Max 250MB per video
                    </span>

                    <span className="project-upload-hint">
                      Select multiple high-resolution photos, drone footage, and HD walkthrough videos to showcase your property
                    </span>

                    <em>
                      Choose Photos & Videos
                    </em>
                  </button>
                ) : (
                  <div className="project-gallery-wrapper">
                    <div className="project-gallery-grid">
                      {selectedImages.map((img, idx) => (
                        <div
                          key={img.id}
                          className={`project-gallery-card ${idx === 0 ? "is-cover" : ""} ${img.type === "video" ? "is-video-card" : ""}`}
                        >
                          {img.type === "video" ? (
                            <div className="video-preview-wrapper">
                              <video
                                src={img.preview}
                                controls
                                preload="metadata"
                                playsInline
                              />
                              <span className="media-type-badge video-badge">
                                <Video size={11} /> VIDEO · {img.sizeFormatted}
                              </span>
                            </div>
                          ) : (
                            <>
                              <img
                                src={img.preview}
                                alt={`Upload ${idx + 1}`}
                              />
                              <span className="media-type-badge photo-badge">
                                PHOTO {img.sizeFormatted ? `· ${img.sizeFormatted}` : ""}
                              </span>
                            </>
                          )}

                          <div className="gallery-card-header">
                            {idx === 0 ? (
                              <span className="cover-tag">
                                ★ Primary Cover
                              </span>
                            ) : (
                              <button
                                type="button"
                                className="make-cover-tag"
                                onClick={() => setCoverImage(idx)}
                              >
                                Set as Cover
                              </button>
                            )}

                            <button
                              type="button"
                              className="remove-photo-btn"
                              onClick={() => removeImage(img.id)}
                              aria-label="Remove media"
                              title="Remove media"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {selectedImages.length < 30 && (
                        <button
                          type="button"
                          className="project-add-more-card"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Plus size={26} />
                          <strong>Add More Photos & Videos</strong>
                          <span>Photos up to 100MB · Videos up to 250MB</span>
                        </button>
                      )}
                    </div>

                    <div className="project-gallery-footer">
                      <span>The first item is automatically used as the primary card cover. You can upload multiple walkthrough videos and photos.</span>
                      <button
                        type="button"
                        className="project-clear-btn"
                        onClick={() => {
                          selectedImages.forEach((img) => URL.revokeObjectURL(img.preview));
                          setSelectedImages([]);
                        }}
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/jpg,image/heic,video/mp4,video/quicktime,video/webm,video/x-matroska,video/x-msvideo"
                  multiple
                  onChange={handleImageSelect}
                  hidden
                />
              </div>

              {/* DESCRIPTION */}

              <div className="project-form-group full">
                <label>Description</label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the project, amenities, connectivity and other important details..."
                  rows="6"
                />
              </div>

            </div>
          </section>

          {/* 03: AGREEMENT & AUTHORIZATION */}
          <section className="project-form-section">
            <div className="project-form-heading">
              <span>03</span>
              <div>
                <h2>Agreement & Authorization</h2>
                <p>
                  Review the agreement, digitally sign it and confirm the declarations.
                </p>
              </div>
            </div>

            <div className="agreement-section-content">
              {/* Card 1: Official Agreement Card */}
              <div className="agreement-document-card">
                <div className="agreement-doc-icon-wrap">
                  <FileText size={24} className="agreement-doc-icon" />
                </div>
                <div className="agreement-doc-info">
                  <h3>Builder Listing & Commission Agreement</h3>
                  <p>Review the official agreement before submitting your project.</p>
                </div>
                <div className="agreement-doc-actions">
                  <button
                    type="button"
                    className="agreement-action-btn secondary"
                    onClick={() => setIsAgreementModalOpen(true)}
                  >
                    <ExternalLink size={16} />
                    Open
                  </button>
                  <button
                    type="button"
                    className="agreement-action-btn primary"
                    onClick={handleAgreementDownload}
                  >
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>

              {/* Card 2: Upload Digitally Signed Agreement dropzone */}
              <div
                className={`agreement-dropzone ${signedAgreementFile ? "has-file" : ""}`}
                onClick={() => agreementFileInputRef.current?.click()}
              >
                <input
                  ref={agreementFileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleSignedAgreementUpload}
                  hidden
                />

                {!signedAgreementFile ? (
                  <div className="dropzone-empty-state">
                    <div className="dropzone-icon-circle">
                      <Upload size={24} />
                    </div>
                    <strong>Upload Digitally Signed Agreement</strong>
                    <span className="dropzone-hint">
                      PDF, DOC or DOCX · Maximum 15MB
                    </span>
                    <button
                      type="button"
                      className="dropzone-browse-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        agreementFileInputRef.current?.click();
                      }}
                    >
                      Browse Document
                    </button>
                  </div>
                ) : (
                  <div
                    className="dropzone-file-selected"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="file-info-left">
                      <div className="file-success-icon">
                        <FileCheck size={26} />
                      </div>
                      <div className="file-details">
                        <span className="file-name">{signedAgreementFile.name}</span>
                        <span className="file-meta">
                          {(signedAgreementFile.size / (1024 * 1024)).toFixed(2)} MB · Digitally Signed Agreement Attached
                        </span>
                      </div>
                    </div>
                    <div className="file-actions-right">
                      <span className="file-status-badge">
                        <CheckCircle2 size={15} /> Ready
                      </span>
                      <button
                        type="button"
                        className="file-remove-btn"
                        onClick={() => setSignedAgreementFile(null)}
                        title="Remove attached file"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Declarations (3 checkboxes) */}
              <div className="agreement-declarations-list">
                <label className="declaration-item">
                  <input
                    type="checkbox"
                    checked={declarations.readAndAgreed}
                    onChange={() => handleDeclarationChange("readAndAgreed")}
                  />
                  <span className="declaration-text">
                    I have read, understood and agree to the <strong>Builder Listing & Commission Agreement</strong>.
                  </span>
                </label>

                <label className="declaration-item">
                  <input
                    type="checkbox"
                    checked={declarations.infoAccurate}
                    onChange={() => handleDeclarationChange("infoAccurate")}
                  />
                  <span className="declaration-text">
                    I confirm that all project information, pricing, descriptions and specifications provided are accurate and complete.
                  </span>
                </label>

                <label className="declaration-item">
                  <input
                    type="checkbox"
                    checked={declarations.authorized}
                    onChange={() => handleDeclarationChange("authorized")}
                  />
                  <span className="declaration-text">
                    I confirm that I am authorized to list this project on Xevoprop and submit it for review.
                  </span>
                </label>
              </div>

              {/* Policy note */}
              <div className="agreement-policy-note">
                <ShieldCheck size={18} className="policy-icon" />
                <span>
                  Xevoprop may review, verify, approve, reject or remove project listings according to its listing policies.
                </span>
              </div>
            </div>
          </section>

          {/* ACTIONS */}
          <div className="add-project-actions">
            <button
              type="button"
              className="project-cancel-btn"
              onClick={() => navigate("/my-projects")}
              disabled={loading}
            >
              Cancel
            </button>

            <div className="submit-btn-wrapper">
              <button
                type="submit"
                className={`project-create-btn ${!isReadyToSubmit ? "disabled-btn" : ""}`}
                disabled={loading || !isReadyToSubmit}
              >
                {loading ? (
                  <>
                    <Loader2 size={17} className="project-loading" />
                    {uploadStatus || "Submitting..."}
                  </>
                ) : (
                  <>
                    <Plus size={17} />
                    Publish Project
                  </>
                )}
              </button>
              {!isReadyToSubmit && (
                <p className="submit-requirement-hint">
                  Add at least one project image/video, upload the signed agreement and complete all declarations to create this project
                </p>
              )}
            </div>
          </div>
        </form>

        {/* In-App Agreement Reader Modal */}
        <AgreementViewerModal
          isOpen={isAgreementModalOpen}
          onClose={() => setIsAgreementModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default AddProject;
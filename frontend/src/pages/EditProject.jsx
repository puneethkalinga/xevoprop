import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Save,
  Loader2,
  ImagePlus,
  Video,
  X,
  Plus,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  REAL_ESTATE_STATES,
  CITIES_BY_STATE,
  USAGE_TYPES,
  PROPERTY_TYPES,
  BUDGET_PRESETS,
} from "../data/locationAndTypes";
import "./EditProject.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://xevoprop.onrender.com/api";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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

  const [currentImage, setCurrentImage] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProject();

    return () => {
      newImages.forEach((img) => {
        if (img.preview) URL.revokeObjectURL(img.preview);
      });
    };
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load project."
        );
      }

      const project = data.project;

      const locationParts = (project.location || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      let location = project.location || "";
      let city = project.city || "";
      let state = project.state || "";

      if (!project.state && !project.city) {
        if (locationParts.length >= 3) {
          location = locationParts[0];
          city = locationParts[1];
          state = locationParts.slice(2).join(", ");
        } else if (locationParts.length === 2) {
          location = locationParts[0];
          city = locationParts[1];
        }
      }

      setFormData({
        name: project.name || "",
        location: location || "All",
        city: city || "Hyderabad",
        state: state || "Telegana",
        type: project.type || "Apartment",
        usage_type: project.usage_type || "Investment",
        units:
          project.units !== null &&
          project.units !== undefined
            ? String(project.units)
            : "",
        price: project.price || "",
        description: project.description || "",
        status: project.status || "Available",
      });

      setCurrentImage(project.image || "");
      if (project.images && Array.isArray(project.images) && project.images.length > 0) {
        setExistingImages(project.images);
      } else if (project.image) {
        setExistingImages([{ id: 0, image_url: project.image }]);
      }
    } catch (err) {
      console.error("LOAD PROJECT ERROR:", err);

      setError(
        err.message || "Unable to load project."
      );
    } finally {
      setLoading(false);
    }
  };

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

    const maxTotal = 30; // Increased to 30 media items (supports multiple photos and multiple videos)
    const currentTotal = existingImages.length + newImages.length;
    const remaining = maxTotal - currentTotal;
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

    const added = filesToAdd.map((file) => {
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

    setNewImages((prev) => [...prev, ...added]);
    e.target.value = "";
  };

  const removeExistingImage = async (imgId) => {
    try {
      const token = localStorage.getItem("token");
      if (imgId > 0) {
        await fetch(`${API_URL}/upload/project/${id}/image/${imgId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setExistingImages((prev) => prev.filter((img) => img.id !== imgId));
    } catch (err) {
      console.error("Delete existing image error:", err);
    }
  };

  const removeNewImage = (imgId) => {
    setNewImages((prev) => {
      const target = prev.find((item) => item.id === imgId);
      if (target && target.preview) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((item) => item.id !== imgId);
    });
  };

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

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const completeLocation = [
        formData.location.trim(),
        formData.city.trim(),
        formData.state.trim(),
      ]
        .filter(Boolean)
        .join(", ");

      /*
       * First update project information.
       */
      const response = await fetch(
        `${API_URL}/projects/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            location: completeLocation,
            city: formData.city.trim() || null,
            type: formData.type,
            units: formData.units
              ? Number(formData.units)
              : null,
            price: formData.price.trim() || null,
            description:
              formData.description.trim() || null,
            status: formData.status,
            image: currentImage || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update project."
        );
      }

      /*
       * Upload new images in loop
       */
      if (newImages.length > 0) {
        for (let i = 0; i < newImages.length; i++) {
          setUploadStatus(`Uploading photo ${i + 1} of ${newImages.length}...`);
          const imgFormData = new FormData();
          imgFormData.append("image", newImages[i].file);

          await fetch(`${API_URL}/upload/project/${id}`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: imgFormData,
          });
        }
      }

      alert("Project updated successfully!");

      navigate("/my-projects");
    } catch (err) {
      console.error(
        "UPDATE PROJECT ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to update project."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="edit-project-page">
        <div className="edit-project-loading">
          <Loader2
            size={28}
            className="edit-project-loading-icon"
          />

          <p>Loading project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-project-page">
      <div className="edit-project-container">

        {/* BACK */}

        <button
          type="button"
          className="edit-project-back"
          onClick={() => navigate("/my-projects")}
        >
          <ArrowLeft size={16} />
          Back to my projects
        </button>

        {/* HEADER */}

        <div className="edit-project-header">
          <div className="edit-project-icon">
            <Building2 size={22} />
          </div>

          <div>
            <span>DEVELOPER SPACE</span>

            <h1>Edit Project</h1>

            <p>
              Update your project information
              on Xevoprop.
            </p>
          </div>
        </div>

        {error && (
          <div className="edit-project-error">
            {error}
          </div>
        )}

        <form
          className="edit-project-form"
          onSubmit={handleSubmit}
        >

          {/* BASIC INFORMATION */}

          <section className="project-form-section">
            <div className="project-form-heading">
              <span>01</span>

              <div>
                <h2>Basic information</h2>

                <p>
                  Update your project information.
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
                  Update state, city, and locality.
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
                  Update pricing, image and
                  project information.
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
                  <label>Project Media (Photos & Videos)</label>
                  <span className="project-images-counter">
                    {existingImages.length + newImages.length} / 30 media items · Photos max 100MB · Videos max 250MB
                  </span>
                </div>

                {existingImages.length === 0 && newImages.length === 0 ? (
                  <button
                    type="button"
                    className="project-image-upload"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="upload-media-icons-row">
                      <ImagePlus size={30} />
                      <Video size={30} />
                    </div>
                    <strong>Upload Project Photos & Videos (Multiple)</strong>
                    <span>JPG, PNG, WEBP, MP4, MOV, WEBM, MKV · Max 100MB per photo · Max 250MB per video</span>
                    <span className="project-upload-hint">
                      Select multiple photos and property walkthrough videos to showcase your property
                    </span>
                    <em>Choose Photos & Videos</em>
                  </button>
                ) : (
                  <div className="project-gallery-wrapper">
                    <div className="project-gallery-grid">
                      {/* Existing uploaded media */}
                      {existingImages.map((img, idx) => {
                        const isVideo = img.type === "video" || String(img.image_url || img).match(/\.(mp4|mov|webm|mkv|avi)$/i);
                        return (
                          <div
                            key={`existing-${img.id || idx}`}
                            className={`project-gallery-card ${idx === 0 && newImages.length === 0 ? "is-cover" : ""} ${isVideo ? "is-video-card" : ""}`}
                          >
                            {isVideo ? (
                              <div className="video-preview-wrapper">
                                <video
                                  src={img.image_url || img}
                                  controls
                                  preload="metadata"
                                  playsInline
                                />
                                <span className="media-type-badge video-badge">
                                  <Video size={11} /> VIDEO
                                </span>
                              </div>
                            ) : (
                              <img
                                src={img.image_url || img}
                                alt={`Project photo ${idx + 1}`}
                              />
                            )}

                            <div className="gallery-card-header">
                              <span className="cover-tag">Existing Media</span>
                              <button
                                type="button"
                                className="remove-photo-btn"
                                onClick={() => removeExistingImage(img.id)}
                                aria-label="Remove media"
                              >
                                <X size={15} />
                              </button>
                            </div>
                          </div>
                        );
                      })}

                      {/* Newly selected media */}
                      {newImages.map((img, idx) => (
                        <div
                          key={img.id}
                          className={`project-gallery-card is-new ${img.type === "video" ? "is-video-card" : ""}`}
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
                                alt={`New photo ${idx + 1}`}
                              />
                              <span className="media-type-badge photo-badge">
                                PHOTO {img.sizeFormatted ? `· ${img.sizeFormatted}` : ""}
                              </span>
                            </>
                          )}

                          <div className="gallery-card-header">
                            <span className="cover-tag new-tag">New Media</span>
                            <button
                              type="button"
                              className="remove-photo-btn"
                              onClick={() => removeNewImage(img.id)}
                              aria-label="Remove media"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {existingImages.length + newImages.length < 30 && (
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
                      <span>Existing media is preserved. New photos and videos will be saved to your project.</span>
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
                  rows="6"
                />
              </div>

            </div>
          </section>

          {/* ACTIONS */}

          <div className="edit-project-actions">

            <button
              type="button"
              className="project-cancel-btn"
              onClick={() =>
                navigate("/my-projects")
              }
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="project-update-btn"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="project-loading"
                  />
                  {uploadStatus || "Saving..."}
                </>
              ) : (
                <>
                  <Save size={17} />
                  Save Changes
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProject;
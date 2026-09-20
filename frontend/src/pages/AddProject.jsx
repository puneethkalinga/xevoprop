import { useRef, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Plus,
  Loader2,
  ImagePlus,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadStatus, setUploadStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    const maxTotal = 15;
    const remaining = maxTotal - selectedImages.length;
    if (remaining <= 0) {
      setError(`You can upload a maximum of ${maxTotal} photos.`);
      e.target.value = "";
      return;
    }

    const filesToAdd = files.slice(0, remaining);

    const invalidType = filesToAdd.find((f) => !f.type.startsWith("image/"));
    if (invalidType) {
      setError("Please select valid image files (JPG, PNG, WEBP).");
      e.target.value = "";
      return;
    }

    const oversized = filesToAdd.find((f) => f.size > 50 * 1024 * 1024);
    if (oversized) {
      setError(`File "${oversized.name}" exceeds the 50MB limit. Max 50MB per photo.`);
      e.target.value = "";
      return;
    }

    setError("");

    const newImages = filesToAdd.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
    }));

    setSelectedImages((prev) => [...prev, ...newImages]);
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
      setLoading(true);
      setUploadStatus("Creating project...");

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

      /* =========================
         CREATE PROJECT
      ========================= */

      const response = await fetch(
        `${API_URL}/projects`,
        {
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
            units: formData.units
              ? Number(formData.units)
              : null,
            price: formData.price.trim() || null,
            description:
              formData.description.trim() || null,
            status: formData.status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create project."
        );
      }

      const projectId = data.project?.id;

      if (!projectId) {
        throw new Error(
          "Project created but project ID was not returned."
        );
      }

      /* =========================
         UPLOAD IMAGES (MULTIPLE)
      ========================= */

      if (selectedImages.length > 0) {
        for (let i = 0; i < selectedImages.length; i++) {
          setUploadStatus(
            `Uploading photo ${i + 1} of ${selectedImages.length}...`
          );

          const imageFormData = new FormData();
          imageFormData.append("image", selectedImages[i].file);

          const uploadResponse = await fetch(
            `${API_URL}/upload/project/${projectId}`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: imageFormData,
            }
          );

          if (!uploadResponse.ok) {
            console.warn(
              `Warning: Upload failed for image ${i + 1}`
            );
          }
        }
      }

      alert("Project created successfully with all photos!");

      navigate("/my-projects");
    } catch (err) {
      console.error(
        "CREATE PROJECT ERROR:",
        err
      );

      setError(
        err.message ||
          "Unable to create project."
      );
    } finally {
      setLoading(false);
      setUploadStatus("");
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

              {/* MULTI-IMAGE GALLERY UPLOAD */}

              <div className="project-form-group full">
                <div className="project-images-header">
                  <label>
                    Project photos
                    <span>*</span>
                  </label>
                  <span className="project-images-counter">
                    {selectedImages.length} / 15 photos selected · Max 50MB each
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
                    <ImagePlus size={32} />

                    <strong>
                      Upload project photos (Multiple)
                    </strong>

                    <span>
                      JPG, PNG or WEBP · Max 50MB per photo
                    </span>

                    <span className="project-upload-hint">
                      Select multiple photos to showcase your property
                    </span>

                    <em>
                      Choose Photos
                    </em>
                  </button>
                ) : (
                  <div className="project-gallery-wrapper">
                    <div className="project-gallery-grid">
                      {selectedImages.map((img, idx) => (
                        <div
                          key={img.id}
                          className={`project-gallery-card ${idx === 0 ? "is-cover" : ""}`}
                        >
                          <img
                            src={img.preview}
                            alt={`Upload ${idx + 1}`}
                          />

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
                              aria-label="Remove photo"
                            >
                              <X size={15} />
                            </button>
                          </div>
                        </div>
                      ))}

                      {selectedImages.length < 15 && (
                        <button
                          type="button"
                          className="project-add-more-card"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Plus size={26} />
                          <strong>Add More Photos</strong>
                          <span>Up to 50MB each</span>
                        </button>
                      )}
                    </div>

                    <div className="project-gallery-footer">
                      <span>The first photo is automatically used as the primary card cover.</span>
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
                  accept="image/png,image/jpeg,image/webp"
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

          {/* ACTIONS */}

          <div className="add-project-actions">

            <button
              type="button"
              className="project-cancel-btn"
              onClick={() =>
                navigate("/my-projects")
              }
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="project-create-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2
                    size={17}
                    className="project-loading"
                  />
                  {uploadStatus || "Creating..."}
                </>
              ) : (
                <>
                  <Plus size={17} />
                  Create Project
                </>
              )}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProject;
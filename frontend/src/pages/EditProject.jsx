import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Save,
  Loader2,
  ImagePlus,
  X,
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
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProject();

    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10MB.");
      return;
    }

    setError("");

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const preview = URL.createObjectURL(file);

    setNewImage(file);
    setImagePreview(preview);
  };

  const removeNewImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setNewImage(null);
    setImagePreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploadProjectImage = async (token) => {
    if (!newImage) return;

    const imageFormData = new FormData();

    imageFormData.append("image", newImage);

    const response = await fetch(
      `${API_URL}/upload/project/${id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageFormData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Failed to upload project image."
      );
    }

    setCurrentImage(data.image || "");
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
       * Upload replacement image only
       * when the developer selected one.
       */
      if (newImage) {
        await uploadProjectImage(token);
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
                <label>Total units</label>

                <input
                  type="number"
                  name="units"
                  min="0"
                  value={formData.units}
                  onChange={handleChange}
                  placeholder="e.g. 120"
                />
              </div>

              <div className="project-form-group">
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

              {/* PROJECT IMAGE */}

              <div className="project-form-group full">
                <label>Project image</label>

                {!imagePreview && currentImage ? (
                  <div className="project-image-preview">
                    <img
                      src={currentImage}
                      alt={formData.name}
                    />

                    <div className="project-image-overlay">
                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                      >
                        <ImagePlus size={16} />
                        Change Image
                      </button>
                    </div>
                  </div>
                ) : imagePreview ? (
                  <div className="project-image-preview">
                    <img
                      src={imagePreview}
                      alt="New project preview"
                    />

                    <div className="project-image-overlay">
                      <button
                        type="button"
                        onClick={() =>
                          fileInputRef.current?.click()
                        }
                      >
                        Change Image
                      </button>

                      <button
                        type="button"
                        onClick={removeNewImage}
                        aria-label="Remove new image"
                      >
                        <X size={17} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="project-image-upload"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    <ImagePlus size={28} />

                    <strong>
                      Upload project image
                    </strong>

                    <span>
                      JPG, PNG or WEBP · Max 10MB
                    </span>

                    <em>
                      Choose Image
                    </em>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
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
                  Saving...
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
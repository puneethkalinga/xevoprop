import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  Building2,
  MapPin,
  Layers,
  IndianRupee,
  Loader2,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { vilvaProjects } from "../data/vilvaProjects";
import { sbInfraVentures } from "../data/sbInfraProjects";
import { getStoredProjectSubmissions } from "../lib/adminStore";
import "./MyProjects.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://xevoprop.onrender.com/api";

function MyProjects() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const isSBInfra =
    user?.id === 46 ||
    String(user?.name || "").toLowerCase().includes("sb infra") ||
    String(user?.email || "").toLowerCase().includes("sbinfra");

  const defaultProjects = isSBInfra ? sbInfraVentures : vilvaProjects;

  const [projects, setProjects] = useState(defaultProjects);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successBanner, setSuccessBanner] = useState(
    location.state?.submittedSuccess ? location.state?.projectName : null
  );

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      // 1. Get stored submissions for this builder
      const allSubmissions = getStoredProjectSubmissions();
      const userSubmissions = allSubmissions.filter((s) => {
        if (user?.id && String(s.builderId) === String(user.id)) return true;
        if (user?.email && s.builderEmail?.toLowerCase() === user.email.toLowerCase()) return true;
        if (isSBInfra && (s.builderName?.toLowerCase().includes("sb infra") || s.builderCompany?.toLowerCase().includes("sb infra"))) return true;
        return false;
      });

      const formattedSubmissions = userSubmissions.map((s) => ({
        id: s.id,
        name: s.name,
        location: s.location || `${s.city}, ${s.state}`,
        city: s.city,
        type: s.type,
        units: s.units,
        price: s.price,
        image: s.images?.[0]?.url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        status:
          s.status === "pending_approval"
            ? "Awaiting Admin Approval"
            : s.status === "approved"
            ? "Verified & Live"
            : "Revision Requested",
        statusCode: s.status,
        isSubmission: true,
        agreementName: s.agreement?.fileName,
        rejectionReason: s.rejectionReason,
      }));

      // 2. Fetch server API projects
      let serverProjects = [];
      try {
        const response = await fetch(`${API_URL}/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          serverProjects = Array.isArray(data) ? data : data.projects || [];
        }
      } catch (apiErr) {
        console.warn("API projects fetch fallback:", apiErr);
      }

      const baseList = serverProjects.length > 0 ? serverProjects : defaultProjects;
      const combined = [...formattedSubmissions, ...baseList];
      const unique = Array.from(new Map(combined.map((m) => [m.id, m])).values());

      setProjects(unique);
    } catch (err) {
      console.warn("PROJECT FETCH ERROR:", err);
      setProjects(defaultProjects);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?"
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/projects/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete project."
        );
      }

      setProjects((previous) =>
        previous.filter(
          (project) => project.id !== id
        )
      );
    } catch (err) {
      console.error("DELETE PROJECT ERROR:", err);
      alert(
        err.message || "Unable to delete project."
      );
    }
  };

  if (loading) {
    return (
      <div className="my-projects-page">
        <div className="my-projects-loading">
          <Loader2 className="projects-spinner" size={30} />
          <p>Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-projects-page">
      <div className="my-projects-container">

        {/* HEADER */}
        <div className="my-projects-header">
          <div>
            <span className="my-projects-label">
              DEVELOPER SPACE
            </span>

            <h1>My Projects</h1>

            <p>
              Manage the property projects you
              have created on Xevoprop.
            </p>
          </div>

          <button
            className="add-project-btn"
            onClick={() => navigate("/add-project")}
          >
            <Plus size={18} />
            Create Project
          </button>
        </div>

        {/* SUBMISSION NOTIFICATION BANNER */}
        {successBanner && (
          <div className="my-projects-submission-banner">
            <CheckCircle2 size={20} className="banner-success-icon" />
            <div className="banner-text">
              <strong>Project Listing & Signed Agreement Submitted!</strong>
              <p>
                "{successBanner}" has been successfully sent to the Master Admin with your digitally signed agreement.
                The admin will review and verify your submission before making the listing public.
              </p>
            </div>
            <button
              className="banner-close-btn"
              onClick={() => setSuccessBanner(null)}
              title="Dismiss"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="my-projects-error">
            {error}
          </div>
        )}

        {/* EMPTY STATE */}
        {!error && projects.length === 0 && (
          <div className="my-projects-empty">
            <div className="empty-project-icon">
              <Building2 size={32} />
            </div>

            <h2>No projects yet</h2>

            <p>
              Create your first property project
              and publish it on Xevoprop.
            </p>

            <button
              className="add-project-btn"
              onClick={() =>
                navigate("/add-project")
              }
            >
              <Plus size={18} />
              Create Your First Project
            </button>
          </div>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <div className="my-projects-grid">
            {projects.map((project) => (
              <article
                className={`my-project-card ${project.statusCode === "pending_approval" ? "card-pending-submission" : ""}`}
                key={project.id}
              >
                {/* IMAGE */}
                <div className="my-project-image">
                  {project.image ? (
                    <img
                      src={project.image}
                      alt={project.name}
                    />
                  ) : (
                    <div className="project-image-placeholder">
                      <Building2 size={42} />
                    </div>
                  )}

                  <span
                    className={`project-status ${
                      project.statusCode === "pending_approval"
                        ? "status-pending-approval"
                        : project.statusCode === "rejected"
                        ? "status-rejected"
                        : project.statusCode === "approved"
                        ? "status-approved"
                        : String(
                            project.status || ""
                          ).toLowerCase().replace(/\s+/g, "-")
                    }`}
                  >
                    {project.statusCode === "pending_approval" ? (
                      <>
                        <Clock size={12} /> Awaiting Admin Approval
                      </>
                    ) : project.statusCode === "rejected" ? (
                      <>
                        <AlertCircle size={12} /> Revision Requested
                      </>
                    ) : project.statusCode === "approved" ? (
                      <>
                        <CheckCircle2 size={12} /> Verified & Live
                      </>
                    ) : (
                      project.status || "Available"
                    )}
                  </span>
                </div>

                {/* CONTENT */}
                <div className="my-project-content">

                  <h2>{project.name}</h2>

                  {project.agreementName && (
                    <div className="my-project-agreement-pill">
                      <FileText size={13} />
                      <span>Signed Agreement: {project.agreementName}</span>
                    </div>
                  )}

                  {project.rejectionReason && (
                    <div className="my-project-rejection-note">
                      <AlertCircle size={13} />
                      <span>Admin note: {project.rejectionReason}</span>
                    </div>
                  )}

                  <div className="project-location">
                    <MapPin size={15} />

                    <span>
                      {project.location ||
                        project.city ||
                        "Location not available"}
                    </span>
                  </div>

                  <div className="project-meta">

                    {project.type && (
                      <div>
                        <Building2 size={14} />
                        <span>
                          {project.type}
                        </span>
                      </div>
                    )}

                    {project.units !== null &&
                      project.units !== undefined && (
                        <div>
                          <Layers size={14} />
                          <span>
                            {project.units} units
                          </span>
                        </div>
                      )}

                  </div>

                  {project.price && (
                    <div className="project-price">
                      <IndianRupee size={16} />
                      <span>
                        {project.price}
                      </span>
                    </div>
                  )}

                  {/* ACTIONS */}
                  <div className="my-project-actions">

                    <button
                      onClick={() =>
                        navigate(
                          `/projects/${project.slug || project.id}`
                        )
                      }
                    >
                      <Eye size={16} />
                      View
                    </button>

                    <button
                      onClick={() =>
                        navigate(
                          `/edit-project/${project.id}`
                        )
                      }
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                    <button
                      className="delete-project-btn"
                      onClick={() =>
                        handleDelete(project.id)
                      }
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default MyProjects;
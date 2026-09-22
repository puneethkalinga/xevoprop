import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Layers,
  Search,
  ArrowRight,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import { vilvaProjects } from "../data/vilvaProjects";
import "./Projects.css";

const API_URL =
  import.meta.env.VITE_API_URL || "https://xevoprop.onrender.com/api";

function Projects() {
  const [projects, setProjects] = useState(vilvaProjects);
  const [filteredProjects, setFilteredProjects] = useState(vilvaProjects);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    filterProjects();
  }, [search, type, projects]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/projects/public`
      );

      if (!response.ok) {
        setProjects(vilvaProjects);
        return;
      }

      const data = await response.json();
      const projectList = Array.isArray(data)
        ? data
        : data.projects || [];

      // Filter out test/dummy records (e.g., 'Vila' with broken URLs)
      const validApiProjects = projectList.filter(
        (p) =>
          p.name &&
          p.name.trim().toLowerCase() !== "vila" &&
          !vilvaProjects.some((vp) => vp.id === p.id || vp.name.toLowerCase() === p.name.toLowerCase())
      );

      setProjects([...vilvaProjects, ...validApiProjects]);
    } catch (err) {
      console.warn("PUBLIC PROJECTS FETCH ERROR:", err.message);
      setProjects(vilvaProjects);
    } finally {
      setLoading(false);
    }
  };

  const filterProjects = () => {
    let result = [...projects];

    if (search.trim()) {
      const keyword = search.toLowerCase();

      result = result.filter((project) =>
        [
          project.name,
          project.title,
          project.subtitle,
          project.location,
          project.city,
          project.state,
          project.type,
          project.category,
          project.description,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(keyword)
          )
      );
    }

    if (type !== "All") {
      const filterKey = type.toLowerCase();
      result = result.filter((project) => {
        const pType = String(project.type || "").toLowerCase();
        const pCat = String(project.category || "").toLowerCase();

        if (filterKey === "apartment") {
          return (
            pType.includes("apartment") ||
            pCat.includes("apartment") ||
            pType.includes("flat") ||
            pType.includes("row house") ||
            pCat.includes("luxury apartments")
          );
        }
        if (filterKey === "villa") {
          return (
            pType.includes("villa") ||
            pCat.includes("villa")
          );
        }
        if (filterKey === "plot") {
          return (
            pType.includes("plot") ||
            pCat.includes("plot") ||
            pType.includes("farm")
          );
        }
        if (filterKey === "commercial") {
          return (
            pType.includes("commercial") ||
            pCat.includes("commercial") ||
            pType.includes("retail") ||
            pType.includes("office")
          );
        }
        return pType.includes(filterKey) || pCat.includes(filterKey);
      });
    }

    setFilteredProjects(result);
  };

  return (
    <div className="projects-page">

      {/* HERO */}
      <section className="projects-hero">
        <div className="projects-hero-content">

          <span className="projects-label">
            XEVOPROP PROJECTS
          </span>

          <h1>
            Discover
            <span> exceptional projects.</span>
          </h1>

          <p>
            Explore residential and commercial
            projects created by verified
            developers on Xevoprop.
          </p>

        </div>
      </section>


      {/* MAIN */}
      <main className="projects-main">

        {/* TOOLBAR */}
        <div className="projects-toolbar">

          <div className="projects-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search projects, locations..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="projects-filter">
            <button
              className={
                type === "All"
                  ? "active"
                  : ""
              }
              onClick={() => setType("All")}
            >
              All
            </button>

            <button
              className={
                type === "Apartment"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setType("Apartment")
              }
            >
              Apartments
            </button>

            <button
              className={
                type === "Villa"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setType("Villa")
              }
            >
              Villas
            </button>

            <button
              className={
                type === "Plot"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setType("Plot")
              }
            >
              Plots
            </button>

            <button
              className={
                type === "Commercial"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setType("Commercial")
              }
            >
              Commercial
            </button>
          </div>

        </div>


        {/* RESULT COUNT */}
        {!loading && !error && (
          <div className="projects-result-count">
            <span>
              {filteredProjects.length}
            </span>{" "}
            project
            {filteredProjects.length !== 1
              ? "s"
              : ""}{" "}
            found
          </div>
        )}


        {/* LOADING */}
        {loading && (
          <div className="projects-loading">
            <Loader2
              size={32}
              className="projects-spinner"
            />

            <p>
              Discovering projects...
            </p>
          </div>
        )}


        {/* ERROR */}
        {!loading && error && (
          <div className="projects-error">
            <Building2 size={30} />

            <h2>
              Unable to load projects
            </h2>

            <p>{error}</p>

            <button
              onClick={fetchProjects}
            >
              Try Again
            </button>
          </div>
        )}


        {/* EMPTY */}
        {!loading &&
          !error &&
          filteredProjects.length === 0 && (
            <div className="projects-empty">
              <Building2 size={38} />

              <h2>
                No projects found
              </h2>

              <p>
                Try another search or
                property type.
              </p>
            </div>
          )}


        {/* PROJECT GRID */}
        {!loading &&
          !error &&
          filteredProjects.length > 0 && (
            <div className="projects-grid">

              {filteredProjects.map(
                (project) => {
                  const statusClass = String(project.status || "ongoing").toLowerCase();
                  const targetLink = `/projects/${project.slug || project.id}`;

                  return (
                    <article
                      className="project-card"
                      key={project.id}
                    >
                      {/* IMAGE */}
                      <div className="project-card-image">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.name}
                            loading="lazy"
                          />
                        ) : (
                          <div className="project-placeholder">
                            <Building2 size={45} />
                          </div>
                        )}

                        {project.category && (
                          <span className="project-card-cat-badge">
                            {project.category}
                          </span>
                        )}

                        <span className={`project-card-status status-${statusClass}`}>
                          {project.status || "Available"}
                        </span>
                      </div>

                      {/* CONTENT */}
                      <div className="project-card-content">
                        <div className="project-card-developer">
                          <Building2 size={13} />
                          <span>{project.developer?.name || "Vilva Builders"}</span>
                          <span className="verified-dot" title="Verified Developer">✓</span>
                        </div>

                        <h2>{project.name}</h2>

                        <div className="project-card-location">
                          <MapPin size={15} />
                          <span>
                            {project.location ||
                              project.city ||
                              "Hyderabad"}
                          </span>
                        </div>

                        <div className="project-card-info">
                          {project.type && (
                            <div>
                              <Building2 size={15} />
                              <span>{project.type}</span>
                            </div>
                          )}

                          {project.units !== null &&
                            project.units !== undefined && (
                              <div>
                                <Layers size={15} />
                                <span>{project.units} units</span>
                              </div>
                            )}
                        </div>

                        {project.area && (
                          <div className="project-card-area">
                            📐 {project.area}
                          </div>
                        )}

                        <div className="project-card-price">
                          {project.price || "Price on Request"}
                        </div>

                        {project.subtitle ? (
                          <p className="project-card-description">
                            {project.subtitle}
                          </p>
                        ) : project.description ? (
                          <p className="project-card-description">
                            {project.description.slice(0, 110)}...
                          </p>
                        ) : null}

                        <Link
                          to={targetLink}
                          className="project-view-btn"
                        >
                          View Project
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    </article>
                  );
                }
              )}

            </div>
          )}

      </main>
    </div>
  );
}

export default Projects;
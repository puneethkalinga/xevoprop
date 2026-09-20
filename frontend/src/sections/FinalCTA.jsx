import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./FinalCTA.css";

function FinalCTA() {
  const navigate = useNavigate();

  return (
    <section className="final-cta-section">
      <div className="final-cta-container">
        <motion.div
          className="final-cta-content"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="final-cta-label">
            <Building2 size={14} />
            <span>START YOUR PROPERTY JOURNEY</span>
          </div>

          <h2>
            Find the Property That Fits Your Future
          </h2>

          <p>
            Explore verified residential and commercial developments, connect directly
            with trusted developers, and proceed with complete confidence.
          </p>

          <div className="final-cta-actions">
            <button
              type="button"
              className="final-cta-primary"
              onClick={() => navigate("/properties")}
            >
              <Search size={16} />
              <span>Explore Properties</span>
              <ArrowUpRight size={16} />
            </button>

            <button
              type="button"
              className="final-cta-secondary"
              onClick={() => navigate("/projects")}
            >
              <span>Explore Projects</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCTA;
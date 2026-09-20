import { motion } from "framer-motion";
import {
  ShieldCheck,
  MessageCircle,
  Compass,
  GitCompare,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./WhyXevoprop.css";

const benefits = [
  {
    icon: ShieldCheck,
    number: "01",
    title: "Verified Properties",
    description:
      "Discover property listings with greater confidence through verified information and transparent details.",
  },
  {
    icon: MessageCircle,
    number: "02",
    title: "Direct Connections",
    description:
      "Connect with sellers, developers and property stakeholders without unnecessary layers in between.",
  },
  {
    icon: Compass,
    number: "03",
    title: "Intelligent Discovery",
    description:
      "Find relevant properties faster with smarter discovery based on your preferences and requirements.",
  },
  {
    icon: GitCompare,
    number: "04",
    title: "Confident Decisions",
    description:
      "Understand, compare and evaluate properties before taking the next step.",
  },
];

function WhyXevoprop() {
  const navigate = useNavigate();

  return (
    <section className="why-section" id="about">
      <div className="why-container">
        {/* HEADER */}
        <motion.div
          className="why-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="why-header-left">
            <span className="why-label">
              WHY XEVOPROP
            </span>

            <h2>
              Built on Transparency <span>and Trust.</span>
            </h2>
          </div>

          <p className="why-header-desc">
            Xevoprop brings verified listings, transparent pricing, and direct
            builder channels together in one cohesive institutional platform.
          </p>
        </motion.div>

        {/* BENEFITS GRID */}
        <div className="why-grid">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <motion.div
                className="why-card"
                key={benefit.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="why-card-top">
                  <span className="why-card-num">{benefit.number}</span>
                  <div className="why-card-icon">
                    <Icon size={20} />
                  </div>
                </div>

                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA BANNER */}
        <motion.div
          className="why-cta-banner"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="why-cta-text">
            <span className="why-cta-tag">READY TO EXPLORE?</span>
            <strong>Find a property that aligns with your lifestyle and budget.</strong>
          </div>

          <button
            type="button"
            className="why-cta-btn"
            onClick={() => navigate("/properties")}
          >
            <span>Explore Properties</span>
            <ArrowUpRight size={16} />
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default WhyXevoprop;
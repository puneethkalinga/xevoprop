import { motion } from "framer-motion";
import {
  Search,
  MessageCircle,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./HowItWorks.css";

const steps = [
  {
    number: "01",
    label: "DISCOVER",
    title: "Find the right property.",
    description:
      "Explore RERA-verified residential and commercial listings using transparent filters, real prices, and authentic photos.",
    icon: Search,
    action: "/properties",
  },
  {
    number: "02",
    label: "CONNECT",
    title: "Engage with authorized developers.",
    description:
      "Connect directly with verified builders and owners to receive official brochures, floor plans, and schedules.",
    icon: MessageCircle,
    action: "/properties",
  },
  {
    number: "03",
    label: "COMPLETE",
    title: "Book visits and close with confidence.",
    description:
      "Schedule private site visits, review verified documentation, and complete your transaction with zero brokerage markup.",
    icon: ShieldCheck,
    action: "/properties",
  },
];

function HowItWorks() {
  const navigate = useNavigate();

  return (
    <section className="how-section" id="how-it-works">
      <div className="how-container">
        {/* HEADER */}
        <motion.div
          className="how-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="how-label">
            HOW XEVOPROP WORKS
          </span>

          <h2>
            A Streamlined <span>Real Estate Journey.</span>
          </h2>

          <p>
            From your initial search to the final handover, Xevoprop keeps every step
            of your real estate process transparent, direct, and structured.
          </p>
        </motion.div>

        {/* STEPS GRID */}
        <div className="how-steps">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                className="how-step-card"
                key={step.number}
                onClick={() => navigate(step.action)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                {/* STEP TOP */}
                <div className="how-step-top">
                  <span className="how-step-number">{step.number}</span>
                  <span className="how-step-label">{step.label}</span>
                  <div className="how-step-icon">
                    <Icon size={18} />
                  </div>
                </div>

                {/* STEP CONTENT */}
                <div className="how-step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                  <span className="how-step-link">
                    <span>Explore listings</span>
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* BOTTOM STATEMENT */}
        <motion.div
          className="how-bottom-banner"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="how-bottom-tag">THE XEVOPROP PROMISE</span>
          <strong>Less searching. More certainty. Direct access to premier real estate.</strong>
        </motion.div>
      </div>
    </section>
  );
}

export default HowItWorks;
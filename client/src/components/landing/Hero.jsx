import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  Sparkles,
} from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      id="home"
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#d8e0d4",
        paddingTop: "80px",
        paddingBottom: "40px",
      }}
    >
      <div
        className="hero-bg-split"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          width: "40%",
          backgroundColor: "#0d3d35",
          zIndex: 1,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem 1.5rem",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "2.5rem",
          alignItems: "center",
        }}
        className="hero-grid"
      >
        <div style={{ position: "relative", zIndex: 20 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="hero-badge-mobile"
          >
            <Sparkles size={11} />
            <span>AI POWERED FITNESS</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display hero-title"
            style={{
              color: "#0d3d35",
              marginBottom: "0.25rem",
              letterSpacing: "-0.03em",
            }}
          >
            STILL
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="font-display hero-title"
            style={{
              color: "#0d3d35",
              letterSpacing: "-0.03em",
            }}
          >
            TRAINING
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
            className="hero-description"
            style={{
              fontFamily: "Inter, sans-serif",
              lineHeight: "1.7",
              color: "#2a2a2a",
              fontWeight: 600,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginTop: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            I WAKE UP AND TRAIN BEFORE SUNRISE. DISCIPLINE BEATS MOTIVATION.
            YOUR FUTURE BODY IS BUILT BY TODAY'S CHOICES.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.85, duration: 0.5 }}
            onClick={() => navigate("/signup")}
            className="btn-primary hero-cta"
            style={{ padding: "1rem 2.25rem", fontSize: "12px" }}
          >
            Start Training Free
            <ArrowRight size={14} />
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="hero-script-wrapper"
            style={{
              marginTop: "1.75rem",
              position: "relative",
              maxWidth: "280px",
            }}
          >
            <span
              className="script hero-script"
              style={{
                color: "#0d3d35",
                lineHeight: 1.2,
                display: "block",
              }}
            >
              wake up and feel the strength
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="hero-mobile-visual"
        >
          <div className="hero-feature-card">
            <div className="hero-feature-header">
              <Sparkles size={12} style={{ color: "#c4a87a" }} />
              <span className="font-mono hero-feature-tag">WHAT YOU GET</span>
            </div>

            <h3 className="font-display hero-feature-title">
              Everything
              <br />
              you need.
            </h3>

            <div className="hero-feature-list">
              {[
                {
                  icon: Brain,
                  title: "AI Coach",
                  desc: "Adapts to your body",
                },
                {
                  icon: Dumbbell,
                  title: "Custom Workouts",
                  desc: "Gym or home",
                },
                {
                  icon: UtensilsCrossed,
                  title: "Smart Nutrition",
                  desc: "Veg, Non-veg, Vegan",
                },
                {
                  icon: TrendingUp,
                  title: "Real Progress",
                  desc: "Track every metric",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + i * 0.1, duration: 0.5 }}
                  className="hero-feature-row"
                >
                  <div className="hero-feature-icon">
                    <item.icon size={14} strokeWidth={2} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="hero-feature-row-title">{item.title}</div>
                    <div className="hero-feature-row-desc">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="hero-feature-cta">
              <div className="hero-feature-cta-text">
                <div className="font-mono hero-feature-cta-label">
                  FREE TO START
                </div>
                <div className="hero-feature-cta-title">
                  No credit card required
                </div>
              </div>
              <ArrowRight
                size={16}
                style={{ color: "#c4a87a", flexShrink: 0 }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .hero-title {
          font-size: clamp(3rem, 14vw, 9rem);
          line-height: 0.88;
        }

        .hero-description {
          font-size: 11px;
          max-width: 440px;
        }

        .hero-script {
          font-size: 1.5rem;
        }

        .hero-badge-mobile {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #0d3d35;
          color: #c4a87a;
          border-radius: 9999px;
          margin-bottom: 1.25rem;
          font-family: 'Space Grotesk', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.25em;
        }

        .hero-cta {
          width: 100%;
          justify-content: center;
        }

        .hero-mobile-visual {
          display: block;
          position: relative;
          z-index: 15;
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
        }

        .hero-feature-card {
          background: #0d3d35;
          color: #f5f3ee;
          padding: 1.5rem;
          border-radius: 18px;
          box-shadow: 0 25px 50px rgba(13, 61, 53, 0.2);
          position: relative;
          overflow: hidden;
        }

        .hero-feature-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -20%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(196, 168, 122, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        .hero-feature-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 0.875rem;
          position: relative;
          z-index: 1;
        }

        .hero-feature-tag {
          font-size: 9px;
          color: #c4a87a;
          letter-spacing: 0.25em;
          font-weight: 700;
          text-transform: uppercase;
        }

        .hero-feature-title {
          font-size: 1.875rem;
          color: #f5f3ee;
          line-height: 0.95;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
          position: relative;
          z-index: 1;
        }

        .hero-feature-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 1.25rem;
          padding-bottom: 1.25rem;
          border-bottom: 1px solid rgba(245, 243, 238, 0.08);
          position: relative;
          z-index: 1;
        }

        .hero-feature-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .hero-feature-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          background: rgba(196, 168, 122, 0.12);
          color: #c4a87a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(196, 168, 122, 0.2);
        }

        .hero-feature-row-title {
          font-size: 13px;
          font-family: Inter;
          font-weight: 700;
          color: #f5f3ee;
          line-height: 1.2;
        }

        .hero-feature-row-desc {
          font-size: 10px;
          font-family: Inter;
          color: rgba(245, 243, 238, 0.5);
          margin-top: 2px;
          letter-spacing: 0.02em;
        }

        .hero-feature-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          background: rgba(196, 168, 122, 0.08);
          border: 1px solid rgba(196, 168, 122, 0.2);
          border-radius: 12px;
          position: relative;
          z-index: 1;
        }

        .hero-feature-cta-text {
          flex: 1;
          min-width: 0;
        }

        .hero-feature-cta-label {
          font-size: 9px;
          color: #c4a87a;
          letter-spacing: 0.25em;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 3px;
        }

        .hero-feature-cta-title {
          font-size: 12px;
          font-family: Inter;
          font-weight: 600;
          color: #f5f3ee;
        }

        @media (min-width: 480px) {
          .hero-description {
            font-size: 12px;
          }
          .hero-script {
            font-size: 1.75rem;
          }
          .hero-cta {
            width: auto;
          }
          .hero-feature-card {
            padding: 1.75rem;
          }
          .hero-feature-title {
            font-size: 2rem;
          }
          .hero-feature-row-title {
            font-size: 14px;
          }
          .hero-feature-row-desc {
            font-size: 11px;
          }
          .hero-feature-cta-title {
            font-size: 13px;
          }
        }

        @media (min-width: 768px) {
          .hero-grid {
            grid-template-columns: 1.3fr 1fr;
            padding: 3rem 2rem;
            gap: 3rem;
          }

          .hero-description {
            font-size: 13px;
          }

          .hero-script {
            font-size: 2rem;
          }

          .hero-mobile-visual {
            max-width: 400px;
          }

          .hero-feature-title {
            font-size: 2.25rem;
          }
        }

        @media (min-width: 1024px) {
          .hero-grid {
            padding: 4rem 3rem;
          }

          .hero-feature-card {
            padding: 2rem;
          }

          .hero-feature-title {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 767px) {
          .hero-bg-split {
            display: none;
          }

          .hero-script-wrapper {
            margin-top: 1.25rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;

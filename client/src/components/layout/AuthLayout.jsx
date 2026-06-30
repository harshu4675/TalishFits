import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-left-panel">
        <div className="auth-pattern" />

        <div className="auth-left-content">
          <Link to="/" className="auth-logo">
            <span className="font-display auth-logo-name">TALISHFITS</span>
            <span className="font-mono auth-logo-tag">AI FITNESS COACH</span>
          </Link>

          <div className="auth-left-middle">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "1.5px",
                    background: "#c4a87a",
                  }}
                />
                <span className="font-mono auth-left-tag">Train Smarter</span>
              </div>

              <h2 className="font-display auth-headline">
                Your body
                <br />
                deserves
                <br />
                intelligence.
              </h2>

              <p className="auth-left-desc">
                AI-powered workout plans, personalized nutrition, and progress
                tracking that adapts to your body in real-time.
              </p>

              <div className="auth-features">
                {[
                  "AI Coaching",
                  "Custom Workouts",
                  "Smart Nutrition",
                  "Progress Tracking",
                ].map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="auth-feature-pill"
                  >
                    {feature}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <div
              style={{
                height: "1px",
                background: "rgba(245, 243, 238, 0.08)",
                marginBottom: "1.25rem",
              }}
            />
            <blockquote className="script auth-quote">
              "Discipline is choosing between what you want now and what you
              want most."
            </blockquote>
            <p className="font-mono auth-quote-author">— Abraham Lincoln</p>
          </motion.div>
        </div>
      </div>

      <div className="auth-right-panel">
        <div className="auth-mobile-header">
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span
              className="font-display"
              style={{
                fontSize: "1.125rem",
                color: "#0d3d35",
                letterSpacing: "0.05em",
                lineHeight: 1,
              }}
            >
              TALISHFITS
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: "7px",
                color: "#6b7068",
                letterSpacing: "0.3em",
                marginTop: "2px",
                fontWeight: 600,
              }}
            >
              AI FITNESS COACH
            </span>
          </Link>
          <Link to="/" className="auth-back-link">
            <ArrowLeft size={13} />
            Back
          </Link>
        </div>

        <div className="auth-form-wrapper">
          <div className="auth-form-content">{children}</div>
        </div>
      </div>

      <style>{`
        .auth-layout {
          min-height: 100vh;
          display: flex;
          background: #e8ebe5;
        }
        .auth-left-panel {
          display: none;
          width: 45%;
          position: relative;
          overflow: hidden;
          background: #0d3d35;
        }
        .auth-pattern {
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(245,243,238,0.04) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .auth-left-content {
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 3rem;
          width: 100%;
        }
        .auth-logo {
          text-decoration: none;
          display: inline-flex;
          flex-direction: column;
        }
        .auth-logo-name {
          font-size: 1.5rem;
          color: #f5f3ee;
          letter-spacing: 0.05em;
          line-height: 1;
        }
        .auth-logo-tag {
          font-size: 8px;
          color: rgba(245, 243, 238, 0.5);
          letter-spacing: 0.3em;
          margin-top: 4px;
          font-weight: 600;
        }
        .auth-left-middle {
          max-width: 440px;
        }
        .auth-left-tag {
          font-size: 11px;
          color: #c4a87a;
          letter-spacing: 0.3em;
          font-weight: 700;
          text-transform: uppercase;
        }
        .auth-headline {
          font-size: clamp(2.25rem, 4vw, 3.5rem);
          color: #f5f3ee;
          line-height: 0.95;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }
        .auth-left-desc {
          color: rgba(245, 243, 238, 0.55);
          font-family: Inter;
          font-size: 14px;
          line-height: 1.7;
          margin-bottom: 2.5rem;
        }
        .auth-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .auth-feature-pill {
          padding: 8px 14px;
          background: rgba(245, 243, 238, 0.06);
          border: 1px solid rgba(245, 243, 238, 0.12);
          border-radius: 9999px;
          font-size: 11px;
          font-family: Inter;
          color: rgba(245, 243, 238, 0.7);
          font-weight: 500;
        }
        .auth-quote {
          font-size: 1.375rem;
          color: rgba(245, 243, 238, 0.7);
          line-height: 1.4;
          margin-bottom: 8px;
        }
        .auth-quote-author {
          font-size: 9px;
          color: rgba(245, 243, 238, 0.3);
          letter-spacing: 0.25em;
          font-weight: 600;
          text-transform: uppercase;
        }
        .auth-right-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        .auth-mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid rgba(13, 61, 53, 0.08);
        }
        .auth-back-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #6b7068;
          font-size: 11px;
          font-family: Inter;
          text-decoration: none;
          font-weight: 500;
        }
        .auth-form-wrapper {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }
        .auth-form-content {
          width: 100%;
          max-width: 420px;
        }
        @media (min-width: 480px) {
          .auth-form-wrapper {
            padding: 2.5rem 1.5rem;
          }
        }
        @media (min-width: 1024px) {
          .auth-left-panel {
            display: flex;
          }
          .auth-mobile-header {
            display: none;
          }
          .auth-form-wrapper {
            padding: 3rem 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AuthLayout;

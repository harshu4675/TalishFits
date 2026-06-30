import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";

const Transformation = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(4rem, 8vw, 8rem) 0",
        backgroundColor: "#e8ebe5",
      }}
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "1.5rem",
            padding: "clamp(3rem, 6vw, 6rem)",
            background: "#0d3d35",
            textAlign: "center",
          }}
        >
          <span
            className="script"
            style={{
              position: "absolute",
              top: "2rem",
              right: "2rem",
              fontSize: "2rem",
              color: "rgba(196, 168, 122, 0.4)",
              transform: "rotate(-8deg)",
            }}
          >
            transform
          </span>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{ width: "40px", height: "1.5px", background: "#c4a87a" }}
            />
            <span
              className="font-mono"
              style={{
                fontSize: "11px",
                color: "#c4a87a",
                letterSpacing: "0.3em",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Start Today
            </span>
            <div
              style={{ width: "40px", height: "1.5px", background: "#c4a87a" }}
            />
          </div>

          <h2
            className="text-display"
            style={{ color: "#f5f3ee", marginBottom: "1.5rem" }}
          >
            Build the body you deserve.
          </h2>

          <p
            style={{
              color: "rgba(245, 243, 238, 0.7)",
              fontFamily: "Inter",
              fontSize: "15px",
              lineHeight: 1.7,
              maxWidth: "560px",
              margin: "0 auto 3rem auto",
            }}
          >
            Your AI coach is waiting. No credit card required to start your
            transformation journey today.
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <button
              onClick={() => navigate("/signup")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "1rem 2.5rem",
                background: "#c4a87a",
                color: "#0d3d35",
                border: "none",
                borderRadius: "9999px",
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 30px rgba(196, 168, 122, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Start Free Today <ArrowRight size={14} />
            </button>
            <button
              onClick={() => navigate("/login")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                padding: "1rem 2rem",
                background: "transparent",
                color: "#f5f3ee",
                border: "2px solid #f5f3ee",
                borderRadius: "9999px",
                fontFamily: "Inter",
                fontWeight: 700,
                fontSize: "12px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#f5f3ee";
                e.currentTarget.style.color = "#0d3d35";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#f5f3ee";
              }}
            >
              I Have an Account
            </button>
          </div>

          <p
            className="font-mono"
            style={{
              color: "rgba(245, 243, 238, 0.3)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              marginTop: "2rem",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Free forever · No credit card · Cancel anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Transformation;

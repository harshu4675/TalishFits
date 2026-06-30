import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EXPERIENCE_LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
    description: "0-1 year of training experience",
    num: "01",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "1-3 years of consistent training",
    num: "02",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "3+ years of serious training",
    num: "03",
  },
];

const StepExperience = ({ data, updateData, onNext }) => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "3.5rem",
          maxWidth: "600px",
          margin: "0 auto 3.5rem auto",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{ width: "32px", height: "1.5px", background: "#c4a87a" }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: "10px",
              color: "#c4a87a",
              letterSpacing: "0.3em",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            Step 05
          </span>
          <div
            style={{ width: "32px", height: "1.5px", background: "#c4a87a" }}
          />
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "#0d3d35",
            marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          Training experience.
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7068",
            fontFamily: "Inter",
            lineHeight: 1.7,
          }}
        >
          Ensures your workout plan matches your current fitness level
          perfectly.
        </p>
      </div>

      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto 3rem auto",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {EXPERIENCE_LEVELS.map((level) => {
          const isSelected = data.workoutExperience === level.value;

          return (
            <motion.button
              key={level.value}
              onClick={() => updateData({ workoutExperience: level.value })}
              whileHover={{ x: 6 }}
              whileTap={{ scale: 0.99 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                padding: "1.5rem",
                background: isSelected ? "#0d3d35" : "#ffffff",
                color: isSelected ? "#f5f3ee" : "#1a1a1a",
                border: "1.5px solid",
                borderColor: isSelected ? "#0d3d35" : "rgba(13, 61, 53, 0.1)",
                borderRadius: "12px",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.3s",
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: "12px",
                  color: isSelected ? "#c4a87a" : "#9ca09a",
                  letterSpacing: "0.25em",
                  fontWeight: 700,
                  minWidth: "24px",
                }}
              >
                {level.num}
              </span>

              <div style={{ flex: 1 }}>
                <h3
                  className="font-display"
                  style={{
                    fontSize: "1.5rem",
                    color: isSelected ? "#f5f3ee" : "#0d3d35",
                    marginBottom: "4px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {level.label}
                </h3>
                <p
                  style={{
                    fontSize: "12px",
                    color: isSelected ? "rgba(245, 243, 238, 0.6)" : "#6b7068",
                    fontFamily: "Inter",
                  }}
                >
                  {level.description}
                </p>
              </div>

              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: "2px solid",
                  borderColor: isSelected ? "#c4a87a" : "rgba(13, 61, 53, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {isSelected && (
                  <div
                    style={{
                      width: "10px",
                      height: "10px",
                      borderRadius: "50%",
                      background: "#c4a87a",
                    }}
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <div style={{ textAlign: "center" }}>
        <motion.button
          onClick={onNext}
          disabled={!data.workoutExperience}
          whileHover={data.workoutExperience ? { y: -2 } : {}}
          whileTap={data.workoutExperience ? { scale: 0.97 } : {}}
          className="btn-primary"
          style={{ padding: "1rem 2.5rem", fontSize: "12px" }}
        >
          Continue
          <ArrowRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default StepExperience;

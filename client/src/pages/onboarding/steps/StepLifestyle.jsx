import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

const ACTIVITY_LEVELS = [
  {
    value: "sedentary",
    label: "Sedentary",
    description: "Little to no exercise",
    multiplier: "1.2",
  },
  {
    value: "lightly_active",
    label: "Lightly Active",
    description: "Exercise 1-3 days/week",
    multiplier: "1.375",
  },
  {
    value: "moderately_active",
    label: "Moderately Active",
    description: "Exercise 3-5 days/week",
    multiplier: "1.55",
  },
  {
    value: "very_active",
    label: "Very Active",
    description: "Hard exercise 6-7 days/week",
    multiplier: "1.725",
  },
  {
    value: "extremely_active",
    label: "Extremely Active",
    description: "Very hard exercise & physical job",
    multiplier: "1.9",
  },
];

const LIFESTYLE_OPTIONS = [
  { value: "office_job", label: "Office Job" },
  { value: "student", label: "Student" },
  { value: "gym", label: "Gym Enthusiast" },
  { value: "sports", label: "Sports Player" },
  { value: "mixed", label: "Mixed Lifestyle" },
];

const StepLifestyle = ({ data, updateData, onNext }) => {
  const canContinue = data.activityLevel && data.lifestyle;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          maxWidth: "600px",
          margin: "0 auto 3rem auto",
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
            Step 03
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
          Your daily lifestyle.
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7068",
            fontFamily: "Inter",
            lineHeight: 1.7,
          }}
        >
          Helps calculate your Total Daily Energy Expenditure (TDEE).
        </p>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem" }}>
          <h3
            className="font-mono"
            style={{
              fontSize: "11px",
              color: "#0d3d35",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Activity Level
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {ACTIVITY_LEVELS.map((level) => {
              const isSelected = data.activityLevel === level.value;
              return (
                <motion.button
                  key={level.value}
                  onClick={() => updateData({ activityLevel: level.value })}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "1rem 1.25rem",
                    background: isSelected ? "#0d3d35" : "#ffffff",
                    color: isSelected ? "#f5f3ee" : "#1a1a1a",
                    border: "1.5px solid",
                    borderColor: isSelected
                      ? "#0d3d35"
                      : "rgba(13, 61, 53, 0.1)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.3s",
                  }}
                >
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      borderRadius: "50%",
                      border: "2px solid",
                      borderColor: isSelected
                        ? "#c4a87a"
                        : "rgba(13, 61, 53, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isSelected && (
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "#c4a87a",
                        }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: "14px",
                        fontFamily: "Inter",
                        fontWeight: 700,
                        color: isSelected ? "#f5f3ee" : "#0d3d35",
                      }}
                    >
                      {level.label}
                    </p>
                    <p
                      style={{
                        fontSize: "11px",
                        color: isSelected
                          ? "rgba(245, 243, 238, 0.6)"
                          : "#6b7068",
                        fontFamily: "Inter",
                        marginTop: "2px",
                      }}
                    >
                      {level.description}
                    </p>
                  </div>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "11px",
                      color: isSelected ? "#c4a87a" : "#9ca09a",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                    }}
                  >
                    ×{level.multiplier}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: "3rem" }}>
          <h3
            className="font-mono"
            style={{
              fontSize: "11px",
              color: "#0d3d35",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Current Lifestyle
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "8px",
            }}
          >
            {LIFESTYLE_OPTIONS.map((option) => {
              const isSelected = data.lifestyle === option.value;
              return (
                <motion.button
                  key={option.value}
                  onClick={() => updateData({ lifestyle: option.value })}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "1.25rem 0.875rem",
                    background: isSelected ? "#0d3d35" : "#ffffff",
                    color: isSelected ? "#f5f3ee" : "#0d3d35",
                    border: "1.5px solid",
                    borderColor: isSelected
                      ? "#0d3d35"
                      : "rgba(13, 61, 53, 0.1)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: "13px",
                  }}
                >
                  {option.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <motion.button
            onClick={onNext}
            disabled={!canContinue}
            whileHover={canContinue ? { y: -2 } : {}}
            whileTap={canContinue ? { scale: 0.97 } : {}}
            className="btn-primary"
            style={{ padding: "1rem 2.5rem", fontSize: "12px" }}
          >
            Continue
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default StepLifestyle;

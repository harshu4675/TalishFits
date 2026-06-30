import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

const genderOptions = [
  {
    value: "male",
    label: "Male",
    desc: "Programs optimized for male physiology",
    num: "01",
  },
  {
    value: "female",
    label: "Female",
    desc: "Programs tailored for female bodies",
    num: "02",
  },
  {
    value: "other",
    label: "Other",
    desc: "Personalized without gender-specific bias",
    num: "03",
  },
];

const StepGender = ({ data, updateData, onNext }) => {
  const handleSelect = (value) => updateData({ gender: value });

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
            Step 01
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
          What's your gender?
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7068",
            fontFamily: "Inter",
            lineHeight: 1.7,
          }}
        >
          This helps us calibrate your BMR, body fat calculations, and exercise
          recommendations accurately.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          maxWidth: "800px",
          margin: "0 auto 3rem auto",
        }}
      >
        {genderOptions.map((option) => {
          const isSelected = data.gender === option.value;
          return (
            <motion.button
              key={option.value}
              onClick={() => handleSelect(option.value)}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              style={{
                position: "relative",
                padding: "2rem",
                background: isSelected ? "#0d3d35" : "#ffffff",
                color: isSelected ? "#f5f3ee" : "#1a1a1a",
                border: "1.5px solid",
                borderColor: isSelected ? "#0d3d35" : "rgba(13, 61, 53, 0.1)",
                borderRadius: "1rem",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.3s",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "#0d3d35";
                  e.currentTarget.style.boxShadow =
                    "0 12px 30px rgba(13, 61, 53, 0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = "rgba(13, 61, 53, 0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    right: "12px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "#c4a87a",
                    color: "#0d3d35",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Check size={13} strokeWidth={3} />
                </div>
              )}

              <span
                className="font-mono"
                style={{
                  fontSize: "10px",
                  color: isSelected ? "#c4a87a" : "#9ca09a",
                  letterSpacing: "0.25em",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "1.5rem",
                }}
              >
                {option.num}
              </span>

              <h3
                className="font-display"
                style={{
                  fontSize: "2rem",
                  color: isSelected ? "#f5f3ee" : "#0d3d35",
                  marginBottom: "0.5rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {option.label}
              </h3>

              <p
                style={{
                  fontSize: "12px",
                  color: isSelected ? "rgba(245, 243, 238, 0.6)" : "#6b7068",
                  fontFamily: "Inter",
                  lineHeight: 1.6,
                }}
              >
                {option.desc}
              </p>
            </motion.button>
          );
        })}
      </div>

      <div style={{ textAlign: "center" }}>
        <motion.button
          onClick={onNext}
          disabled={!data.gender}
          whileHover={data.gender ? { y: -2 } : {}}
          whileTap={data.gender ? { scale: 0.97 } : {}}
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

export default StepGender;

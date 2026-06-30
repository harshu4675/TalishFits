import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, X, Check } from "lucide-react";
import { SpinLoader } from "../../../components/ui/Loader";

const MEDICAL_CONDITIONS = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Asthma",
  "Arthritis",
  "Back Pain",
  "Knee Problems",
  "None",
];

const StepMedical = ({ data, updateData, onNext, isSubmitting }) => {
  const toggleCondition = (condition) => {
    const current = data.medicalConditions || [];

    if (condition === "None") {
      updateData({ medicalConditions: ["None"] });
      return;
    }

    let updated = current.filter((c) => c !== "None");

    if (updated.includes(condition)) {
      updated = updated.filter((c) => c !== condition);
    } else {
      updated = [...updated, condition];
    }

    updateData({ medicalConditions: updated });
  };

  const isNone = data.medicalConditions?.includes("None");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "2.5rem",
          maxWidth: "600px",
          margin: "0 auto 2.5rem auto",
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
            Step 06
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
          Medical conditions.
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7068",
            fontFamily: "Inter",
            lineHeight: 1.7,
          }}
        >
          Helps us create a safe program. Your health data is encrypted and
          private.
        </p>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            padding: "1rem 1.25rem",
            background: "rgba(74, 124, 89, 0.06)",
            border: "1px solid rgba(74, 124, 89, 0.15)",
            borderRadius: "10px",
            marginBottom: "2rem",
          }}
        >
          <ShieldCheck
            size={18}
            style={{ color: "#4a7c59", marginTop: "2px", flexShrink: 0 }}
          />
          <div>
            <p
              style={{
                fontSize: "12px",
                fontFamily: "Inter",
                fontWeight: 700,
                color: "#4a7c59",
                marginBottom: "4px",
              }}
            >
              Your privacy is protected
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "#6b7068",
                fontFamily: "Inter",
                lineHeight: 1.6,
              }}
            >
              Medical information is AES-256 encrypted and never shared. Used
              only to ensure exercise safety.
            </p>
          </div>
        </div>

        <div style={{ marginBottom: "2.5rem" }}>
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
            Select All That Apply
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "8px",
            }}
          >
            {MEDICAL_CONDITIONS.map((condition) => {
              const isSelected = data.medicalConditions?.includes(condition);
              const isDisabled = isNone && condition !== "None";
              const isNoneOption = condition === "None";

              return (
                <motion.button
                  key={condition}
                  onClick={() => toggleCondition(condition)}
                  disabled={isDisabled}
                  whileTap={!isDisabled ? { scale: 0.97 } : {}}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                    padding: "12px 14px",
                    background: isSelected
                      ? isNoneOption
                        ? "#4a7c59"
                        : "#0d3d35"
                      : "#ffffff",
                    color: isSelected ? "#f5f3ee" : "#1a1a1a",
                    border: "1.5px solid",
                    borderColor: isSelected
                      ? isNoneOption
                        ? "#4a7c59"
                        : "#0d3d35"
                      : "rgba(13, 61, 53, 0.1)",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontFamily: "Inter",
                    fontWeight: 600,
                    cursor: isDisabled ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                    opacity: isDisabled ? 0.4 : 1,
                  }}
                >
                  <span>{condition}</span>
                  {isSelected &&
                    (isNoneOption ? (
                      <Check size={12} strokeWidth={3} />
                    ) : (
                      <X size={12} strokeWidth={3} />
                    ))}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: "center" }}>
          <motion.button
            onClick={onNext}
            disabled={!data.medicalConditions?.length || isSubmitting}
            whileHover={
              !isSubmitting && data.medicalConditions?.length ? { y: -2 } : {}
            }
            whileTap={
              !isSubmitting && data.medicalConditions?.length
                ? { scale: 0.97 }
                : {}
            }
            className="btn-primary"
            style={{ padding: "1rem 2.5rem", fontSize: "12px" }}
          >
            {isSubmitting ? (
              <>
                <SpinLoader size="sm" color="light" />
                Analyzing your body...
              </>
            ) : (
              <>
                Analyze My Body
                <ArrowRight size={14} />
              </>
            )}
          </motion.button>

          <p
            style={{
              fontSize: "11px",
              color: "#9ca09a",
              fontFamily: "Inter",
              marginTop: "12px",
            }}
          >
            Your AI analysis will be ready in seconds
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default StepMedical;

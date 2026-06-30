import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { Activity } from "lucide-react";

const BMICard = () => {
  const { user } = useAuth();
  const bmi = user?.bodyMetrics?.bmi;
  const category = user?.bodyMetrics?.bmiCategory;

  const getBMIColor = (v) => {
    if (v < 18.5) return "#c4823a";
    if (v < 25) return "#4a7c59";
    if (v < 30) return "#c4823a";
    return "#a84838";
  };

  const color = bmi ? getBMIColor(bmi) : "#6b7068";

  return (
    <div className="premium-card" style={{ padding: "1.75rem" }}>
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
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: color,
            color: "#f5f3ee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Activity size={17} strokeWidth={2} />
        </div>
        <div>
          <h3
            className="font-display"
            style={{
              fontSize: "1.375rem",
              color: "#0d3d35",
              letterSpacing: "-0.01em",
            }}
          >
            BMI Status
          </h3>
          <p
            className="font-mono"
            style={{
              fontSize: "10px",
              color: "#6b7068",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginTop: "2px",
            }}
          >
            Body Mass Index
          </p>
        </div>
      </div>

      {bmi ? (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <span
              className="font-display"
              style={{
                fontSize: "3.5rem",
                color: "#0d3d35",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {bmi.toFixed(1)}
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: "12px",
                color: "#6b7068",
                letterSpacing: "0.15em",
                fontWeight: 700,
              }}
            >
              BMI
            </span>
          </div>
          <p
            className="font-mono"
            style={{
              fontSize: "11px",
              color,
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: "1.5rem",
            }}
          >
            {category}
          </p>
        </>
      ) : (
        <p style={{ fontSize: "13px", color: "#6b7068", fontFamily: "Inter" }}>
          Not calculated yet
        </p>
      )}

      <div
        style={{
          position: "relative",
          height: "8px",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, display: "flex" }}>
          <div style={{ flex: 1, background: "rgba(196, 130, 58, 0.3)" }} />
          <div style={{ flex: 1, background: "rgba(74, 124, 89, 0.3)" }} />
          <div style={{ flex: 1, background: "rgba(196, 130, 58, 0.3)" }} />
          <div style={{ flex: 1, background: "rgba(168, 72, 56, 0.3)" }} />
        </div>
        {bmi && (
          <motion.div
            initial={{ left: "0%" }}
            animate={{ left: `${Math.min(((bmi - 10) / 30) * 100, 100)}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              top: "-2px",
              width: "4px",
              height: "12px",
              background: "#0d3d35",
              borderRadius: "2px",
              boxShadow: "0 0 0 2px #ffffff",
            }}
          />
        )}
      </div>
      <div
        className="font-mono"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "8px",
          fontSize: "9px",
          color: "#9ca09a",
          letterSpacing: "0.15em",
          fontWeight: 600,
        }}
      >
        <span>UNDER</span>
        <span>NORMAL</span>
        <span>OVER</span>
        <span>OBESE</span>
      </div>
    </div>
  );
};

export default BMICard;

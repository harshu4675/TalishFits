import React from "react";
import { motion } from "framer-motion";

const MacroChart = ({ targets, consumed }) => {
  const macros = [
    { key: "calories", label: "Calories", unit: "cal", color: "#0d3d35" },
    { key: "protein", label: "Protein", unit: "g", color: "#1a5d52" },
    { key: "carbs", label: "Carbs", unit: "g", color: "#4a7c59" },
    { key: "fat", label: "Fat", unit: "g", color: "#c4a87a" },
  ];

  return (
    <div className="premium-card" style={{ padding: "1.5rem" }}>
      <h4
        className="font-mono"
        style={{
          fontSize: "10px",
          color: "#0d3d35",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: "1.25rem",
        }}
      >
        Daily Macros
      </h4>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {macros.map((macro) => {
          const target = targets[macro.key] || 1;
          const value = consumed[macro.key] || 0;
          const percentage = Math.min((value / target) * 100, 100);
          const isOver = value > target;

          return (
            <div key={macro.key}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "12px",
                    color: "#2a2a2a",
                    fontFamily: "Inter",
                    fontWeight: 500,
                  }}
                >
                  {macro.label}
                </span>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "4px",
                  }}
                >
                  <span
                    className="font-display"
                    style={{
                      fontSize: "14px",
                      color: isOver ? "#a84838" : macro.color,
                    }}
                  >
                    {Math.round(value)}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "10px",
                      color: "#6b7068",
                      fontWeight: 500,
                    }}
                  >
                    /{target}
                    {macro.unit}
                  </span>
                </div>
              </div>
              <div
                style={{
                  height: "5px",
                  background: "rgba(13, 61, 53, 0.06)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    height: "100%",
                    background: isOver ? "#a84838" : macro.color,
                    borderRadius: "3px",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MacroChart;

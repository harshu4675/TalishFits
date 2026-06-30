import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({
  value = 0,
  max = 100,
  color = "#0d3d35",
  height = 6,
  showValue = false,
  label = "",
  animated = true,
  className = "",
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={className}>
      {(label || showValue) && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "6px",
          }}
        >
          {label && (
            <span
              style={{
                fontSize: "12px",
                color: "#2a2a2a",
                fontFamily: "Inter",
                fontWeight: 500,
              }}
            >
              {label}
            </span>
          )}
          {showValue && (
            <span
              className="font-mono"
              style={{
                fontSize: "12px",
                color,
                fontWeight: 700,
                letterSpacing: "0.05em",
              }}
            >
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      <div
        style={{
          height: `${height}px`,
          background: "rgba(13, 61, 53, 0.06)",
          borderRadius: `${height / 2}px`,
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{
            height: "100%",
            background: color,
            borderRadius: `${height / 2}px`,
          }}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={animated ? { duration: 1, ease: [0.16, 1, 0.3, 1] } : {}}
        />
      </div>
    </div>
  );
};

export default ProgressBar;

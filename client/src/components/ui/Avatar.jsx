import React from "react";
import { motion } from "framer-motion";

const Avatar = ({ src, name, size = "md", online = false, className = "" }) => {
  const sizes = {
    xs: { width: 24, height: 24, fontSize: "9px" },
    sm: { width: 32, height: 32, fontSize: "11px" },
    md: { width: 40, height: 40, fontSize: "14px" },
    lg: { width: 56, height: 56, fontSize: "18px" },
    xl: { width: 80, height: 80, fontSize: "24px" },
    "2xl": { width: 112, height: 112, fontSize: "36px" },
  };

  const dotSizes = {
    xs: { width: 6, height: 6, border: 1 },
    sm: { width: 8, height: 8, border: 1.5 },
    md: { width: 10, height: 10, border: 2 },
    lg: { width: 12, height: 12, border: 2 },
    xl: { width: 16, height: 16, border: 2.5 },
    "2xl": { width: 20, height: 20, border: 3 },
  };

  const s = sizes[size];
  const d = dotSizes[size];
  const initial = name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      className={className}
    >
      {src ? (
        <img
          src={src}
          alt={name || "Avatar"}
          style={{
            width: s.width,
            height: s.height,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid rgba(13, 61, 53, 0.08)",
          }}
        />
      ) : (
        <div
          style={{
            width: s.width,
            height: s.height,
            borderRadius: "50%",
            background: "#0d3d35",
            color: "#c4a87a",
            border: "2px solid #0d3d35",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            className="font-display"
            style={{ fontSize: s.fontSize, lineHeight: 1 }}
          >
            {initial}
          </span>
        </div>
      )}

      {online && (
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: "absolute",
            bottom: "-2px",
            right: "-2px",
            width: d.width,
            height: d.height,
            borderRadius: "50%",
            background: "#4a7c59",
            border: `${d.border}px solid #ffffff`,
          }}
        />
      )}
    </div>
  );
};

export default Avatar;

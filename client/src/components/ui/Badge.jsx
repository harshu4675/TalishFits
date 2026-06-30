import React from "react";

const Badge = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const variants = {
    default: {
      background: "rgba(13, 61, 53, 0.06)",
      border: "1px solid rgba(13, 61, 53, 0.15)",
      color: "#0d3d35",
    },
    primary: {
      background: "#0d3d35",
      border: "1px solid #0d3d35",
      color: "#f5f3ee",
    },
    accent: {
      background: "#c4a87a",
      border: "1px solid #c4a87a",
      color: "#0d3d35",
    },
    success: {
      background: "rgba(74, 124, 89, 0.1)",
      border: "1px solid rgba(74, 124, 89, 0.2)",
      color: "#4a7c59",
    },
    warning: {
      background: "rgba(196, 130, 58, 0.1)",
      border: "1px solid rgba(196, 130, 58, 0.2)",
      color: "#c4823a",
    },
    danger: {
      background: "rgba(168, 72, 56, 0.1)",
      border: "1px solid rgba(168, 72, 56, 0.2)",
      color: "#a84838",
    },
    outline: {
      background: "transparent",
      border: "1.5px solid #0d3d35",
      color: "#0d3d35",
    },
  };

  const sizes = {
    sm: { padding: "3px 8px", fontSize: "9px" },
    md: { padding: "4px 10px", fontSize: "10px" },
    lg: { padding: "6px 14px", fontSize: "11px" },
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        borderRadius: "9999px",
        fontFamily: "Space Grotesk, monospace",
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        ...variants[variant],
        ...sizes[size],
      }}
      className={className}
    >
      {children}
    </span>
  );
};

export default Badge;

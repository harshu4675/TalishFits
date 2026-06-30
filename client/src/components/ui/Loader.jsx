import React from "react";
import { motion } from "framer-motion";

export const PageLoader = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#e8ebe5",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ position: "relative", display: "inline-block" }}
      >
        <div
          className="font-display"
          style={{
            fontSize: "2rem",
            color: "#0d3d35",
            letterSpacing: "0.05em",
            lineHeight: 1,
          }}
        >
          TALISHFITS
        </div>
      </motion.div>

      <div
        style={{
          width: "180px",
          height: "2px",
          background: "rgba(13, 61, 53, 0.08)",
          borderRadius: "2px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.5,
            ease: [0.16, 1, 0.3, 1],
            repeat: Infinity,
          }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            width: "60%",
            background: "#0d3d35",
            borderRadius: "2px",
          }}
        />
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="font-mono"
        style={{
          fontSize: "10px",
          color: "#6b7068",
          letterSpacing: "0.3em",
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        Loading
      </motion.p>
    </motion.div>
  );
};

export const SpinLoader = ({ size = "md", color = "dark" }) => {
  const sizes = {
    sm: { width: 14, height: 14, border: 2 },
    md: { width: 24, height: 24, border: 2 },
    lg: { width: 36, height: 36, border: 3 },
  };

  const colors = {
    dark: { border: "rgba(13, 61, 53, 0.15)", top: "#0d3d35" },
    light: { border: "rgba(245, 243, 238, 0.2)", top: "#f5f3ee" },
    accent: { border: "rgba(196, 168, 122, 0.2)", top: "#c4a87a" },
  };

  const s = sizes[size];
  const c = colors[color];

  return (
    <div
      style={{
        width: s.width,
        height: s.height,
        border: `${s.border}px solid ${c.border}`,
        borderTopColor: c.top,
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    >
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export const PulseLoader = ({ count = 3 }) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: "#0d3d35",
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
};

export const Skeleton = ({ className = "", style = {} }) => (
  <div className={`skeleton ${className}`} style={style} />
);

export default PageLoader;

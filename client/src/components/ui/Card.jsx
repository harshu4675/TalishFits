import React from "react";
import { motion } from "framer-motion";

const Card = ({
  children,
  className = "",
  hover = true,
  padding = "md",
  variant = "default",
  onClick,
  ...props
}) => {
  const paddings = {
    none: "0",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "2.5rem",
  };

  const variants = {
    default: {
      background: "#ffffff",
      border: "1px solid rgba(13, 61, 53, 0.08)",
    },
    mint: {
      background: "#d8e0d4",
      border: "1px solid rgba(13, 61, 53, 0.08)",
    },
    dark: {
      background: "#0d3d35",
      color: "#f5f3ee",
      border: "1px solid rgba(245, 243, 238, 0.08)",
    },
    cream: {
      background: "#f5f3ee",
      border: "1px solid rgba(13, 61, 53, 0.06)",
    },
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -4 } : {}}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{
        borderRadius: "16px",
        padding: paddings[padding],
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        ...variants[variant],
      }}
      onMouseEnter={(e) => {
        if (hover && variant === "default") {
          e.currentTarget.style.borderColor = "rgba(13, 61, 53, 0.18)";
          e.currentTarget.style.boxShadow =
            "0 20px 50px rgba(13, 61, 53, 0.08)";
        }
      }}
      onMouseLeave={(e) => {
        if (hover && variant === "default") {
          e.currentTarget.style.borderColor = "rgba(13, 61, 53, 0.08)";
          e.currentTarget.style.boxShadow = "none";
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;

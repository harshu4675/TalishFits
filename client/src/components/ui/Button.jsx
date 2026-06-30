import React from "react";
import { motion } from "framer-motion";
import { SpinLoader } from "./Loader";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = "right",
  fullWidth = false,
  className = "",
  type = "button",
  onClick,
  ...props
}) => {
  const baseStyles = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontFamily: "Inter, sans-serif",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    borderRadius: "9999px",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    border: "none",
    width: fullWidth ? "100%" : "auto",
    opacity: disabled ? 0.4 : 1,
    textDecoration: "none",
  };

  const sizes = {
    sm: { padding: "0.625rem 1.25rem", fontSize: "11px" },
    md: { padding: "0.875rem 2rem", fontSize: "12px" },
    lg: { padding: "1rem 2.5rem", fontSize: "13px" },
  };

  const variants = {
    primary: {
      background: "#0d3d35",
      color: "#f5f3ee",
    },
    secondary: {
      background: "transparent",
      color: "#0d3d35",
      border: "2px solid #0d3d35",
    },
    accent: {
      background: "#c4a87a",
      color: "#0d3d35",
    },
    ghost: {
      background: "transparent",
      color: "#2a2a2a",
    },
    danger: {
      background: "rgba(168, 72, 56, 0.08)",
      color: "#a84838",
      border: "1.5px solid rgba(168, 72, 56, 0.2)",
    },
  };

  const iconSize = size === "sm" ? 12 : size === "lg" ? 15 : 13;

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={!disabled && !loading ? { y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.97 } : {}}
      style={{
        ...baseStyles,
        ...sizes[size],
        ...variants[variant],
      }}
      onMouseEnter={(e) => {
        if (disabled || loading) return;
        if (variant === "primary") {
          e.currentTarget.style.background = "#1a5d52";
          e.currentTarget.style.boxShadow =
            "0 12px 30px rgba(13, 61, 53, 0.25)";
        }
        if (variant === "secondary") {
          e.currentTarget.style.background = "#0d3d35";
          e.currentTarget.style.color = "#f5f3ee";
        }
        if (variant === "accent") {
          e.currentTarget.style.boxShadow =
            "0 12px 30px rgba(196, 168, 122, 0.3)";
        }
        if (variant === "ghost") {
          e.currentTarget.style.color = "#0d3d35";
        }
      }}
      onMouseLeave={(e) => {
        if (disabled || loading) return;
        if (variant === "primary") {
          e.currentTarget.style.background = "#0d3d35";
          e.currentTarget.style.boxShadow = "none";
        }
        if (variant === "secondary") {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#0d3d35";
        }
        if (variant === "accent") {
          e.currentTarget.style.boxShadow = "none";
        }
        if (variant === "ghost") {
          e.currentTarget.style.color = "#2a2a2a";
        }
      }}
      className={className}
      {...props}
    >
      {loading ? (
        <SpinLoader
          size="sm"
          color={
            variant === "primary" || variant === "accent" ? "light" : "dark"
          }
        />
      ) : (
        <>
          {Icon && iconPosition === "left" && <Icon size={iconSize} />}
          {children}
          {Icon && iconPosition === "right" && <Icon size={iconSize} />}
        </>
      )}
    </motion.button>
  );
};

export default Button;

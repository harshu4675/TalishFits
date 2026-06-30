import React, { useState, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

const Input = forwardRef(
  (
    {
      label,
      type = "text",
      icon: Icon,
      error,
      helper,
      className = "",
      containerClassName = "",
      ...props
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div
        className={containerClassName}
        style={{ display: "flex", flexDirection: "column", gap: "6px" }}
      >
        {label && (
          <label
            className="font-mono"
            style={{
              fontSize: "10px",
              color: "#0d3d35",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              paddingLeft: "2px",
            }}
          >
            {label}
          </label>
        )}

        <div style={{ position: "relative" }}>
          {Icon && (
            <div
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                zIndex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon
                size={16}
                style={{
                  color: error ? "#a84838" : isFocused ? "#0d3d35" : "#9ca09a",
                  transition: "color 0.3s",
                }}
              />
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={{
              width: "100%",
              padding: `0.875rem ${isPassword ? "3rem" : "1.25rem"} 0.875rem ${Icon ? "2.75rem" : "1.25rem"}`,
              background: "#ffffff",
              border: `1.5px solid ${error ? "#a84838" : isFocused ? "#0d3d35" : "rgba(13, 61, 53, 0.12)"}`,
              color: "#1a1a1a",
              fontFamily: "Inter, sans-serif",
              fontSize: "14px",
              borderRadius: "10px",
              outline: "none",
              transition: "all 0.3s ease",
              boxShadow:
                isFocused && !error
                  ? "0 0 0 4px rgba(13, 61, 53, 0.08)"
                  : "none",
            }}
            className={className}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
              style={{
                position: "absolute",
                right: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#9ca09a",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#0d3d35")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca09a")}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                paddingLeft: "2px",
              }}
            >
              <AlertCircle
                size={11}
                style={{ color: "#a84838", flexShrink: 0 }}
              />
              <span
                style={{
                  fontSize: "11px",
                  color: "#a84838",
                  fontFamily: "Inter",
                  fontWeight: 500,
                }}
              >
                {error}
              </span>
            </motion.div>
          ) : helper ? (
            <p
              style={{
                fontSize: "11px",
                color: "#9ca09a",
                fontFamily: "Inter",
                paddingLeft: "2px",
              }}
            >
              {helper}
            </p>
          ) : null}
        </AnimatePresence>
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;

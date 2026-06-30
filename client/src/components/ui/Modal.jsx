import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({ isOpen, onClose, title, children, maxWidth = "440px" }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(13, 61, 53, 0.6)",
              backdropFilter: "blur(8px)",
              zIndex: 100,
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: "calc(100% - 2rem)",
              maxWidth,
              zIndex: 101,
            }}
          >
            <div
              style={{
                background: "#ffffff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 30px 80px rgba(13, 61, 53, 0.3)",
              }}
            >
              {title && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "1.5rem 2rem",
                    borderBottom: "1px solid rgba(13, 61, 53, 0.06)",
                  }}
                >
                  <h3
                    className="font-display"
                    style={{
                      fontSize: "1.375rem",
                      color: "#0d3d35",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "#f5f3ee",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#6b7068",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#0d3d35";
                      e.currentTarget.style.color = "#f5f3ee";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#f5f3ee";
                      e.currentTarget.style.color = "#6b7068";
                    }}
                  >
                    <X size={15} />
                  </button>
                </div>
              )}
              <div style={{ padding: "2rem" }}>{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Modal;

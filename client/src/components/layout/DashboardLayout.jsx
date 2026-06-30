import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#e8ebe5" }}>
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(13, 61, 53, 0.5)",
              backdropFilter: "blur(4px)",
              zIndex: 30,
            }}
            className="lg:!hidden"
          />
        )}
      </AnimatePresence>

      <main
        style={{
          minHeight: "100vh",
          paddingLeft: 0,
          transition: "padding-left 0.3s ease",
        }}
        className="lg:!pl-72"
      >
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "1rem 1.25rem",
            background: "rgba(232, 235, 229, 0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(13, 61, 53, 0.06)",
          }}
          className="lg:!hidden"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#0d3d35",
              borderRadius: "8px",
            }}
          >
            <Menu size={22} />
          </button>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              className="font-display"
              style={{
                fontSize: "1rem",
                color: "#0d3d35",
                letterSpacing: "0.05em",
                lineHeight: 1,
              }}
            >
              TALISHFITS
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: "7px",
                color: "#6b7068",
                letterSpacing: "0.3em",
                marginTop: "2px",
                fontWeight: 600,
              }}
            >
              FITNESS COACH
            </span>
          </div>

          <div style={{ width: "40px" }} />
        </div>

        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="dashboard-content"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;

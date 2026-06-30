import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  Trophy,
  Bell,
  User,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/workout", icon: Dumbbell, label: "Workouts" },
  { to: "/diet", icon: UtensilsCrossed, label: "Nutrition" },
  { to: "/progress", icon: TrendingUp, label: "Progress" },
  { to: "/achievements", icon: Trophy, label: "Achievements" },
  { to: "/notifications", icon: Bell, label: "Notifications" },
  { to: "/profile", icon: User, label: "Profile" },
];

const SidebarContent = ({ user, onToggle, handleLogout }) => (
  <>
    <div
      style={{
        padding: "1.75rem 1.5rem",
        borderBottom: "1px solid rgba(245, 243, 238, 0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            className="font-display"
            style={{
              fontSize: "1.375rem",
              color: "#f5f3ee",
              letterSpacing: "0.05em",
              lineHeight: 1,
            }}
          >
            TALISHFITS
          </span>
          <span
            className="font-mono"
            style={{
              fontSize: "8px",
              color: "rgba(245, 243, 238, 0.4)",
              letterSpacing: "0.3em",
              marginTop: "3px",
              fontWeight: 600,
            }}
          >
            AI FITNESS COACH
          </span>
        </div>
        <button
          onClick={onToggle}
          className="lg:hidden"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#f5f3ee",
            padding: "4px",
          }}
        >
          <X size={20} />
        </button>
      </div>
    </div>

    <div
      style={{
        padding: "1.25rem 1.5rem",
        borderBottom: "1px solid rgba(245, 243, 238, 0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ position: "relative" }}>
          {user?.avatar?.url ? (
            <img
              src={user.avatar.url}
              alt={user.name}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #c4a87a",
              }}
            />
          ) : (
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: "#c4a87a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #c4a87a",
              }}
            >
              <span
                className="font-display"
                style={{ color: "#0d3d35", fontSize: "15px" }}
              >
                {user?.name?.[0]?.toUpperCase()}
              </span>
            </div>
          )}
          <div
            style={{
              position: "absolute",
              bottom: "-2px",
              right: "-2px",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#4a7c59",
              border: "2px solid #0d3d35",
            }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: "13px",
              fontFamily: "Inter",
              fontWeight: 700,
              color: "#f5f3ee",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.name}
          </p>
          <p
            className="font-mono"
            style={{
              fontSize: "9px",
              color: "rgba(245, 243, 238, 0.5)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginTop: "2px",
              fontWeight: 600,
            }}
          >
            {user?.subscription?.plan || "Free"} Plan
          </p>
        </div>
      </div>

      {user?.gamification?.fitnessScore !== undefined && (
        <div style={{ marginTop: "1.25rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: "9px",
                color: "rgba(245, 243, 238, 0.5)",
                letterSpacing: "0.2em",
                fontWeight: 600,
                textTransform: "uppercase",
              }}
            >
              Fitness Score
            </span>
            <span
              className="font-display"
              style={{ fontSize: "14px", color: "#c4a87a" }}
            >
              {user.gamification.fitnessScore}
            </span>
          </div>
          <div
            style={{
              height: "3px",
              background: "rgba(245, 243, 238, 0.08)",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <motion.div
              style={{ height: "100%", background: "#c4a87a" }}
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((user.gamification.fitnessScore / 1000) * 100, 100)}%`,
              }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      )}
    </div>

    <nav
      style={{ flex: 1, padding: "1rem 0.75rem", overflowY: "auto" }}
      className="hide-scrollbar"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onToggle}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "0.875rem 1rem",
              borderRadius: "10px",
              color: isActive ? "#f5f3ee" : "rgba(245, 243, 238, 0.55)",
              background: isActive ? "#1a5d52" : "transparent",
              textDecoration: "none",
              transition: "all 0.2s",
              position: "relative",
              fontFamily: "Inter",
              fontSize: "13px",
              fontWeight: isActive ? 700 : 500,
            })}
            onMouseEnter={(e) => {
              if (e.currentTarget.style.background !== "rgb(26, 93, 82)") {
                e.currentTarget.style.background = "rgba(245, 243, 238, 0.04)";
                e.currentTarget.style.color = "#f5f3ee";
              }
            }}
            onMouseLeave={(e) => {
              if (!e.currentTarget.className.includes("active")) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(245, 243, 238, 0.55)";
              }
            }}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "3px",
                      height: "20px",
                      background: "#c4a87a",
                      borderRadius: "0 2px 2px 0",
                    }}
                  />
                )}
                <item.icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>

    {user?.gamification?.streak?.current > 0 && (
      <div style={{ padding: "0 1.25rem 1rem 1.25rem" }}>
        <div
          style={{
            padding: "1rem 1.25rem",
            background: "#c4a87a",
            borderRadius: "12px",
            color: "#0d3d35",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <p
                className="font-mono"
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.25em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: "2px",
                }}
              >
                Current Streak
              </p>
              <p
                className="font-display"
                style={{ fontSize: "1.5rem", lineHeight: 1 }}
              >
                {user.gamification.streak.current} Days
              </p>
            </div>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#0d3d35",
                color: "#c4a87a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span className="font-display" style={{ fontSize: "14px" }}>
                {user.gamification.streak.current}
              </span>
            </div>
          </div>
        </div>
      </div>
    )}

    <div
      style={{
        padding: "1rem 0.75rem",
        borderTop: "1px solid rgba(245, 243, 238, 0.08)",
      }}
    >
      <button
        onClick={handleLogout}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "0.875rem 1rem",
          background: "transparent",
          color: "rgba(245, 243, 238, 0.5)",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          transition: "all 0.2s",
          fontFamily: "Inter",
          fontSize: "13px",
          fontWeight: 500,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(168, 72, 56, 0.1)";
          e.currentTarget.style.color = "#f5f3ee";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "rgba(245, 243, 238, 0.5)";
        }}
      >
        <LogOut size={17} />
        Sign Out
      </button>
    </div>
  </>
);

const Sidebar = ({ isOpen, onToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <aside
        className="hidden lg:flex"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: "288px",
          background: "#0d3d35",
          flexDirection: "column",
          zIndex: 40,
        }}
      >
        <SidebarContent
          user={user}
          onToggle={() => {}}
          handleLogout={handleLogout}
        />
      </aside>

      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? "0%" : "-100%" }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="lg:!hidden"
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          width: "288px",
          background: "#0d3d35",
          display: "flex",
          flexDirection: "column",
          zIndex: 40,
        }}
      >
        <SidebarContent
          user={user}
          onToggle={onToggle}
          handleLogout={handleLogout}
        />
      </motion.aside>
    </>
  );
};

export default Sidebar;

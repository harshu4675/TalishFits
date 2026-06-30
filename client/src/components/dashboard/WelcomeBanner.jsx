import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 5) return "Good Night";
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
};

const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, " ");
};

const WelcomeBanner = ({ user, activeGoal, streak }) => {
  const navigate = useNavigate();
  const greeting = getGreeting();
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="welcome-banner"
      style={{
        background: "#0d3d35",
        borderRadius: "16px",
        padding: "1.25rem",
        color: "#f5f3ee",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle, rgba(245,243,238,0.04) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 10 }}>
        <div className="welcome-content">
          <div className="welcome-text">
            <div className="welcome-tags">
              <span
                className="font-mono welcome-date"
                style={{
                  color: "#c4a87a",
                  letterSpacing: "0.25em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                {today}
              </span>
              {activeGoal && (
                <>
                  <div
                    className="welcome-dot"
                    style={{
                      borderRadius: "50%",
                      background: "rgba(245, 243, 238, 0.3)",
                    }}
                  />
                  <span
                    className="font-mono welcome-tag"
                    style={{
                      background: "rgba(196, 168, 122, 0.15)",
                      border: "1px solid rgba(196, 168, 122, 0.3)",
                      borderRadius: "9999px",
                      color: "#c4a87a",
                      letterSpacing: "0.2em",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {capitalizeFirst(activeGoal.type)}
                  </span>
                </>
              )}
              {streak > 0 && (
                <span
                  className="font-mono welcome-tag"
                  style={{
                    background: "rgba(245, 243, 238, 0.1)",
                    border: "1px solid rgba(245, 243, 238, 0.15)",
                    borderRadius: "9999px",
                    color: "#f5f3ee",
                    letterSpacing: "0.2em",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {streak} Day Streak
                </span>
              )}
            </div>

            <h1
              className="font-display welcome-title"
              style={{ color: "#f5f3ee", letterSpacing: "-0.02em" }}
            >
              {greeting}, {user?.name?.split(" ")[0]}.
            </h1>

            <p
              className="welcome-subtitle"
              style={{
                color: "rgba(245, 243, 238, 0.65)",
                fontFamily: "Inter",
                lineHeight: 1.5,
              }}
            >
              {activeGoal
                ? `You're ${activeGoal.progressPercentage || 0}% through your ${capitalizeFirst(activeGoal.type)} journey. Keep pushing.`
                : "Ready to crush your goals today? Your AI coach has everything planned."}
            </p>
          </div>

          {activeGoal && (
            <div className="welcome-progress">
              <div className="welcome-ring-wrapper">
                <svg
                  viewBox="0 0 72 72"
                  style={{
                    transform: "rotate(-90deg)",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <circle
                    cx="36"
                    cy="36"
                    r="30"
                    fill="none"
                    stroke="rgba(245, 243, 238, 0.08)"
                    strokeWidth="4"
                  />
                  <motion.circle
                    cx="36"
                    cy="36"
                    r="30"
                    fill="none"
                    stroke="#c4a87a"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 30}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
                    animate={{
                      strokeDashoffset:
                        2 *
                        Math.PI *
                        30 *
                        (1 - (activeGoal.progressPercentage || 0) / 100),
                    }}
                    transition={{
                      duration: 1.5,
                      ease: [0.16, 1, 0.3, 1],
                      delay: 0.3,
                    }}
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    className="font-display welcome-ring-value"
                    style={{ color: "#f5f3ee", lineHeight: 1 }}
                  >
                    {activeGoal.progressPercentage || 0}
                  </span>
                  <span
                    style={{
                      fontSize: "8px",
                      color: "rgba(245, 243, 238, 0.5)",
                      fontFamily: "Inter",
                      fontWeight: 600,
                    }}
                  >
                    %
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate("/progress")}
                className="welcome-button"
                style={{
                  background: "transparent",
                  color: "#c4a87a",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "Inter",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 0",
                }}
              >
                View Progress
                <ArrowRight size={11} />
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .welcome-banner {
          padding: 1.25rem;
        }

        .welcome-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .welcome-tags {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }

        .welcome-date {
          font-size: 9px;
        }

        .welcome-dot {
          width: 3px;
          height: 3px;
        }

        .welcome-tag {
          padding: 2px 8px;
          font-size: 8px;
        }

        .welcome-title {
          font-size: 1.375rem;
          margin-bottom: 6px;
        }

        .welcome-subtitle {
          font-size: 12px;
        }

        .welcome-progress {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(245, 243, 238, 0.08);
        }

        .welcome-ring-wrapper {
          position: relative;
          width: 60px;
          height: 60px;
          flex-shrink: 0;
        }

        .welcome-ring-value {
          font-size: 1rem;
        }

        .welcome-button {
          font-size: 10px;
        }

        @media (min-width: 480px) {
          .welcome-banner {
            padding: 1.5rem;
          }
          .welcome-title {
            font-size: 1.5rem;
          }
          .welcome-subtitle {
            font-size: 13px;
          }
          .welcome-tag {
            font-size: 9px;
          }
          .welcome-date {
            font-size: 10px;
          }
        }

        @media (min-width: 768px) {
          .welcome-banner {
            padding: 1.75rem;
          }
          .welcome-content {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 1.5rem;
          }
          .welcome-text {
            flex: 1;
          }
          .welcome-progress {
            padding-top: 0;
            border-top: none;
            border-left: 1px solid rgba(245, 243, 238, 0.08);
            padding-left: 1.5rem;
          }
          .welcome-title {
            font-size: 1.75rem;
          }
          .welcome-ring-wrapper {
            width: 72px;
            height: 72px;
          }
          .welcome-ring-value {
            font-size: 1.125rem;
          }
        }

        @media (min-width: 1024px) {
          .welcome-banner {
            padding: 2rem;
          }
          .welcome-title {
            font-size: 2rem;
          }
          .welcome-subtitle {
            font-size: 14px;
          }
          .welcome-progress {
            padding-left: 2rem;
            gap: 1.25rem;
          }
          .welcome-ring-wrapper {
            width: 80px;
            height: 80px;
          }
          .welcome-ring-value {
            font-size: 1.25rem;
          }
        }

        @media (min-width: 1280px) {
          .welcome-title {
            font-size: 2.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomeBanner;

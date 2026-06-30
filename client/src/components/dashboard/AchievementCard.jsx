import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, Lock } from "lucide-react";

const defaultBadges = [
  { id: "first_workout", name: "First Step" },
  { id: "streak_7", name: "7-Day Warrior" },
  { id: "workouts_10", name: "Getting Started" },
  { id: "first_goal", name: "Goal Setter" },
  { id: "water_streak", name: "Hydration Hero" },
  { id: "streak_30", name: "Iron Discipline" },
];

const AchievementCard = ({ badges = [] }) => {
  const navigate = useNavigate();
  const earnedCount = badges.length;

  return (
    <div className="achievement-card">
      <div className="achievement-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Trophy size={13} style={{ color: "#c4a87a" }} strokeWidth={2.5} />
          <span
            className="font-mono achievement-label"
            style={{
              color: "#0d3d35",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            Achievements
          </span>
        </div>
        <button
          onClick={() => navigate("/achievements")}
          className="achievement-view-all"
          style={{
            background: "transparent",
            color: "#0d3d35",
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          View All
          <ArrowRight size={11} />
        </button>
      </div>

      <div className="achievement-grid">
        {defaultBadges.map((badge, i) => {
          const isEarned = badges.some((b) => b.id === badge.id);
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: isEarned ? 1 : 0.5, scale: 1 }}
              transition={{ delay: 0.05 * i }}
              className="achievement-item"
              style={{
                background: isEarned ? "#0d3d35" : "#f5f3ee",
                color: isEarned ? "#c4a87a" : "#9ca09a",
                border: "1px solid",
                borderColor: isEarned ? "#0d3d35" : "rgba(13, 61, 53, 0.06)",
                position: "relative",
              }}
            >
              {!isEarned && (
                <Lock
                  size={9}
                  style={{
                    position: "absolute",
                    top: "6px",
                    right: "6px",
                    color: "rgba(13, 61, 53, 0.3)",
                  }}
                />
              )}
              <Trophy size={14} strokeWidth={2} />
              <span className="achievement-name">{badge.name}</span>
            </motion.div>
          );
        })}
      </div>

      <p
        className="achievement-count"
        style={{ textAlign: "center", color: "#6b7068", fontFamily: "Inter" }}
      >
        {earnedCount} of {defaultBadges.length}+ unlocked
      </p>

      <style>{`
        .achievement-card {
          background: #ffffff;
          border: 1px solid rgba(13, 61, 53, 0.08);
          border-radius: 16px;
          padding: 1.25rem;
        }

        .achievement-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .achievement-label {
          font-size: 9px;
        }

        .achievement-view-all {
          font-size: 9px;
        }

        .achievement-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
        }

        .achievement-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          padding: 10px 6px;
          border-radius: 9px;
          text-align: center;
        }

        .achievement-name {
          font-size: 8px;
          font-family: Inter;
          font-weight: 600;
          line-height: 1.2;
        }

        .achievement-count {
          font-size: 10px;
          margin-top: 1rem;
        }

        @media (min-width: 480px) {
          .achievement-card {
            padding: 1.5rem;
          }
          .achievement-label {
            font-size: 10px;
          }
          .achievement-view-all {
            font-size: 10px;
          }
          .achievement-grid {
            gap: 8px;
          }
          .achievement-item {
            gap: 6px;
            padding: 12px 8px;
            border-radius: 10px;
          }
          .achievement-name {
            font-size: 9px;
          }
        }
      `}</style>
    </div>
  );
};

export default AchievementCard;

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const StreakCard = ({ current, longest, level, xp }) => {
  const xpProgress = ((xp % 500) / 500) * 100;

  return (
    <div className="streak-card">
      <div className="streak-top">
        <div>
          <p
            className="font-mono streak-label"
            style={{
              color: "#c4a87a",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "6px",
            }}
          >
            Current Streak
          </p>
          <p
            className="font-display streak-value"
            style={{
              color: "#f5f3ee",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            {current}
          </p>
          <p
            className="streak-days"
            style={{
              color: "rgba(245, 243, 238, 0.6)",
              fontFamily: "Inter",
              marginTop: "4px",
            }}
          >
            {current === 1 ? "day" : "days"}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p
            className="font-mono streak-best-label"
            style={{
              color: "rgba(245, 243, 238, 0.4)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Best
          </p>
          <p
            className="font-display streak-best-value"
            style={{ color: "#c4a87a", lineHeight: 1, marginTop: "4px" }}
          >
            {longest}
          </p>
        </div>
      </div>

      <div className="streak-dots">
        {Array.from({ length: 7 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.1 * i, duration: 0.3 }}
            style={{
              flex: 1,
              height: "4px",
              borderRadius: "2px",
              background:
                i < Math.min(current, 7)
                  ? "#c4a87a"
                  : "rgba(245, 243, 238, 0.08)",
              transformOrigin: "left",
            }}
          />
        ))}
      </div>

      <div
        style={{
          height: "1px",
          background: "rgba(245, 243, 238, 0.08)",
          marginBottom: "1rem",
        }}
      />

      <div className="level-row">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div className="level-badge">{level}</div>
          <span
            className="level-text"
            style={{ fontFamily: "Inter", fontWeight: 700, color: "#f5f3ee" }}
          >
            Level {level}
          </span>
        </div>
        <span
          className="font-mono xp-text"
          style={{
            color: "rgba(245, 243, 238, 0.5)",
            letterSpacing: "0.1em",
            fontWeight: 600,
          }}
        >
          {xp % 500} / 500 XP
        </span>
      </div>

      <div
        style={{
          height: "4px",
          background: "rgba(245, 243, 238, 0.08)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <motion.div
          style={{ height: "100%", background: "#c4a87a" }}
          initial={{ width: 0 }}
          animate={{ width: `${xpProgress}%` }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <p
        className="xp-remaining"
        style={{
          color: "rgba(245, 243, 238, 0.4)",
          fontFamily: "Inter",
          marginTop: "8px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
        }}
      >
        <TrendingUp size={9} />
        {500 - (xp % 500)} XP to Level {level + 1}
      </p>

      <style>{`
        .streak-card {
          background: #0d3d35;
          border-radius: 16px;
          padding: 1.25rem;
          color: #f5f3ee;
        }

        .streak-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.25rem;
        }

        .streak-label {
          font-size: 9px;
        }

        .streak-value {
          font-size: 2.5rem;
        }

        .streak-days {
          font-size: 11px;
        }

        .streak-best-label {
          font-size: 8px;
        }

        .streak-best-value {
          font-size: 1.125rem;
        }

        .streak-dots {
          display: flex;
          gap: 4px;
          margin-bottom: 1.25rem;
        }

        .level-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .level-badge {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          background: #c4a87a;
          color: #0d3d35;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: Space Grotesk;
          font-size: 9px;
          font-weight: 700;
        }

        .level-text {
          font-size: 12px;
        }

        .xp-text {
          font-size: 9px;
        }

        .xp-remaining {
          font-size: 9px;
        }

        @media (min-width: 480px) {
          .streak-card {
            padding: 1.5rem;
          }
          .streak-label {
            font-size: 10px;
          }
          .streak-value {
            font-size: 3rem;
          }
          .streak-days {
            font-size: 12px;
          }
          .streak-best-label {
            font-size: 9px;
          }
          .streak-best-value {
            font-size: 1.25rem;
          }
          .level-badge {
            width: 24px;
            height: 24px;
            font-size: 10px;
          }
          .level-text {
            font-size: 13px;
          }
          .xp-text {
            font-size: 10px;
          }
          .xp-remaining {
            font-size: 10px;
          }
        }

        @media (min-width: 1024px) {
          .streak-card {
            padding: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StreakCard;

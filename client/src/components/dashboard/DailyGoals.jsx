import React from "react";
import { motion } from "framer-motion";
import { Flame, Droplets, Target, Dumbbell, Check } from "lucide-react";

const GoalRing = ({ value, max, color, icon: Icon, label, unit }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 26;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="goal-ring-wrapper">
      <div className="goal-ring-svg-wrapper">
        <svg
          viewBox="0 0 76 76"
          style={{ transform: "rotate(-90deg)", width: "100%", height: "100%" }}
        >
          <circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            stroke="rgba(13, 61, 53, 0.06)"
            strokeWidth="5"
          />
          <motion.circle
            cx="38"
            cy="38"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset: circumference * (1 - percentage / 100),
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          />
        </svg>
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon className="goal-ring-icon" style={{ color }} strokeWidth={2} />
        </div>
      </div>
      <div style={{ textAlign: "center", marginTop: "8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: "2px",
          }}
        >
          <span
            className="font-display goal-ring-value"
            style={{ color: "#0d3d35", lineHeight: 1 }}
          >
            {Math.round(value)}
          </span>
          <span
            className="font-mono goal-ring-unit"
            style={{ color: "#6b7068", fontWeight: 600 }}
          >
            /{max}
            {unit}
          </span>
        </div>
        <p
          className="font-mono goal-ring-label"
          style={{
            color: "#6b7068",
            marginTop: "4px",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

const DailyGoals = ({ progress, targets }) => {
  const calories = progress?.nutrition?.calories || 0;
  const protein = progress?.nutrition?.protein || 0;
  const water = progress?.nutrition?.water || 0;
  const workoutDone = progress?.workout?.completed || false;

  return (
    <div className="premium-card daily-goals-card">
      <div className="daily-goals-header">
        <div>
          <h3
            className="font-display daily-goals-title"
            style={{ color: "#0d3d35", letterSpacing: "-0.01em" }}
          >
            Today's Goals
          </h3>
          <p
            className="font-mono daily-goals-date"
            style={{
              color: "#6b7068",
              marginTop: "4px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <span className="tag daily-goals-tag">
          <Target size={8} />
          Daily Targets
        </span>
      </div>

      <div className="daily-goals-grid">
        <GoalRing
          value={calories}
          max={targets.calories}
          color="#0d3d35"
          icon={Flame}
          label="Calories"
          unit="cal"
        />
        <GoalRing
          value={protein}
          max={targets.protein}
          color="#1a5d52"
          icon={Target}
          label="Protein"
          unit="g"
        />
        <GoalRing
          value={water}
          max={targets.water}
          color="#c4a87a"
          icon={Droplets}
          label="Water"
          unit="L"
        />

        <div className="goal-ring-wrapper">
          <motion.div
            animate={workoutDone ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.5 }}
            className="workout-status-circle"
            style={{
              borderColor: workoutDone ? "#4a7c59" : "rgba(13, 61, 53, 0.06)",
              background: workoutDone
                ? "rgba(74, 124, 89, 0.08)"
                : "transparent",
            }}
          >
            <Dumbbell
              className="goal-ring-icon"
              style={{ color: workoutDone ? "#4a7c59" : "#9ca09a" }}
              strokeWidth={2}
            />
            {workoutDone && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="workout-status-badge"
              >
                <Check size={11} color="#f5f3ee" strokeWidth={3} />
              </motion.div>
            )}
          </motion.div>
          <div style={{ textAlign: "center", marginTop: "8px" }}>
            <p
              className="font-display goal-ring-value"
              style={{
                color: workoutDone ? "#4a7c59" : "#0d3d35",
                lineHeight: 1,
              }}
            >
              {workoutDone ? "Done" : "Pending"}
            </p>
            <p
              className="font-mono goal-ring-label"
              style={{
                color: "#6b7068",
                marginTop: "4px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              Workout
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .daily-goals-card {
          padding: 1.25rem;
        }

        .daily-goals-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
          gap: 8px;
        }

        .daily-goals-title {
          font-size: 1.25rem;
        }

        .daily-goals-date {
          font-size: 9px;
        }

        .daily-goals-tag {
          font-size: 9px;
        }

        .daily-goals-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          justify-items: center;
        }

        .goal-ring-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
        }

        .goal-ring-svg-wrapper {
          position: relative;
          width: 68px;
          height: 68px;
        }

        .goal-ring-icon {
          width: 16px;
          height: 16px;
        }

        .goal-ring-value {
          font-size: 0.875rem;
        }

        .goal-ring-unit {
          font-size: 8px;
        }

        .goal-ring-label {
          font-size: 8px;
        }

        .workout-status-circle {
          position: relative;
          width: 68px;
          height: 68px;
          border-radius: 50%;
          border: 5px solid;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .workout-status-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #4a7c59;
          color: #f5f3ee;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #ffffff;
        }

        @media (min-width: 480px) {
          .daily-goals-card {
            padding: 1.5rem;
          }
          .daily-goals-title {
            font-size: 1.375rem;
          }
          .goal-ring-svg-wrapper,
          .workout-status-circle {
            width: 76px;
            height: 76px;
          }
          .goal-ring-icon {
            width: 18px;
            height: 18px;
          }
          .goal-ring-value {
            font-size: 1rem;
          }
          .goal-ring-unit {
            font-size: 9px;
          }
          .goal-ring-label {
            font-size: 9px;
          }
        }

        @media (min-width: 640px) {
          .daily-goals-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 1.5rem;
          }
        }

        @media (min-width: 1024px) {
          .daily-goals-card {
            padding: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default DailyGoals;

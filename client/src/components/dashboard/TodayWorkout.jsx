import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { workoutAPI } from "../../api/workoutApi";
import { Dumbbell, Clock, Flame, ArrowRight, Play } from "lucide-react";
import { Skeleton } from "../ui/Loader";

const TodayWorkout = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["todayWorkout"],
    queryFn: () => workoutAPI.getTodayWorkout(),
    select: (res) => res.data.data,
  });

  if (isLoading) {
    return <Skeleton style={{ height: "180px", borderRadius: "16px" }} />;
  }

  const workout = data?.workout;

  if (!workout) {
    return (
      <div className="premium-card today-workout-empty">
        <Dumbbell
          className="empty-icon"
          style={{ color: "#0d3d35", opacity: 0.4 }}
        />
        <h3 className="font-display empty-title" style={{ color: "#0d3d35" }}>
          No Workout Plan
        </h3>
        <p
          className="empty-desc"
          style={{ color: "#6b7068", fontFamily: "Inter" }}
        >
          Generate your AI-powered workout plan to get started.
        </p>
        <button
          onClick={() => navigate("/workout")}
          className="btn-primary empty-btn"
        >
          Generate Plan
          <ArrowRight size={13} />
        </button>

        <style>{`
          .today-workout-empty {
            padding: 1.5rem;
            text-align: center;
          }
          .empty-icon {
            width: 32px;
            height: 32px;
            margin: 0 auto 0.75rem auto;
          }
          .empty-title {
            font-size: 1.125rem;
            margin-bottom: 0.5rem;
          }
          .empty-desc {
            font-size: 12px;
            margin-bottom: 1.25rem;
          }
          .empty-btn {
            padding: 0.625rem 1.25rem !important;
            font-size: 11px !important;
          }
          @media (min-width: 480px) {
            .today-workout-empty {
              padding: 1.75rem;
            }
            .empty-icon {
              width: 36px;
              height: 36px;
            }
            .empty-title {
              font-size: 1.25rem;
            }
            .empty-desc {
              font-size: 13px;
            }
          }
        `}</style>
      </div>
    );
  }

  if (workout.isRestDay) {
    return (
      <div className="premium-card today-workout-rest">
        <div className="rest-header">
          <div className="rest-icon-wrapper">
            <Dumbbell className="rest-icon-svg" strokeWidth={2} />
          </div>
          <div>
            <h3
              className="font-display rest-title"
              style={{ color: "#0d3d35", letterSpacing: "-0.01em" }}
            >
              Rest Day
            </h3>
            <p
              className="font-mono rest-day-name"
              style={{
                color: "#6b7068",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              {workout.dayName}
            </p>
          </div>
        </div>

        <div className="rest-body">
          <h4
            className="font-display rest-body-title"
            style={{ color: "#0d3d35" }}
          >
            Recovery Mode
          </h4>
          <p
            className="rest-body-text"
            style={{ color: "#2a2a2a", fontFamily: "Inter", lineHeight: 1.5 }}
          >
            Rest is where the magic happens. Stay hydrated, stretch lightly, and
            get quality sleep.
          </p>
        </div>

        <style>{`
          .today-workout-rest {
            padding: 1.25rem;
          }
          .rest-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 1.25rem;
          }
          .rest-icon-wrapper {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background: #4a7c59;
            color: #f5f3ee;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .rest-icon-svg {
            width: 16px;
            height: 16px;
          }
          .rest-title {
            font-size: 1.25rem;
          }
          .rest-day-name {
            font-size: 9px;
            margin-top: 2px;
          }
          .rest-body {
            padding: 1rem;
            background: #d8e0d4;
            border-radius: 12px;
          }
          .rest-body-title {
            font-size: 0.9375rem;
            margin-bottom: 6px;
          }
          .rest-body-text {
            font-size: 11px;
          }
          @media (min-width: 480px) {
            .today-workout-rest {
              padding: 1.5rem;
            }
            .rest-icon-wrapper {
              width: 40px;
              height: 40px;
            }
            .rest-icon-svg {
              width: 17px;
              height: 17px;
            }
            .rest-title {
              font-size: 1.375rem;
            }
            .rest-day-name {
              font-size: 10px;
            }
            .rest-body {
              padding: 1.25rem;
            }
            .rest-body-title {
              font-size: 1rem;
            }
            .rest-body-text {
              font-size: 12px;
            }
          }
          @media (min-width: 1024px) {
            .today-workout-rest {
              padding: 1.75rem;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="premium-card today-workout-card">
      <div className="workout-header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: 0,
          }}
        >
          <div className="workout-icon-wrapper">
            <Dumbbell className="workout-icon-svg" strokeWidth={2} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3
              className="font-display workout-title"
              style={{ color: "#0d3d35", letterSpacing: "-0.01em" }}
            >
              Today's Workout
            </h3>
            <p
              className="font-mono workout-focus"
              style={{
                color: "#6b7068",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginTop: "2px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {workout.dayName} — {workout.focus}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/workout")}
          className="workout-view-all"
          style={{
            background: "transparent",
            color: "#0d3d35",
            border: "none",
            cursor: "pointer",
            fontFamily: "Inter",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            flexShrink: 0,
          }}
        >
          View All
          <ArrowRight size={12} />
        </button>
      </div>

      <div className="workout-stats">
        <div className="workout-stat-pill">
          <Clock size={11} style={{ color: "#0d3d35" }} />
          <span
            style={{ color: "#2a2a2a", fontFamily: "Inter", fontWeight: 600 }}
          >
            {workout.totalDuration} min
          </span>
        </div>
        <div className="workout-stat-pill">
          <Flame size={11} style={{ color: "#c4a87a" }} />
          <span
            style={{ color: "#2a2a2a", fontFamily: "Inter", fontWeight: 600 }}
          >
            {workout.totalCalories} cal
          </span>
        </div>
        <div className="workout-stat-pill">
          <Dumbbell size={11} style={{ color: "#0d3d35" }} />
          <span
            style={{ color: "#2a2a2a", fontFamily: "Inter", fontWeight: 600 }}
          >
            {workout.exercises?.length || 0} ex
          </span>
        </div>
      </div>

      <div className="workout-exercises-list">
        {workout.exercises?.slice(0, 4).map((exercise, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            className="workout-exercise-row"
          >
            <div className="exercise-number">
              {String(i + 1).padStart(2, "0")}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                className="exercise-name"
                style={{
                  color: "#1a1a1a",
                  fontFamily: "Inter",
                  fontWeight: 600,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {exercise.name}
              </p>
              <p
                className="font-mono exercise-meta"
                style={{
                  color: "#6b7068",
                  marginTop: "2px",
                  letterSpacing: "0.08em",
                  fontWeight: 500,
                }}
              >
                {exercise.sets} x {exercise.reps?.min}-{exercise.reps?.max}
              </p>
            </div>
            <span
              className="font-mono exercise-rest"
              style={{
                color: "#c4a87a",
                fontWeight: 700,
                letterSpacing: "0.1em",
                flexShrink: 0,
              }}
            >
              {exercise.restTime}s
            </span>
          </motion.div>
        ))}

        {(workout.exercises?.length || 0) > 4 && (
          <p
            style={{
              textAlign: "center",
              fontSize: "10px",
              color: "#6b7068",
              fontFamily: "Inter",
              paddingTop: "4px",
            }}
          >
            +{workout.exercises.length - 4} more exercises
          </p>
        )}
      </div>

      <motion.button
        onClick={() => navigate("/workout")}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="workout-start-btn"
        style={{
          width: "100%",
          background: "#0d3d35",
          color: "#f5f3ee",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontFamily: "Inter",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <Play size={13} strokeWidth={2.5} />
        Start Workout
      </motion.button>

      <style>{`
        .today-workout-card {
          padding: 1.25rem;
        }

        .workout-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 1.25rem;
        }

        .workout-icon-wrapper {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #0d3d35;
          color: #f5f3ee;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .workout-icon-svg {
          width: 16px;
          height: 16px;
        }

        .workout-title {
          font-size: 1.125rem;
        }

        .workout-focus {
          font-size: 9px;
          max-width: 200px;
        }

        .workout-view-all {
          font-size: 10px;
          padding: 4px 0;
        }

        .workout-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 1.25rem;
        }

        .workout-stat-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 10px;
          background: #e8ebe5;
          border-radius: 8px;
          font-size: 10px;
        }

        .workout-exercises-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 1.25rem;
        }

        .workout-exercise-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          background: #f5f3ee;
          border: 1px solid rgba(13, 61, 53, 0.04);
          border-radius: 10px;
        }

        .exercise-number {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: #0d3d35;
          color: #f5f3ee;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: Space Grotesk;
          font-size: 9px;
          font-weight: 700;
        }

        .exercise-name {
          font-size: 11px;
        }

        .exercise-meta {
          font-size: 9px;
        }

        .exercise-rest {
          font-size: 9px;
        }

        .workout-start-btn {
          padding: 0.75rem;
          font-size: 11px;
        }

        @media (min-width: 480px) {
          .today-workout-card {
            padding: 1.5rem;
          }
          .workout-icon-wrapper {
            width: 40px;
            height: 40px;
          }
          .workout-icon-svg {
            width: 17px;
            height: 17px;
          }
          .workout-title {
            font-size: 1.25rem;
          }
          .workout-focus {
            font-size: 10px;
            max-width: 240px;
          }
          .workout-view-all {
            font-size: 11px;
          }
          .workout-stat-pill {
            font-size: 11px;
            padding: 8px 12px;
          }
          .exercise-number {
            width: 28px;
            height: 28px;
            font-size: 10px;
          }
          .exercise-name {
            font-size: 12px;
          }
          .exercise-meta {
            font-size: 10px;
          }
          .exercise-rest {
            font-size: 10px;
          }
          .workout-start-btn {
            padding: 0.875rem;
            font-size: 12px;
          }
        }

        @media (min-width: 1024px) {
          .today-workout-card {
            padding: 1.75rem;
          }
          .workout-title {
            font-size: 1.375rem;
          }
          .workout-focus {
            max-width: 280px;
          }
        }
      `}</style>
    </div>
  );
};

export default TodayWorkout;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutAPI } from "../../api/workoutApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import toast from "react-hot-toast";
import {
  Dumbbell,
  RefreshCw,
  Play,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Check,
  ArrowLeft,
  Info,
  Target,
} from "lucide-react";

const Workout = () => {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() || 7);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const [expandedExercise, setExpandedExercise] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "Workouts — TalishFits";
  }, []);

  const { data: planData, isLoading } = useQuery({
    queryKey: ["activePlan"],
    queryFn: () => workoutAPI.getActivePlan(),
    select: (res) => res.data.data,
  });

  const generateMutation = useMutation({
    mutationFn: (data) => workoutAPI.generatePlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activePlan"] });
      queryClient.invalidateQueries({ queryKey: ["todayWorkout"] });
      toast.success("Workout plan generated");
      setShowTypeSelector(false);
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to generate plan"),
  });

  const completeMutation = useMutation({
    mutationFn: (data) => workoutAPI.completeWorkout(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["activePlan"] });
      const data = res.data.data;
      toast.success(`Workout complete! +${data.xpEarned} XP earned`);
      setIsWorkoutActive(false);
      setCompletedExercises([]);
    },
  });

  const plan = planData?.workoutPlan;
  const todayWorkout = plan?.schedule?.find((d) => d.dayNumber === selectedDay);
  const allExercises = todayWorkout
    ? [
        ...(todayWorkout.warmup || []),
        ...(todayWorkout.exercises || []),
        ...(todayWorkout.cooldown || []),
      ]
    : [];
  const totalExercises = allExercises.length;
  const completionRate =
    totalExercises > 0
      ? Math.round((completedExercises.length / totalExercises) * 100)
      : 0;

  const toggleExerciseComplete = (index) => {
    setCompletedExercises((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const finishWorkout = () => {
    completeMutation.mutate({
      dayNumber: selectedDay,
      duration: todayWorkout?.totalDuration || 45,
      caloriesBurned: todayWorkout?.totalCalories || 300,
      exercises: completedExercises.length,
      rating: 5,
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div
          className="skeleton"
          style={{ height: "500px", borderRadius: "16px" }}
        />
      </DashboardLayout>
    );
  }

  if (!plan || showTypeSelector) {
    return (
      <DashboardLayout>
        <PlanTypeSelector
          onGenerate={(type) => generateMutation.mutate({ planType: type })}
          isGenerating={generateMutation.isPending}
          currentType={plan?.type}
          onCancel={plan ? () => setShowTypeSelector(false) : null}
        />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="workout-page">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="workout-page-header"
        >
          <div className="workout-header-content">
            <div className="workout-header-text">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "1.5px",
                    background: "#c4a87a",
                  }}
                />
                <span
                  className="font-mono"
                  style={{
                    fontSize: "9px",
                    color: "#c4a87a",
                    letterSpacing: "0.3em",
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {plan.type} · Week {plan.weekNumber} · {plan.level}
                </span>
              </div>
              <h1
                className="font-display workout-page-title"
                style={{ color: "#0d3d35", letterSpacing: "-0.02em" }}
              >
                {plan.title}
              </h1>
            </div>

            <div className="workout-header-actions">
              <button
                onClick={() => setShowTypeSelector(true)}
                className="workout-switch-btn"
              >
                <RefreshCw size={12} />
                Switch
              </button>
              {!isWorkoutActive && todayWorkout && !todayWorkout.isRestDay && (
                <button
                  onClick={() => setIsWorkoutActive(true)}
                  className="workout-start-btn-header"
                >
                  <Play size={12} />
                  Start
                </button>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginBottom: "1.5rem" }}
        >
          <div className="workout-days-scroll hide-scrollbar">
            {plan.schedule?.map((day) => {
              const isToday = day.dayNumber === (new Date().getDay() || 7);
              const isSelected = selectedDay === day.dayNumber;
              return (
                <button
                  key={day.dayNumber}
                  onClick={() => setSelectedDay(day.dayNumber)}
                  className="workout-day-tab"
                  style={{
                    background: isSelected ? "#0d3d35" : "#ffffff",
                    color: "white",
                    borderColor: isSelected
                      ? "#0d3d35"
                      : "rgba(13, 61, 53, 0.08)",
                  }}
                >
                  <div
                    className="font-mono workout-day-label"
                    style={{
                      color: isSelected ? "#c4a87a" : "#6b7068",
                      letterSpacing: "0.25em",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {day.dayName?.slice(0, 3)} ·{" "}
                    {String(day.dayNumber).padStart(2, "0")}
                  </div>
                  <div
                    className="workout-day-focus"
                    style={{
                      color: isSelected ? "#f5f3ee" : "#1a1a1a",
                      fontFamily: "Inter",
                      fontWeight: 700,
                    }}
                  >
                    {day.isRestDay
                      ? "Rest Day"
                      : day.focus?.split(" ").slice(0, 2).join(" ")}
                  </div>
                  {isToday && !isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "6px",
                        width: "5px",
                        height: "5px",
                        borderRadius: "50%",
                        background: "#c4a87a",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="workout-content-grid">
          <div>
            {todayWorkout?.isRestDay ? (
              <div className="workout-rest-card">
                <div
                  className="font-mono"
                  style={{
                    fontSize: "10px",
                    color: "#c4a87a",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                    marginBottom: "0.75rem",
                  }}
                >
                  Recovery Day
                </div>
                <h2
                  className="font-display rest-card-title"
                  style={{
                    color: "#f5f3ee",
                    lineHeight: 1,
                    marginBottom: "1rem",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Rest & Recover.
                </h2>
                <p
                  className="rest-card-text"
                  style={{
                    color: "rgba(245, 243, 238, 0.65)",
                    fontFamily: "Inter",
                    lineHeight: 1.7,
                  }}
                >
                  Recovery is where the magic happens. Your muscles grow while
                  you rest. Stay hydrated and stretch lightly.
                </p>
              </div>
            ) : (
              <>
                {isWorkoutActive && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="workout-active-banner"
                  >
                    <div className="active-banner-top">
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <motion.div
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background: "#c4a87a",
                            flexShrink: 0,
                          }}
                        />
                        <div>
                          <div
                            className="font-mono active-banner-label"
                            style={{
                              color: "#c4a87a",
                              letterSpacing: "0.25em",
                              fontWeight: 700,
                              textTransform: "uppercase",
                              marginBottom: "2px",
                            }}
                          >
                            Workout Active
                          </div>
                          <div
                            className="font-display active-banner-count"
                            style={{ color: "#f5f3ee" }}
                          >
                            {completedExercises.length} / {totalExercises}{" "}
                            Complete
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={finishWorkout}
                        disabled={
                          completedExercises.length === 0 ||
                          completeMutation.isPending
                        }
                        className="active-banner-finish"
                        style={{
                          background:
                            completedExercises.length === 0
                              ? "rgba(245, 243, 238, 0.1)"
                              : "#c4a87a",
                          color:
                            completedExercises.length === 0
                              ? "rgba(245, 243, 238, 0.5)"
                              : "#0d3d35",
                          opacity: completedExercises.length === 0 ? 0.6 : 1,
                          cursor:
                            completedExercises.length === 0
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        <CheckCircle size={12} />
                        Finish
                      </button>
                    </div>
                    <div
                      style={{
                        marginTop: "0.875rem",
                        height: "3px",
                        background: "rgba(245, 243, 238, 0.1)",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <motion.div
                        animate={{ width: `${completionRate}%` }}
                        style={{ height: "100%", background: "#c4a87a" }}
                      />
                    </div>
                  </motion.div>
                )}

                <div className="premium-card workout-day-card">
                  <div className="day-card-header">
                    <div className="day-card-title-area">
                      <div
                        className="font-mono"
                        style={{
                          fontSize: "9px",
                          color: "#6b7068",
                          letterSpacing: "0.25em",
                          textTransform: "uppercase",
                          fontWeight: 700,
                          marginBottom: "4px",
                        }}
                      >
                        {todayWorkout?.dayName}
                      </div>
                      <h2
                        className="font-display day-card-title"
                        style={{ color: "#0d3d35", letterSpacing: "-0.02em" }}
                      >
                        {todayWorkout?.focus}
                      </h2>
                    </div>
                    <div className="day-card-stats">
                      <div style={{ textAlign: "right" }}>
                        <div
                          className="font-mono"
                          style={{
                            fontSize: "8px",
                            color: "#6b7068",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                          }}
                        >
                          Duration
                        </div>
                        <div
                          className="font-display day-stat-value"
                          style={{ color: "#0d3d35" }}
                        >
                          {todayWorkout?.totalDuration}
                          <span style={{ fontSize: "0.6em", color: "#6b7068" }}>
                            min
                          </span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          className="font-mono"
                          style={{
                            fontSize: "8px",
                            color: "#6b7068",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            fontWeight: 600,
                          }}
                        >
                          Calories
                        </div>
                        <div
                          className="font-display day-stat-value"
                          style={{ color: "#c4a87a" }}
                        >
                          {todayWorkout?.totalCalories}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    {todayWorkout?.warmup?.length > 0 && (
                      <ExerciseSection
                        title="Warmup"
                        exercises={todayWorkout.warmup}
                        isActive={isWorkoutActive}
                        completedExercises={completedExercises}
                        onToggle={toggleExerciseComplete}
                        baseIndex={0}
                        expandedExercise={expandedExercise}
                        setExpandedExercise={setExpandedExercise}
                      />
                    )}
                    {todayWorkout?.exercises?.length > 0 && (
                      <ExerciseSection
                        title="Main Workout"
                        exercises={todayWorkout.exercises}
                        isActive={isWorkoutActive}
                        completedExercises={completedExercises}
                        onToggle={toggleExerciseComplete}
                        baseIndex={todayWorkout?.warmup?.length || 0}
                        expandedExercise={expandedExercise}
                        setExpandedExercise={setExpandedExercise}
                      />
                    )}
                    {todayWorkout?.cooldown?.length > 0 && (
                      <ExerciseSection
                        title="Cooldown"
                        exercises={todayWorkout.cooldown}
                        isActive={isWorkoutActive}
                        completedExercises={completedExercises}
                        onToggle={toggleExerciseComplete}
                        baseIndex={
                          (todayWorkout?.warmup?.length || 0) +
                          (todayWorkout?.exercises?.length || 0)
                        }
                        expandedExercise={expandedExercise}
                        setExpandedExercise={setExpandedExercise}
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="workout-sidebar">
            <div className="premium-card sidebar-card">
              <h4
                className="font-mono sidebar-card-title"
                style={{
                  color: "#0d3d35",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  marginBottom: "1rem",
                }}
              >
                Day Summary
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {[
                  { label: "Focus", value: todayWorkout?.focus || "—" },
                  { label: "Type", value: todayWorkout?.type || "—" },
                  { label: "Exercises", value: totalExercises },
                ].map((item) => (
                  <div key={item.label} className="summary-row">
                    <span
                      className="font-mono summary-label"
                      style={{
                        color: "#6b7068",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="summary-value"
                      style={{
                        color: "#1a1a1a",
                        fontFamily: "Inter",
                        fontWeight: 700,
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {todayWorkout?.notes && (
              <div className="coach-note-card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                  }}
                >
                  <Info size={12} style={{ color: "#c4a87a" }} />
                  <span
                    className="font-mono note-label"
                    style={{
                      color: "#c4a87a",
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      fontWeight: 700,
                    }}
                  >
                    Coach Note
                  </span>
                </div>
                <p
                  className="note-text"
                  style={{
                    fontFamily: "Inter",
                    lineHeight: 1.65,
                    color: "rgba(245, 243, 238, 0.75)",
                  }}
                >
                  {todayWorkout.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .workout-page {
          max-width: 1400px;
          margin: 0 auto;
        }

        .workout-page-header {
          margin-bottom: 1.5rem;
        }

        .workout-header-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .workout-header-text {
          min-width: 0;
        }

        .workout-page-title {
          font-size: 1.5rem;
          line-height: 1.1;
        }

        .workout-header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .workout-switch-btn,
        .workout-start-btn-header {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          font-family: Inter;
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          flex: 1;
          justify-content: center;
        }

        .workout-switch-btn {
          background: #ffffff;
          color: #0d3d35;
          border: 1.5px solid #0d3d35;
        }

        .workout-start-btn-header {
          background: #0d3d35;
          color: #f5f3ee;
        }

        .workout-days-scroll {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 8px;
        }

        .workout-day-tab {
          flex-shrink: 0;
          min-width: 110px;
          padding: 10px 14px;
          border: 1px solid;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: left;
          position: relative;
        }

        .workout-day-label {
          font-size: 8px;
          margin-bottom: 4px;
        }

        .workout-day-focus {
          font-size: 12px;
        }

        .workout-content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        .workout-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .workout-rest-card {
          background: #0d3d35;
          border-radius: 16px;
          padding: 2.5rem 1.5rem;
          text-align: center;
          color: #f5f3ee;
        }

        .rest-card-title {
          font-size: 2rem;
        }

        .rest-card-text {
          font-size: 13px;
          max-width: 440px;
          margin: 0 auto;
        }

        .workout-active-banner {
          background: #0d3d35;
          color: #f5f3ee;
          padding: 1.25rem;
          border-radius: 14px;
          margin-bottom: 1.25rem;
        }

        .active-banner-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .active-banner-label {
          font-size: 9px;
        }

        .active-banner-count {
          font-size: 1rem;
        }

        .active-banner-finish {
          padding: 0.625rem 1rem;
          border: none;
          border-radius: 9999px;
          font-family: Inter;
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .workout-day-card {
          padding: 0;
          overflow: hidden;
        }

        .day-card-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1.25rem;
          border-bottom: 1px solid rgba(13, 61, 53, 0.06);
        }

        .day-card-title {
          font-size: 1.375rem;
        }

        .day-card-stats {
          display: flex;
          gap: 1.5rem;
        }

        .day-stat-value {
          font-size: 1.25rem;
        }

        .sidebar-card {
          padding: 1.25rem;
        }

        .sidebar-card-title {
          font-size: 9px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(13, 61, 53, 0.04);
        }

        .summary-label {
          font-size: 9px;
        }

        .summary-value {
          font-size: 11px;
        }

        .coach-note-card {
          background: linear-gradient(135deg, rgba(13, 61, 53, 0.08), rgba(13, 61, 53, 0.03));
          border: 1px solid rgba(13, 61, 53, 0.15);
          color: #0d3d35;
          padding: 1.25rem;
          border-radius: 14px;
        }

        .note-label {
          font-size: 9px;
        }

        .note-text {
          font-size: 12px;
        }

        @media (min-width: 480px) {
          .workout-page-title {
            font-size: 1.75rem;
          }
          .workout-switch-btn,
          .workout-start-btn-header {
            font-size: 11px;
            padding: 0.625rem 1.25rem;
          }
          .workout-day-tab {
            min-width: 130px;
            padding: 12px 16px;
          }
          .workout-day-label {
            font-size: 9px;
          }
          .workout-day-focus {
            font-size: 13px;
          }
          .rest-card-title {
            font-size: 2.5rem;
          }
          .rest-card-text {
            font-size: 14px;
          }
          .day-card-header {
            padding: 1.5rem;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
          .day-card-title {
            font-size: 1.5rem;
          }
          .day-stat-value {
            font-size: 1.375rem;
          }
          .active-banner-count {
            font-size: 1.125rem;
          }
        }

        @media (min-width: 768px) {
          .workout-header-content {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
          }
          .workout-page-title {
            font-size: 2rem;
          }
          .workout-header-actions {
            flex-shrink: 0;
          }
          .workout-switch-btn,
          .workout-start-btn-header {
            flex: 0 0 auto;
          }
          .workout-rest-card {
            padding: 4rem 2rem;
          }
          .rest-card-title {
            font-size: 3rem;
          }
        }

        @media (min-width: 1024px) {
          .workout-page-title {
            font-size: 2.25rem;
          }
          .workout-content-grid {
            grid-template-columns: 1fr 300px;
          }
          .workout-sidebar {
            gap: 1.25rem;
          }
          .day-card-header {
            padding: 1.75rem;
          }
          .day-card-title {
            font-size: 1.75rem;
          }
          .day-stat-value {
            font-size: 1.5rem;
          }
          .sidebar-card {
            padding: 1.5rem;
          }
          .coach-note-card {
            padding: 1.5rem;
          }
        }

        @media (min-width: 1280px) {
          .workout-content-grid {
            grid-template-columns: 1fr 340px;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

const ExerciseSection = ({
  title,
  exercises,
  isActive,
  completedExercises,
  onToggle,
  baseIndex,
  expandedExercise,
  setExpandedExercise,
}) => (
  <div>
    <div className="exercise-section-header">
      <span className="font-mono section-title-text">
        {title} · {exercises.length} Exercises
      </span>
    </div>
    <div>
      {exercises.map((exercise, i) => {
        const exIndex = baseIndex + i;
        const isExpanded = expandedExercise === exIndex;
        const isCompleted = completedExercises.includes(exIndex);

        return (
          <div
            key={i}
            className="exercise-row"
            style={{
              background: isCompleted
                ? "rgba(74, 124, 89, 0.04)"
                : "transparent",
            }}
          >
            <div className="exercise-row-inner">
              {isActive && (
                <button
                  onClick={() => onToggle(exIndex)}
                  className="exercise-check-btn"
                  style={{
                    borderColor: isCompleted
                      ? "#4a7c59"
                      : "rgba(13, 61, 53, 0.2)",
                    background: isCompleted ? "#4a7c59" : "transparent",
                  }}
                >
                  {isCompleted && (
                    <Check size={12} color="#f5f3ee" strokeWidth={3} />
                  )}
                </button>
              )}
              {!isActive && (
                <div className="exercise-number-badge">
                  {String(exIndex + 1).padStart(2, "0")}
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  className="exercise-name-text"
                  style={{
                    color: isCompleted ? "#6b7068" : "#1a1a1a",
                    textDecoration: isCompleted ? "line-through" : "none",
                  }}
                >
                  {exercise.name}
                </div>
                <div className="exercise-meta-row">
                  {exercise.sets && (
                    <span className="font-mono exercise-meta-pill">
                      {exercise.sets} sets
                    </span>
                  )}
                  {exercise.reps && (
                    <span className="font-mono exercise-meta-pill">
                      {exercise.reps.min}-{exercise.reps.max} reps
                    </span>
                  )}
                  {exercise.restTime && (
                    <span className="font-mono exercise-meta-pill">
                      {exercise.restTime}s
                    </span>
                  )}
                </div>
              </div>

              <div className="exercise-row-right">
                {exercise.calories && (
                  <span className="font-mono exercise-cal">
                    {exercise.calories}cal
                  </span>
                )}
                <button
                  onClick={() =>
                    setExpandedExercise(isExpanded ? null : exIndex)
                  }
                  className="exercise-expand-btn"
                >
                  {isExpanded ? (
                    <ChevronUp size={13} />
                  ) : (
                    <ChevronDown size={13} />
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="exercise-expanded-content">
                    {exercise.musclesWorked?.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "5px",
                          marginBottom: "0.875rem",
                          paddingTop: "0.875rem",
                        }}
                      >
                        {exercise.musclesWorked.map((muscle) => (
                          <span key={muscle} className="font-mono muscle-pill">
                            {muscle}
                          </span>
                        ))}
                        {exercise.difficulty && (
                          <span className="font-mono difficulty-pill">
                            {exercise.difficulty}
                          </span>
                        )}
                      </div>
                    )}

                    {exercise.instructions?.length > 0 && (
                      <div style={{ marginBottom: "0.875rem" }}>
                        <div className="font-mono instruction-label">
                          Instructions
                        </div>
                        <ol className="instruction-list">
                          {exercise.instructions.map((step, idx) => (
                            <li key={idx} className="instruction-item">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    {exercise.equipment?.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Target size={10} style={{ color: "#6b7068" }} />
                        <span className="equipment-text">
                          Equipment: {exercise.equipment.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>

    <style>{`
      .exercise-section-header {
        padding: 10px 1.25rem;
        background: #f5f3ee;
        border-bottom: 1px solid rgba(13, 61, 53, 0.04);
      }
      .section-title-text {
        font-size: 9px;
        color: #0d3d35;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        font-weight: 700;
      }
      .exercise-row {
        border-bottom: 1px solid rgba(13, 61, 53, 0.04);
        transition: background 0.3s;
      }
      .exercise-row-inner {
        padding: 1rem 1.25rem;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .exercise-check-btn {
        width: 22px;
        height: 22px;
        border: 2px solid;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .exercise-number-badge {
        width: 28px;
        height: 28px;
        background: #0d3d35;
        color: #c4a87a;
        border-radius: 7px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        font-family: Space Grotesk;
        font-size: 10px;
        font-weight: 700;
      }
      .exercise-name-text {
        font-size: 13px;
        font-family: Inter;
        font-weight: 700;
        margin-bottom: 3px;
      }
      .exercise-meta-row {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }
      .exercise-meta-pill {
        font-size: 10px;
        color: #6b7068;
        font-weight: 500;
      }
      .exercise-row-right {
        display: flex;
        align-items: center;
        gap: 6px;
        flex-shrink: 0;
      }
      .exercise-cal {
        font-size: 10px;
        color: #c4a87a;
        font-weight: 700;
        letter-spacing: 0.05em;
      }
      .exercise-expand-btn {
        width: 26px;
        height: 26px;
        background: #f5f3ee;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #6b7068;
      }
      .exercise-expanded-content {
        padding: 0 1.25rem 1.25rem 1.25rem;
        background: #fafafa;
      }
      .muscle-pill {
        padding: 3px 8px;
        background: #ffffff;
        border: 1px solid rgba(13, 61, 53, 0.08);
        border-radius: 5px;
        font-size: 9px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: #0d3d35;
        font-weight: 600;
      }
      .difficulty-pill {
        padding: 3px 8px;
        background: #0d3d35;
        color: #f5f3ee;
        border-radius: 5px;
        font-size: 9px;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        font-weight: 700;
      }
      .instruction-label {
        font-size: 9px;
        color: #6b7068;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        font-weight: 700;
        margin-bottom: 6px;
      }
      .instruction-list {
        padding-left: 1.125rem;
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .instruction-item {
        font-size: 11px;
        color: #2a2a2a;
        font-family: Inter;
        line-height: 1.6;
      }
      .equipment-text {
        font-size: 10px;
        color: #6b7068;
        font-family: Inter;
      }
      @media (min-width: 480px) {
        .exercise-section-header { padding: 12px 1.5rem; }
        .section-title-text { font-size: 10px; }
        .exercise-row-inner { padding: 1.125rem 1.5rem; gap: 14px; }
        .exercise-check-btn { width: 24px; height: 24px; }
        .exercise-number-badge { width: 32px; height: 32px; font-size: 11px; }
        .exercise-name-text { font-size: 14px; }
        .exercise-meta-pill { font-size: 11px; }
        .exercise-cal { font-size: 11px; }
        .exercise-expand-btn { width: 28px; height: 28px; }
        .exercise-expanded-content { padding: 0 1.5rem 1.5rem 1.5rem; }
        .instruction-item { font-size: 12px; }
      }
      @media (min-width: 1024px) {
        .exercise-section-header { padding: 12px 1.75rem; }
        .exercise-row-inner { padding: 1.25rem 1.75rem; }
        .exercise-expanded-content { padding: 0 1.75rem 1.5rem 1.75rem; }
      }
    `}</style>
  </div>
);

const PlanTypeSelector = ({
  onGenerate,
  isGenerating,
  currentType,
  onCancel,
}) => {
  const types = [
    {
      id: "gym",
      label: "Gym",
      desc: "Full equipment access with weights and machines",
      num: "01",
    },
    {
      id: "home",
      label: "Home",
      desc: "Bodyweight only — zero equipment needed",
      num: "02",
    },
    {
      id: "mixed",
      label: "Mixed",
      desc: "Flexible combination of gym and home",
      num: "03",
    },
  ];

  return (
    <div className="type-selector-page">
      {onCancel && (
        <button onClick={onCancel} className="type-back-btn">
          <ArrowLeft size={14} />
          Back to current plan
        </button>
      )}

      <div className="type-selector-header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "1rem",
          }}
        >
          <div
            style={{ width: "28px", height: "1.5px", background: "#c4a87a" }}
          />
          <span
            className="font-mono"
            style={{
              fontSize: "10px",
              color: "#c4a87a",
              letterSpacing: "0.3em",
              fontWeight: 700,
              textTransform: "uppercase",
            }}
          >
            {currentType ? "Change Type" : "Generate Plan"}
          </span>
        </div>
        <h1
          className="font-display type-selector-title"
          style={{
            color: "#0d3d35",
            lineHeight: 0.95,
            marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          Choose your workout style.
        </h1>
        <p
          className="type-selector-desc"
          style={{ color: "#6b7068", fontFamily: "Inter", lineHeight: 1.7 }}
        >
          {currentType
            ? `You're currently on the ${currentType} plan. Select a new type to regenerate.`
            : "Select your environment. AI will build a personalized workout plan."}
        </p>
      </div>

      <div className="type-options-grid">
        {types.map((type) => {
          const isCurrent = currentType === type.id;
          return (
            <motion.button
              key={type.id}
              onClick={() => !isGenerating && onGenerate(type.id)}
              disabled={isGenerating}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="type-option-card"
              style={{
                background: isCurrent ? "#0d3d35" : "#ffffff",
                color: isCurrent ? "#f5f3ee" : "#1a1a1a",
                borderColor: isCurrent ? "#0d3d35" : "rgba(13, 61, 53, 0.08)",
                opacity: isGenerating ? 0.6 : 1,
                cursor: isGenerating ? "wait" : "pointer",
              }}
            >
              {isCurrent && (
                <div className="font-mono current-badge">Current</div>
              )}
              <div
                className="font-mono type-num"
                style={{
                  color: isCurrent ? "#c4a87a" : "#9ca09a",
                  letterSpacing: "0.25em",
                  fontWeight: 700,
                }}
              >
                {type.num}
              </div>
              <div
                className="font-display type-label"
                style={{
                  color: isCurrent ? "#f5f3ee" : "#0d3d35",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                }}
              >
                {type.label}
              </div>
              <p
                className="type-desc"
                style={{
                  color: isCurrent ? "rgba(245, 243, 238, 0.6)" : "#6b7068",
                  fontFamily: "Inter",
                  lineHeight: 1.6,
                }}
              >
                {type.desc}
              </p>
            </motion.button>
          );
        })}
      </div>

      {isGenerating && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginTop: "2.5rem", textAlign: "center" }}
        >
          <div className="generating-pill">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw size={13} />
            </motion.div>
            <span
              className="font-mono"
              style={{
                fontSize: "11px",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              Generating Your Plan
            </span>
          </div>
        </motion.div>
      )}

      <style>{`
        .type-selector-page {
          max-width: 1100px;
          margin: 0 auto;
          padding: 1rem 0;
        }
        .type-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 0;
          background: transparent;
          border: none;
          color: #6b7068;
          font-family: Inter;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          margin-bottom: 1.5rem;
        }
        .type-selector-header {
          margin-bottom: 2.5rem;
        }
        .type-selector-title {
          font-size: clamp(1.75rem, 5vw, 3.5rem);
        }
        .type-selector-desc {
          font-size: 13px;
          max-width: 500px;
        }
        .type-options-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
        }
        .type-option-card {
          position: relative;
          padding: 1.75rem 1.5rem;
          border: 1.5px solid;
          border-radius: 14px;
          text-align: left;
          transition: all 0.3s;
        }
        .current-badge {
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 3px 8px;
          background: #c4a87a;
          color: #0d3d35;
          border-radius: 4px;
          font-size: 8px;
          letter-spacing: 0.2em;
          font-weight: 700;
          text-transform: uppercase;
        }
        .type-num {
          font-size: 10px;
          margin-bottom: 1rem;
        }
        .type-label {
          font-size: 2rem;
          margin-bottom: 0.75rem;
        }
        .type-desc {
          font-size: 12px;
        }
        .generating-pill {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 12px 24px;
          background: #0d3d35;
          color: #c4a87a;
          border-radius: 9999px;
        }
        @media (min-width: 480px) {
          .type-selector-desc {
            font-size: 14px;
          }
          .type-option-card {
            padding: 2rem 1.75rem;
          }
          .type-label {
            font-size: 2.5rem;
          }
          .type-desc {
            font-size: 13px;
          }
        }
        @media (min-width: 768px) {
          .type-options-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 1.25rem;
          }
        }
        @media (min-width: 1024px) {
          .type-selector-header {
            margin-bottom: 3.5rem;
          }
          .type-option-card {
            padding: 2.5rem 2rem;
          }
          .type-label {
            font-size: 3rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Workout;

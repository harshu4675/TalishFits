import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Clock, Flame, Dumbbell } from "lucide-react";

const workouts = [
  {
    num: "01",
    title: "Upper Body Power",
    focus: "Chest · Shoulders · Arms",
    duration: "45 min",
    calories: "380 cal",
    difficulty: "Intermediate",
  },
  {
    num: "02",
    title: "Athletic HIIT",
    focus: "Full Body · Cardio",
    duration: "30 min",
    calories: "520 cal",
    difficulty: "Advanced",
  },
  {
    num: "03",
    title: "Core Destroyer",
    focus: "Abs · Obliques · Core",
    duration: "25 min",
    calories: "280 cal",
    difficulty: "Beginner",
  },
  {
    num: "04",
    title: "Leg Day Beast",
    focus: "Quads · Hamstrings · Glutes",
    duration: "50 min",
    calories: "450 cal",
    difficulty: "Advanced",
  },
];

const WorkoutShowcase = () => {
  const navigate = useNavigate();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      ref={ref}
      id="workouts"
      style={{
        position: "relative",
        padding: "clamp(4rem, 8vw, 8rem) 0",
        backgroundColor: "#e8ebe5",
      }}
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: "2rem",
            marginBottom: "4rem",
          }}
        >
          <div style={{ maxWidth: "600px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "1.5px",
                  background: "#0d3d35",
                }}
              />
              <span
                className="font-mono"
                style={{
                  fontSize: "11px",
                  color: "#0d3d35",
                  letterSpacing: "0.3em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Our Workouts
              </span>
            </div>
            <h2 className="text-display">Built for your body</h2>
          </div>

          <button
            onClick={() => navigate("/signup")}
            className="btn-secondary"
            style={{ padding: "0.875rem 1.75rem", fontSize: "11px" }}
          >
            View All Workouts
            <ArrowRight size={13} />
          </button>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {workouts.map((workout, i) => (
            <motion.div
              key={workout.title}
              className="premium-card"
              style={{ cursor: "pointer", overflow: "hidden" }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i }}
              whileHover={{ y: -8 }}
              onClick={() => navigate("/signup")}
            >
              <div
                style={{
                  background: "#0d3d35",
                  padding: "2rem",
                  position: "relative",
                  minHeight: "180px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "11px",
                      color: "#c4a87a",
                      letterSpacing: "0.25em",
                      fontWeight: 700,
                    }}
                  >
                    {workout.num}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      padding: "0.25rem 0.625rem",
                      background: "rgba(245, 243, 238, 0.1)",
                      borderRadius: "9999px",
                      fontSize: "9px",
                      color: "#f5f3ee",
                      letterSpacing: "0.2em",
                      fontWeight: 700,
                      textTransform: "uppercase",
                    }}
                  >
                    {workout.difficulty}
                  </span>
                </div>

                <Dumbbell
                  size={48}
                  strokeWidth={1.5}
                  style={{
                    color: "rgba(245, 243, 238, 0.2)",
                    alignSelf: "flex-end",
                  }}
                />
              </div>

              <div style={{ padding: "1.5rem", background: "#f5f3ee" }}>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontFamily: "Archivo Black",
                    color: "#0d3d35",
                    marginBottom: "0.375rem",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {workout.title}
                </h3>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6b7068",
                    fontFamily: "Inter",
                    marginBottom: "1.25rem",
                  }}
                >
                  {workout.focus}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "1.25rem",
                    paddingTop: "1rem",
                    borderTop: "1px solid rgba(13, 61, 53, 0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Clock size={11} style={{ color: "#0d3d35" }} />
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#2a2a2a",
                        fontFamily: "Inter",
                        fontWeight: 500,
                      }}
                    >
                      {workout.duration}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Flame size={11} style={{ color: "#c4a87a" }} />
                    <span
                      style={{
                        fontSize: "11px",
                        color: "#2a2a2a",
                        fontFamily: "Inter",
                        fontWeight: 500,
                      }}
                    >
                      {workout.calories}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkoutShowcase;

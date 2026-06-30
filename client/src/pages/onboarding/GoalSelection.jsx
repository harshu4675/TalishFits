import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, Clock, Signal } from "lucide-react";
import { SpinLoader } from "../../components/ui/Loader";

const GOALS = [
  {
    id: "lean",
    label: "Lean Body",
    description: "Build a lean, defined physique with low body fat",
    expectedTime: "12-16 weeks",
    difficulty: "Moderate",
    num: "01",
  },
  {
    id: "athletic",
    label: "Athletic",
    description: "Develop explosive power, speed, and agility",
    expectedTime: "8-12 weeks",
    difficulty: "Hard",
    num: "02",
  },
  {
    id: "muscular",
    label: "Muscular",
    description: "Build significant muscle mass and raw strength",
    expectedTime: "16-24 weeks",
    difficulty: "Hard",
    num: "03",
  },
  {
    id: "bodybuilder",
    label: "Bodybuilder",
    description: "Achieve a competition-ready physique",
    expectedTime: "24-52 weeks",
    difficulty: "Elite",
    num: "04",
  },
  {
    id: "fat_loss",
    label: "Fat Loss",
    description: "Maximum fat burning while preserving muscle",
    expectedTime: "8-16 weeks",
    difficulty: "Moderate",
    num: "05",
  },
  {
    id: "six_pack",
    label: "Six Pack",
    description: "Achieve visible six-pack abs",
    expectedTime: "12-20 weeks",
    difficulty: "Hard",
    num: "06",
  },
  {
    id: "v_shape",
    label: "V-Shape",
    description: "Wide shoulders with narrow waist taper",
    expectedTime: "16-24 weeks",
    difficulty: "Hard",
    num: "07",
  },
  {
    id: "womens_toned",
    label: "Women's Toned",
    description: "Lean, toned feminine physique",
    expectedTime: "12-16 weeks",
    difficulty: "Moderate",
    num: "08",
  },
  {
    id: "powerlifting",
    label: "Powerlifting",
    description: "Maximize raw strength in compound lifts",
    expectedTime: "16-24 weeks",
    difficulty: "Elite",
    num: "09",
  },
  {
    id: "functional_fitness",
    label: "Functional",
    description: "Practical strength for everyday life",
    expectedTime: "8-12 weeks",
    difficulty: "Easy",
    num: "10",
  },
];

const GoalSelection = ({ onSelect, isSubmitting, gender }) => {
  const [selectedGoal, setSelectedGoal] = useState(null);

  const filteredGoals = GOALS.filter((goal) => {
    if (gender === "female") {
      return (
        !["v_shape", "bodybuilder"].includes(goal.id) ||
        goal.id === "womens_toned"
      );
    }
    if (gender === "male") {
      return goal.id !== "womens_toned";
    }
    return true;
  });

  const handleConfirm = () => {
    if (selectedGoal && !isSubmitting) {
      onSelect(selectedGoal);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          maxWidth: "700px",
          margin: "0 auto 3rem auto",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{ width: "32px", height: "1.5px", background: "#c4a87a" }}
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
            Final Step
          </span>
          <div
            style={{ width: "32px", height: "1.5px", background: "#c4a87a" }}
          />
        </div>
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            color: "#0d3d35",
            marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          What body do you want?
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7068",
            fontFamily: "Inter",
            lineHeight: 1.7,
          }}
        >
          Select your dream physique. Our AI will generate a complete roadmap,
          workout plan, and diet chart for your goal.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "14px",
          maxWidth: "1000px",
          margin: "0 auto 3rem auto",
        }}
      >
        {filteredGoals.map((goal) => {
          const isSelected = selectedGoal === goal.id;

          return (
            <motion.button
              key={goal.id}
              onClick={() => !isSubmitting && setSelectedGoal(goal.id)}
              whileHover={!isSubmitting ? { y: -6 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              style={{
                position: "relative",
                padding: "1.5rem",
                background: isSelected ? "#0d3d35" : "#ffffff",
                color: isSelected ? "#f5f3ee" : "#1a1a1a",
                border: "1.5px solid",
                borderColor: isSelected ? "#0d3d35" : "rgba(13, 61, 53, 0.08)",
                borderRadius: "14px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
                textAlign: "left",
                transition: "all 0.3s",
                opacity: isSubmitting && !isSelected ? 0.5 : 1,
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "#c4a87a",
                    color: "#0d3d35",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "Space Grotesk",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  ✓
                </div>
              )}

              <span
                className="font-mono"
                style={{
                  fontSize: "10px",
                  color: isSelected ? "#c4a87a" : "#9ca09a",
                  letterSpacing: "0.25em",
                  fontWeight: 700,
                  display: "block",
                  marginBottom: "1rem",
                }}
              >
                {goal.num}
              </span>

              <h3
                className="font-display"
                style={{
                  fontSize: "1.5rem",
                  color: isSelected ? "#f5f3ee" : "#0d3d35",
                  marginBottom: "8px",
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                }}
              >
                {goal.label}
              </h3>

              <p
                style={{
                  fontSize: "11px",
                  color: isSelected ? "rgba(245, 243, 238, 0.6)" : "#6b7068",
                  fontFamily: "Inter",
                  lineHeight: 1.5,
                  marginBottom: "1rem",
                }}
              >
                {goal.description}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid",
                  borderColor: isSelected
                    ? "rgba(245, 243, 238, 0.1)"
                    : "rgba(13, 61, 53, 0.08)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Clock
                    size={10}
                    style={{ color: isSelected ? "#c4a87a" : "#9ca09a" }}
                  />
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "9px",
                      color: isSelected
                        ? "rgba(245, 243, 238, 0.6)"
                        : "#9ca09a",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                    }}
                  >
                    {goal.expectedTime}
                  </span>
                </div>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
                >
                  <Signal
                    size={10}
                    style={{ color: isSelected ? "#c4a87a" : "#9ca09a" }}
                  />
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "9px",
                      color: isSelected
                        ? "rgba(245, 243, 238, 0.6)"
                        : "#9ca09a",
                      letterSpacing: "0.1em",
                      fontWeight: 600,
                    }}
                  >
                    {goal.difficulty}
                  </span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div style={{ textAlign: "center" }}>
        <motion.button
          onClick={handleConfirm}
          disabled={!selectedGoal || isSubmitting}
          whileHover={selectedGoal && !isSubmitting ? { y: -2 } : {}}
          whileTap={selectedGoal && !isSubmitting ? { scale: 0.97 } : {}}
          className="btn-primary"
          style={{ padding: "1.125rem 3rem", fontSize: "13px" }}
        >
          {isSubmitting ? (
            <>
              <SpinLoader size="sm" color="light" />
              Building your roadmap...
            </>
          ) : (
            <>
              Start My Transformation
              <ChevronRight size={15} />
            </>
          )}
        </motion.button>

        {selectedGoal && !isSubmitting && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontSize: "11px",
              color: "#9ca09a",
              fontFamily: "Inter",
              marginTop: "12px",
            }}
          >
            AI will generate your complete workout, diet, and roadmap
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default GoalSelection;

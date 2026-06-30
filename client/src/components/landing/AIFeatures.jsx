import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Brain, Cpu, Layers, Activity } from "lucide-react";

const AIFeatures = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        padding: "clamp(4rem, 8vw, 8rem) 0",
        backgroundColor: "#0d3d35",
        overflow: "hidden",
      }}
    >
      <div className="section-container">
        <div
          className="ai-features-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "3rem",
            alignItems: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div
              className="ai-visual-card"
              style={{
                width: "100%",
                maxWidth: "420px",
                margin: "0 auto",
                aspectRatio: "4/5",
                background: "#1a5d52",
                borderRadius: "1.5rem",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(245, 243, 238, 0.1)",
              }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="ai-orbit-outer"
                style={{
                  borderRadius: "50%",
                  border: "1px solid rgba(245, 243, 238, 0.15)",
                  position: "absolute",
                }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="ai-orbit-inner"
                style={{
                  borderRadius: "50%",
                  border: "1px solid rgba(245, 243, 238, 0.1)",
                  position: "absolute",
                }}
              />

              <motion.div
                className="ai-brain-icon"
                style={{
                  borderRadius: "24px",
                  background: "#f5f3ee",
                  color: "#0d3d35",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 10,
                  boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
                }}
                animate={{ scale: [1, 1.08, 1] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Brain className="ai-brain-svg" strokeWidth={1.5} />
              </motion.div>

              <div
                className="ai-status-card"
                style={{
                  position: "absolute",
                  background: "rgba(13, 61, 53, 0.6)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "0.75rem",
                  border: "1px solid rgba(245, 243, 238, 0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#c4a87a",
                    }}
                  />
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "10px",
                      color: "#c4a87a",
                      letterSpacing: "0.25em",
                      fontWeight: 700,
                    }}
                  >
                    ANALYZING
                  </span>
                </div>
                {[
                  "Body composition",
                  "Nutrition optimization",
                  "Recovery planning",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "0.375rem",
                    }}
                    initial={{ opacity: 0, x: -10 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 1 + i * 0.3 }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#f5f3ee",
                        fontFamily: "Inter",
                        fontWeight: 500,
                      }}
                    >
                      {item}
                    </span>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: "10px",
                        color: "#c4a87a",
                        letterSpacing: "0.1em",
                        fontWeight: 600,
                      }}
                    >
                      DONE
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
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
                  background: "#c4a87a",
                }}
              />
              <span
                className="font-mono"
                style={{
                  fontSize: "11px",
                  color: "#c4a87a",
                  letterSpacing: "0.3em",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                AI Intelligence
              </span>
            </div>
            <h2
              className="text-display"
              style={{ color: "#f5f3ee", marginBottom: "1.5rem" }}
            >
              Your personal AI fitness coach.
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "rgba(245, 243, 238, 0.6)",
                fontFamily: "Inter",
                lineHeight: 1.7,
                marginBottom: "2.5rem",
                maxWidth: "480px",
              }}
            >
              Powered by advanced intelligence that understands your body,
              adapts to your progress, and evolves your program in real-time.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.25rem",
              }}
            >
              {[
                {
                  num: "01",
                  icon: Layers,
                  title: "Personalized Meal Plans",
                  desc: "Veg, non-veg, vegan, or Indian — perfectly balanced for your macros.",
                },
                {
                  num: "02",
                  icon: Activity,
                  title: "Adaptive Workouts",
                  desc: "Programs that evolve weekly based on your performance and recovery.",
                },
                {
                  num: "03",
                  icon: Cpu,
                  title: "Smart Recovery",
                  desc: "Sleep, stretching, and supplement recommendations for your intensity.",
                },
                {
                  num: "04",
                  icon: Brain,
                  title: "Exercise Coaching",
                  desc: "Form tips, common mistakes, and alternatives for every movement.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  style={{
                    display: "flex",
                    gap: "1.25rem",
                    paddingBottom: "1.25rem",
                    borderBottom: "1px solid rgba(245, 243, 238, 0.08)",
                  }}
                >
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "11px",
                      color: "#c4a87a",
                      letterSpacing: "0.2em",
                      fontWeight: 700,
                      marginTop: "4px",
                      minWidth: "28px",
                    }}
                  >
                    {item.num}
                  </span>
                  <div>
                    <h4
                      style={{
                        fontSize: "15px",
                        fontFamily: "Archivo Black",
                        color: "#f5f3ee",
                        marginBottom: "0.375rem",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {item.title}
                    </h4>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "rgba(245, 243, 238, 0.55)",
                        fontFamily: "Inter",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        .ai-orbit-outer {
          width: 220px;
          height: 220px;
        }

        .ai-orbit-inner {
          width: 160px;
          height: 160px;
        }

        .ai-brain-icon {
          width: 80px;
          height: 80px;
        }

        .ai-brain-svg {
          width: 34px;
          height: 34px;
        }

        .ai-status-card {
          bottom: 1rem;
          left: 1rem;
          right: 1rem;
          padding: 0.875rem;
        }

        @media (min-width: 640px) {
          .ai-orbit-outer {
            width: 260px;
            height: 260px;
          }

          .ai-orbit-inner {
            width: 190px;
            height: 190px;
          }

          .ai-brain-icon {
            width: 90px;
            height: 90px;
          }

          .ai-brain-svg {
            width: 38px;
            height: 38px;
          }

          .ai-status-card {
            bottom: 1.5rem;
            left: 1.5rem;
            right: 1.5rem;
            padding: 1rem;
          }
        }

        @media (min-width: 1024px) {
          .ai-features-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 5rem !important;
          }

          .ai-orbit-outer {
            width: 280px;
            height: 280px;
          }

          .ai-orbit-inner {
            width: 200px;
            height: 200px;
          }

          .ai-brain-icon {
            width: 96px;
            height: 96px;
          }

          .ai-brain-svg {
            width: 40px;
            height: 40px;
          }
        }
      `}</style>
    </section>
  );
};

export default AIFeatures;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    description: "Begin your transformation",
    popular: false,
    features: [
      "Basic AI Workout Plan",
      "BMI & Body Analysis",
      "Basic Diet Suggestions",
      "Progress Tracking (7 days)",
      "Community Access",
    ],
    cta: "Start Free",
  },
  {
    name: "Pro",
    price: { monthly: 9.99, yearly: 7.99 },
    description: "For serious athletes",
    popular: true,
    features: [
      "Everything in Starter",
      "Advanced AI Coaching",
      "Full Diet Plans + Recipes",
      "Unlimited Progress History",
      "Custom Workout Builder",
      "Recovery & Sleep Analysis",
      "Supplement Guidance",
      "Priority Support",
    ],
    cta: "Go Pro",
  },
  {
    name: "Elite",
    price: { monthly: 19.99, yearly: 14.99 },
    description: "Ultimate experience",
    popular: false,
    features: [
      "Everything in Pro",
      "Unlimited AI Coaching",
      "3D Body Visualization",
      "Personal Trainer Access",
      "Progress PDF Reports",
      "Family Sharing (3 members)",
      "Early Access Features",
    ],
    cta: "Go Elite",
  },
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);
  const navigate = useNavigate();
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      ref={ref}
      id="pricing"
      style={{
        position: "relative",
        padding: "8rem 0",
        backgroundColor: "#e8ebe5",
      }}
    >
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: "center",
            maxWidth: "600px",
            margin: "0 auto 3rem auto",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{ width: "40px", height: "1.5px", background: "#0d3d35" }}
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
              Pricing
            </span>
            <div
              style={{ width: "40px", height: "1.5px", background: "#0d3d35" }}
            />
          </div>
          <h2 className="text-display">Choose your plan.</h2>
        </motion.div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "4rem",
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontFamily: "Inter",
              fontWeight: 600,
              color: !isYearly ? "#0d3d35" : "#6b7068",
            }}
          >
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            style={{
              position: "relative",
              width: "52px",
              height: "28px",
              borderRadius: "9999px",
              padding: "3px",
              background: "#0d3d35",
              border: "none",
              cursor: "pointer",
            }}
          >
            <motion.div
              style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: "#f5f3ee",
              }}
              animate={{ x: isYearly ? 24 : 0 }}
              transition={{ duration: 0.3 }}
            />
          </button>
          <span
            style={{
              fontSize: "13px",
              fontFamily: "Inter",
              fontWeight: 600,
              color: isYearly ? "#0d3d35" : "#6b7068",
            }}
          >
            Yearly
          </span>
          {isYearly && (
            <span
              className="font-mono"
              style={{
                padding: "4px 10px",
                background: "#c4a87a",
                color: "#0d3d35",
                fontSize: "10px",
                letterSpacing: "0.2em",
                fontWeight: 700,
                borderRadius: "9999px",
              }}
            >
              SAVE 20%
            </span>
          )}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            maxWidth: "1000px",
            margin: "0 auto",
          }}
        >
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 * i }}
              style={{
                background: plan.popular ? "#0d3d35" : "#ffffff",
                color: plan.popular ? "#f5f3ee" : "#1a1a1a",
                borderRadius: "1.25rem",
                padding: "2.5rem 2rem",
                display: "flex",
                flexDirection: "column",
                border: "1px solid",
                borderColor: plan.popular
                  ? "#0d3d35"
                  : "rgba(13, 61, 53, 0.08)",
                position: "relative",
                transition: "all 0.4s",
              }}
              whileHover={{ y: -6 }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#c4a87a",
                    color: "#0d3d35",
                    padding: "5px 14px",
                    borderRadius: "9999px",
                    fontSize: "10px",
                    fontFamily: "Space Grotesk",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  Most Popular
                </div>
              )}

              <div style={{ marginBottom: "2rem" }}>
                <h3
                  className="font-display"
                  style={{
                    fontSize: "1.75rem",
                    color: plan.popular ? "#f5f3ee" : "#0d3d35",
                    marginBottom: "0.375rem",
                  }}
                >
                  {plan.name}
                </h3>
                <p
                  style={{
                    fontSize: "12px",
                    color: plan.popular
                      ? "rgba(245, 243, 238, 0.6)"
                      : "#6b7068",
                    fontFamily: "Inter",
                  }}
                >
                  {plan.description}
                </p>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={isYearly ? "y" : "m"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{ marginBottom: "2rem" }}
                >
                  <span
                    className="font-display"
                    style={{
                      fontSize: "3rem",
                      color: plan.popular ? "#f5f3ee" : "#0d3d35",
                    }}
                  >
                    ${isYearly ? plan.price.yearly : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span
                      style={{
                        fontSize: "13px",
                        color: plan.popular
                          ? "rgba(245, 243, 238, 0.5)"
                          : "#6b7068",
                        fontFamily: "Inter",
                        marginLeft: "4px",
                      }}
                    >
                      /mo
                    </span>
                  )}
                </motion.div>
              </AnimatePresence>

              <div
                style={{
                  height: "1px",
                  background: plan.popular
                    ? "rgba(245, 243, 238, 0.1)"
                    : "rgba(13, 61, 53, 0.08)",
                  marginBottom: "1.5rem",
                }}
              />

              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  flex: 1,
                  marginBottom: "2rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.875rem",
                }}
              >
                {plan.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        background: plan.popular ? "#c4a87a" : "#0d3d35",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                    >
                      <Check
                        size={10}
                        color={plan.popular ? "#0d3d35" : "#f5f3ee"}
                        strokeWidth={3}
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "13px",
                        color: plan.popular
                          ? "rgba(245, 243, 238, 0.85)"
                          : "#2a2a2a",
                        fontFamily: "Inter",
                        lineHeight: 1.5,
                      }}
                    >
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/signup")}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  borderRadius: "9999px",
                  fontFamily: "Inter",
                  fontWeight: 700,
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  background: plan.popular ? "#c4a87a" : "#0d3d35",
                  color: plan.popular ? "#0d3d35" : "#f5f3ee",
                  border: "none",
                  transition: "all 0.3s",
                }}
              >
                {plan.cta} <ArrowRight size={13} />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Brain,
  Dumbbell,
  UtensilsCrossed,
  TrendingUp,
  BarChart3,
  Trophy,
  Bell,
  Shield,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Intelligence",
    description:
      "Smart algorithms analyze your body, habits, and goals to create perfectly tailored programs.",
  },
  {
    icon: Dumbbell,
    title: "Custom Workouts",
    description:
      "Gym, home, or outdoor — every exercise selected specifically for your body and goal.",
  },
  {
    icon: UtensilsCrossed,
    title: "Smart Nutrition",
    description:
      "Personalized meal plans with recipes, alternatives, and shopping lists for your preference.",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description:
      "Visual dashboards with weight, BMI, body measurements, and transformation insights.",
  },
  {
    icon: BarChart3,
    title: "Body Analytics",
    description:
      "BMI, BMR, TDEE, body fat estimates, and macro calculations — all automated.",
  },
  {
    icon: Trophy,
    title: "Achievements",
    description:
      "Gamified milestones, streaks, badges, and XP to keep you motivated every day.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description:
      "Water, meals, workouts, and sleep reminders with motivational quotes.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description:
      "Your health data is encrypted and never shared. Your body, your data, your rules.",
  },
];

const Features = () => {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      ref={ref}
      id="features"
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
          style={{ maxWidth: "700px", marginBottom: "5rem" }}
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
              Our Features
            </span>
          </div>
          <h2 className="text-display" style={{ marginBottom: "1.5rem" }}>
            Everything you need to transform.
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#6b7068",
              lineHeight: 1.7,
              fontFamily: "Inter",
              maxWidth: "520px",
            }}
          >
            Built for serious athletes, designed for everyone. Every feature
            exists because your transformation demands it.
          </p>
        </motion.div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              className="premium-card"
              style={{ padding: "2rem", cursor: "pointer" }}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: 0.05 * i,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -8 }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1.5rem",
                  background: "#0d3d35",
                  color: "#f5f3ee",
                }}
              >
                <feature.icon size={22} strokeWidth={2} />
              </div>
              <h3
                style={{
                  fontSize: "1.125rem",
                  fontFamily: "Archivo Black",
                  color: "#0d3d35",
                  marginBottom: "0.625rem",
                  letterSpacing: "-0.01em",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "13px",
                  color: "#6b7068",
                  fontFamily: "Inter",
                  lineHeight: 1.65,
                }}
              >
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

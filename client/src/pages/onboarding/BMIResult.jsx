import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Activity,
  Flame,
  Droplets,
  Scale,
  Target,
  Heart,
  Zap,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const AnimatedMetric = ({
  value,
  suffix = "",
  label,
  icon: Icon,
  delay = 0,
}) => {
  const countRef = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!countRef.current) return;
    const target = Math.round(value);
    if (target === 0) {
      countRef.current.textContent = "0";
      return;
    }

    setTimeout(() => {
      const duration = 1800;
      const start = performance.now();
      const run = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        if (countRef.current)
          countRef.current.textContent = Math.round(
            target * eased,
          ).toLocaleString();
        if (p < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    }, delay * 1000);
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      style={{
        padding: "1.5rem",
        background: "#ffffff",
        border: "1px solid rgba(13, 61, 53, 0.08)",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          background: "#0d3d35",
          color: "#f5f3ee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "12px",
        }}
      >
        <Icon size={16} strokeWidth={2} />
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
        <span
          ref={countRef}
          className="font-display"
          style={{ fontSize: "1.75rem", color: "#0d3d35", lineHeight: 1 }}
        >
          0
        </span>
        <span
          className="font-mono"
          style={{
            fontSize: "11px",
            color: "#c4a87a",
            fontWeight: 700,
            letterSpacing: "0.1em",
          }}
        >
          {suffix}
        </span>
      </div>
      <p
        style={{
          fontSize: "11px",
          color: "#6b7068",
          fontFamily: "Inter",
          marginTop: "4px",
        }}
      >
        {label}
      </p>
    </motion.div>
  );
};

const BMIResult = ({ results, onNext }) => {
  if (!results) return null;

  const getBMIColor = (bmi) => {
    if (bmi < 18.5) return "#c4823a";
    if (bmi < 25) return "#4a7c59";
    if (bmi < 30) return "#c4823a";
    return "#a84838";
  };

  const bmiColor = getBMIColor(results.bmi);
  const bmiPercentage = Math.min(((results.bmi - 10) / 30) * 100, 100);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "2.5rem",
          maxWidth: "600px",
          margin: "0 auto 2.5rem auto",
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
            Step 07
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
          Your body analysis.
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7068",
            fontFamily: "Inter",
            lineHeight: 1.7,
          }}
        >
          Here's what our AI found. These numbers power your personalized
          program.
        </p>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto 2rem auto" }}>
        <div
          style={{
            background: "#0d3d35",
            borderRadius: "16px",
            padding: "2rem",
            color: "#f5f3ee",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "1.5rem",
            }}
          >
            <Activity size={14} style={{ color: "#c4a87a" }} />
            <span
              className="font-mono"
              style={{
                fontSize: "10px",
                color: "#c4a87a",
                letterSpacing: "0.25em",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              Body Mass Index
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "12px",
              marginBottom: "8px",
            }}
          >
            <motion.span
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
              className="font-display"
              style={{ fontSize: "4.5rem", color: "#f5f3ee", lineHeight: 1 }}
            >
              {results.bmi?.toFixed(1)}
            </motion.span>
            <span
              className="font-mono"
              style={{
                fontSize: "13px",
                color: "rgba(245, 243, 238, 0.5)",
                letterSpacing: "0.2em",
                fontWeight: 600,
              }}
            >
              BMI
            </span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              fontSize: "13px",
              fontFamily: "Inter",
              fontWeight: 700,
              color: bmiColor,
              marginBottom: "1.5rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {results.bmiCategory}
          </motion.p>

          <div
            style={{
              position: "relative",
              height: "6px",
              borderRadius: "3px",
              overflow: "hidden",
              marginBottom: "8px",
            }}
          >
            <div style={{ position: "absolute", inset: 0, display: "flex" }}>
              <div style={{ flex: 1, background: "rgba(196, 130, 58, 0.4)" }} />
              <div style={{ flex: 1, background: "rgba(74, 124, 89, 0.4)" }} />
              <div style={{ flex: 1, background: "rgba(196, 130, 58, 0.4)" }} />
              <div style={{ flex: 1, background: "rgba(168, 72, 56, 0.4)" }} />
            </div>
            <motion.div
              initial={{ left: "0%" }}
              animate={{ left: `${bmiPercentage}%` }}
              transition={{
                delay: 0.5,
                duration: 1.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                position: "absolute",
                top: "-3px",
                width: "4px",
                height: "12px",
                background: "#f5f3ee",
                borderRadius: "2px",
              }}
            />
          </div>
          <div
            className="font-mono"
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "8px",
              color: "rgba(245, 243, 238, 0.4)",
              letterSpacing: "0.15em",
              fontWeight: 600,
            }}
          >
            <span>UNDER</span>
            <span>NORMAL</span>
            <span>OVER</span>
            <span>OBESE</span>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "14px",
          padding: "1.25rem",
          background: "#d8e0d4",
          borderRadius: "12px",
          maxWidth: "600px",
          margin: "0 auto 2rem auto",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "#0d3d35",
            color: "#f5f3ee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {results.weightStatus?.status === "lose" ? (
            <TrendingDown size={18} />
          ) : results.weightStatus?.status === "gain" ? (
            <TrendingUp size={18} />
          ) : (
            <Target size={18} />
          )}
        </div>
        <div>
          <p
            style={{
              fontSize: "14px",
              fontFamily: "Inter",
              fontWeight: 700,
              color: "#0d3d35",
              marginBottom: "4px",
            }}
          >
            {results.weightStatus?.status === "maintain"
              ? "You're at a healthy weight"
              : results.weightStatus?.status === "lose"
                ? `Target: Lose ${results.weightStatus.toLose?.toFixed(1)}kg`
                : `Target: Gain ${results.weightStatus.toGain?.toFixed(1)}kg`}
          </p>
          <p
            style={{
              fontSize: "12px",
              color: "#2a2a2a",
              fontFamily: "Inter",
              lineHeight: 1.5,
            }}
          >
            {results.weightStatus?.message}
          </p>
        </div>
      </motion.div>

      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto 2rem auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "12px",
        }}
      >
        <AnimatedMetric
          value={results.bmr}
          suffix="cal"
          label="Basal Metabolic Rate"
          icon={Flame}
          delay={0.2}
        />
        <AnimatedMetric
          value={results.tdee}
          suffix="cal"
          label="Daily Energy Burn"
          icon={Zap}
          delay={0.3}
        />
        <AnimatedMetric
          value={results.idealWeight}
          suffix="kg"
          label="Ideal Body Weight"
          icon={Scale}
          delay={0.4}
        />
        <AnimatedMetric
          value={results.bodyFatEstimate}
          suffix="%"
          label="Body Fat Estimate"
          icon={Heart}
          delay={0.5}
        />
        <AnimatedMetric
          value={results.dailyWaterIntake}
          suffix="L"
          label="Daily Water Target"
          icon={Droplets}
          delay={0.6}
        />
        <AnimatedMetric
          value={results.macros?.protein || 0}
          suffix="g"
          label="Daily Protein"
          icon={Target}
          delay={0.7}
        />
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto 2rem auto" }}>
        <div
          style={{
            padding: "1.5rem",
            background: "#ffffff",
            border: "1px solid rgba(13, 61, 53, 0.08)",
            borderRadius: "12px",
          }}
        >
          <h4
            className="font-mono"
            style={{
              fontSize: "10px",
              color: "#0d3d35",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: "1.25rem",
            }}
          >
            Daily Macro Split
          </h4>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            {[
              {
                label: "Protein",
                value: results.macros?.protein,
                unit: "g",
                color: "#0d3d35",
                max: (results.macros?.protein || 0) + 50,
              },
              {
                label: "Carbohydrates",
                value: results.macros?.carbs,
                unit: "g",
                color: "#1a5d52",
                max: (results.macros?.carbs || 0) + 80,
              },
              {
                label: "Fat",
                value: results.macros?.fat,
                unit: "g",
                color: "#c4a87a",
                max: (results.macros?.fat || 0) + 30,
              },
              {
                label: "Total Calories",
                value: results.macros?.calories,
                unit: "cal",
                color: "#4a7c59",
                max: (results.macros?.calories || 0) + 500,
              },
            ].map((macro, i) => (
              <div key={macro.label}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "6px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#2a2a2a",
                      fontFamily: "Inter",
                      fontWeight: 500,
                    }}
                  >
                    {macro.label}
                  </span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: "12px",
                      color: macro.color,
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {Math.round(macro.value || 0)}
                    {macro.unit}
                  </span>
                </div>
                <div
                  style={{
                    height: "6px",
                    background: "rgba(13, 61, 53, 0.06)",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <motion.div
                    style={{
                      height: "100%",
                      background: macro.color,
                      borderRadius: "3px",
                    }}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${((macro.value || 0) / macro.max) * 100}%`,
                    }}
                    transition={{
                      delay: 0.8 + i * 0.15,
                      duration: 1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <motion.button
          onClick={onNext}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="btn-primary"
          style={{ padding: "1rem 2.5rem", fontSize: "12px" }}
        >
          Choose My Goal
          <ArrowRight size={14} />
        </motion.button>
        <p
          style={{
            fontSize: "11px",
            color: "#9ca09a",
            fontFamily: "Inter",
            marginTop: "12px",
          }}
        >
          One last step — select your dream body
        </p>
      </div>
    </motion.div>
  );
};

export default BMIResult;

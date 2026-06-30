import React, { useState } from "react";
import { motion } from "framer-motion";
import Input from "../../../components/ui/Input";
import { ArrowRight, Calendar, Ruler, Weight } from "lucide-react";

const StepBasicInfo = ({ data, updateData, onNext }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    const age = parseInt(data.age);
    const feet = parseInt(data.heightFeet);
    const inches = parseInt(data.heightInches || 0);
    const weight = parseFloat(data.weight);

    if (!data.age || age < 13 || age > 100)
      newErrors.age = "Age must be 13-100";
    if (!data.heightFeet || feet < 3 || feet > 8)
      newErrors.heightFeet = "Height in feet (3-8)";
    if (inches < 0 || inches > 11)
      newErrors.heightInches = "Inches must be 0-11";
    if (!data.weight || weight < 20 || weight > 300)
      newErrors.weight = "Weight must be 20-300 kg";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) onNext();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div
        style={{
          textAlign: "center",
          marginBottom: "3rem",
          maxWidth: "600px",
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
            Step 02
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
          Tell us about yourself.
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7068",
            fontFamily: "Inter",
            lineHeight: 1.7,
          }}
        >
          Essential measurements for calculating your BMI, BMR, and daily
          calorie requirements.
        </p>
      </div>

      <div
        style={{
          maxWidth: "440px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        <Input
          label="Age"
          type="number"
          icon={Calendar}
          placeholder="25"
          value={data.age}
          onChange={(e) => updateData({ age: e.target.value })}
          error={errors.age}
          helper="Must be between 13 and 100"
        />

        <div>
          <label
            className="font-mono"
            style={{
              fontSize: "10px",
              color: "#0d3d35",
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "6px",
              paddingLeft: "2px",
            }}
          >
            Height
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0.75rem",
            }}
          >
            <div style={{ position: "relative" }}>
              <Ruler
                size={16}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca09a",
                  zIndex: 2,
                }}
              />
              <input
                type="number"
                placeholder="5"
                value={data.heightFeet}
                onChange={(e) => updateData({ heightFeet: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.875rem 3rem 0.875rem 2.75rem",
                  background: "#ffffff",
                  border: `1.5px solid ${errors.heightFeet ? "#a84838" : "rgba(13, 61, 53, 0.12)"}`,
                  color: "#1a1a1a",
                  fontFamily: "Inter",
                  fontSize: "14px",
                  borderRadius: "10px",
                  outline: "none",
                }}
              />
              <span
                className="font-mono"
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca09a",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                }}
              >
                FT
              </span>
            </div>
            <div style={{ position: "relative" }}>
              <input
                type="number"
                placeholder="8"
                value={data.heightInches}
                onChange={(e) => updateData({ heightInches: e.target.value })}
                style={{
                  width: "100%",
                  padding: "0.875rem 3rem 0.875rem 1.25rem",
                  background: "#ffffff",
                  border: `1.5px solid ${errors.heightInches ? "#a84838" : "rgba(13, 61, 53, 0.12)"}`,
                  color: "#1a1a1a",
                  fontFamily: "Inter",
                  fontSize: "14px",
                  borderRadius: "10px",
                  outline: "none",
                }}
              />
              <span
                className="font-mono"
                style={{
                  position: "absolute",
                  right: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca09a",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.15em",
                }}
              >
                IN
              </span>
            </div>
          </div>
          {(errors.heightFeet || errors.heightInches) && (
            <p
              style={{
                fontSize: "11px",
                color: "#a84838",
                fontFamily: "Inter",
                fontWeight: 500,
                marginTop: "6px",
                paddingLeft: "2px",
              }}
            >
              {errors.heightFeet || errors.heightInches}
            </p>
          )}
          {!errors.heightFeet && !errors.heightInches && (
            <p
              style={{
                fontSize: "11px",
                color: "#9ca09a",
                fontFamily: "Inter",
                marginTop: "6px",
                paddingLeft: "2px",
              }}
            >
              Your height in feet and inches
            </p>
          )}
        </div>

        <Input
          label="Weight (kg)"
          type="number"
          icon={Weight}
          placeholder="70"
          value={data.weight}
          onChange={(e) => updateData({ weight: e.target.value })}
          error={errors.weight}
          helper="Your current weight in kilograms"
        />

        <div style={{ paddingTop: "1rem" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <label
              className="font-mono"
              style={{
                fontSize: "10px",
                color: "#0d3d35",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Sleep Hours
            </label>
            <span
              className="font-display"
              style={{ fontSize: "1.5rem", color: "#0d3d35" }}
            >
              {data.sleepHours}
              <span style={{ fontSize: "0.875rem", color: "#6b7068" }}>h</span>
            </span>
          </div>
          <input
            type="range"
            min="3"
            max="12"
            step="0.5"
            value={data.sleepHours}
            onChange={(e) => updateData({ sleepHours: e.target.value })}
            style={{
              width: "100%",
              height: "4px",
              background: "rgba(13, 61, 53, 0.1)",
              borderRadius: "2px",
              appearance: "none",
              cursor: "pointer",
              accentColor: "#0d3d35",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "6px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "#9ca09a",
                fontFamily: "Inter",
              }}
            >
              3h
            </span>
            <span
              style={{
                fontSize: "10px",
                color: "#9ca09a",
                fontFamily: "Inter",
              }}
            >
              12h
            </span>
          </div>
        </div>

        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <label
              className="font-mono"
              style={{
                fontSize: "10px",
                color: "#0d3d35",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Water Intake
            </label>
            <span
              className="font-display"
              style={{ fontSize: "1.5rem", color: "#0d3d35" }}
            >
              {data.waterIntake}
              <span style={{ fontSize: "0.875rem", color: "#6b7068" }}>L</span>
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="6"
            step="0.5"
            value={data.waterIntake}
            onChange={(e) => updateData({ waterIntake: e.target.value })}
            style={{
              width: "100%",
              height: "4px",
              background: "rgba(13, 61, 53, 0.1)",
              borderRadius: "2px",
              appearance: "none",
              cursor: "pointer",
              accentColor: "#0d3d35",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "6px",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "#9ca09a",
                fontFamily: "Inter",
              }}
            >
              0.5L
            </span>
            <span
              style={{
                fontSize: "10px",
                color: "#9ca09a",
                fontFamily: "Inter",
              }}
            >
              6L
            </span>
          </div>
        </div>

        <div style={{ textAlign: "center", paddingTop: "1.5rem" }}>
          <motion.button
            onClick={handleContinue}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary"
            style={{ padding: "1rem 2.5rem", fontSize: "12px" }}
          >
            Continue
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default StepBasicInfo;

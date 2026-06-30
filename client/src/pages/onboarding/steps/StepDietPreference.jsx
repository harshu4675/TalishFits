import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, X, Check } from "lucide-react";

const FOOD_PREFERENCES = [
  { value: "non_veg", label: "Non Vegetarian" },
  { value: "veg", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Eggetarian" },
];

const COMMON_ALLERGIES = [
  "Dairy",
  "Gluten",
  "Nuts",
  "Eggs",
  "Soy",
  "Fish",
  "Shellfish",
  "Wheat",
  "Peanuts",
];

const StepDietPreference = ({ data, updateData, onNext }) => {
  const toggleAllergy = (allergy) => {
    const current = data.allergies || [];
    const updated = current.includes(allergy)
      ? current.filter((a) => a !== allergy)
      : [...current, allergy];
    updateData({ allergies: updated });
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
            Step 04
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
          Food preferences.
        </h1>
        <p
          style={{
            fontSize: "14px",
            color: "#6b7068",
            fontFamily: "Inter",
            lineHeight: 1.7,
          }}
        >
          Your diet plan will be built around your preferences and allergies.
        </p>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ marginBottom: "3rem" }}>
          <h3
            className="font-mono"
            style={{
              fontSize: "11px",
              color: "#0d3d35",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            I Prefer
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "12px",
            }}
          >
            {FOOD_PREFERENCES.map((pref) => {
              const isSelected = data.foodPreference === pref.value;
              return (
                <motion.button
                  key={pref.value}
                  onClick={() => updateData({ foodPreference: pref.value })}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "1.25rem",
                    background: isSelected ? "#0d3d35" : "#ffffff",
                    color: isSelected ? "#f5f3ee" : "#0d3d35",
                    border: "1.5px solid",
                    borderColor: isSelected
                      ? "#0d3d35"
                      : "rgba(13, 61, 53, 0.1)",
                    borderRadius: "10px",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontFamily: "Inter",
                      fontWeight: 600,
                    }}
                  >
                    {pref.label}
                  </span>
                  {isSelected && (
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: "#c4a87a",
                        color: "#0d3d35",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Check size={11} strokeWidth={3} />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div style={{ marginBottom: "3rem" }}>
          <h3
            className="font-mono"
            style={{
              fontSize: "11px",
              color: "#0d3d35",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              marginBottom: "6px",
            }}
          >
            Allergies
          </h3>
          <p
            style={{
              fontSize: "12px",
              color: "#6b7068",
              fontFamily: "Inter",
              marginBottom: "1rem",
            }}
          >
            Select all that apply. Skip if none.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {COMMON_ALLERGIES.map((allergy) => {
              const isSelected = data.allergies?.includes(allergy);
              return (
                <motion.button
                  key={allergy}
                  onClick={() => toggleAllergy(allergy)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 14px",
                    background: isSelected ? "#0d3d35" : "#ffffff",
                    color: isSelected ? "#f5f3ee" : "#0d3d35",
                    border: "1.5px solid",
                    borderColor: isSelected
                      ? "#0d3d35"
                      : "rgba(13, 61, 53, 0.1)",
                    borderRadius: "9999px",
                    fontSize: "12px",
                    fontFamily: "Inter",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {allergy}
                  {isSelected && <X size={11} strokeWidth={3} />}
                </motion.button>
              );
            })}
          </div>
          {data.allergies?.length > 0 && (
            <p
              className="font-mono"
              style={{
                fontSize: "11px",
                color: "#c4a87a",
                fontWeight: 700,
                letterSpacing: "0.15em",
                marginTop: "12px",
                textTransform: "uppercase",
              }}
            >
              {data.allergies.length} ALLERG
              {data.allergies.length > 1 ? "IES" : "Y"} SELECTED
            </p>
          )}
        </div>

        <div style={{ textAlign: "center" }}>
          <motion.button
            onClick={onNext}
            disabled={!data.foodPreference}
            whileHover={data.foodPreference ? { y: -2 } : {}}
            whileTap={data.foodPreference ? { scale: 0.97 } : {}}
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

export default StepDietPreference;

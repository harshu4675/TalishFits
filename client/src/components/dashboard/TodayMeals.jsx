import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { dietAPI } from "../../api/dietApi";
import { UtensilsCrossed, ArrowRight, Flame } from "lucide-react";
import { Skeleton } from "../ui/Loader";

const TodayMeals = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["todayMeals"],
    queryFn: () => dietAPI.getTodayMeals(),
    select: (res) => res.data.data,
  });

  if (isLoading) {
    return <Skeleton style={{ height: "180px", borderRadius: "16px" }} />;
  }

  const meals = data?.meals;

  if (!meals) {
    return (
      <div className="premium-card today-meals-empty">
        <UtensilsCrossed
          className="meals-empty-icon"
          style={{ color: "#0d3d35", opacity: 0.4 }}
        />
        <h3
          className="font-display meals-empty-title"
          style={{ color: "#0d3d35" }}
        >
          No Diet Plan
        </h3>
        <p
          className="meals-empty-desc"
          style={{ color: "#6b7068", fontFamily: "Inter" }}
        >
          Generate your AI-powered nutrition plan.
        </p>
        <button
          onClick={() => navigate("/diet")}
          className="btn-primary meals-empty-btn"
        >
          Generate Plan
          <ArrowRight size={13} />
        </button>

        <style>{`
          .today-meals-empty {
            padding: 1.5rem;
            text-align: center;
          }
          .meals-empty-icon {
            width: 32px;
            height: 32px;
            margin: 0 auto 0.75rem auto;
          }
          .meals-empty-title {
            font-size: 1.125rem;
            margin-bottom: 0.5rem;
          }
          .meals-empty-desc {
            font-size: 12px;
            margin-bottom: 1.25rem;
          }
          .meals-empty-btn {
            padding: 0.625rem 1.25rem !important;
            font-size: 11px !important;
          }
          @media (min-width: 480px) {
            .today-meals-empty {
              padding: 1.75rem;
            }
            .meals-empty-icon {
              width: 36px;
              height: 36px;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="premium-card today-meals-card">
      <div className="meals-header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: 0,
          }}
        >
          <div className="meals-icon-wrapper">
            <UtensilsCrossed className="meals-icon-svg" strokeWidth={2} />
          </div>
          <div style={{ minWidth: 0 }}>
            <h3
              className="font-display meals-title"
              style={{ color: "#0d3d35", letterSpacing: "-0.01em" }}
            >
              Today's Meals
            </h3>
            <p
              className="font-mono meals-total"
              style={{
                color: "#6b7068",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginTop: "2px",
              }}
            >
              {meals.totalCalories} Cal Total
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/diet")}
          className="meals-view-all"
          style={{
            background: "transparent",
            color: "#4a7c59",
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

      <div className="meals-list">
        {meals.meals?.map((meal, i) => (
          <motion.div
            key={i}
            onClick={() => navigate("/diet")}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            whileHover={{ x: 4 }}
            className="meal-row"
          >
            <div className="meal-type-badge">
              {meal.type === "breakfast" && "BF"}
              {meal.type === "lunch" && "LN"}
              {meal.type === "dinner" && "DN"}
              {meal.type === "snack" && "SN"}
              {meal.type === "pre_workout" && "PRE"}
              {meal.type === "post_workout" && "PST"}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                className="meal-type-name"
                style={{
                  color: "#1a1a1a",
                  fontFamily: "Inter",
                  fontWeight: 700,
                  textTransform: "capitalize",
                }}
              >
                {meal.type.replace("_", " ")}
              </p>
              <p
                className="meal-foods"
                style={{
                  color: "#6b7068",
                  fontFamily: "Inter",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  marginTop: "2px",
                }}
              >
                {meal.foods?.map((f) => f.name).join(", ") || "No items"}
              </p>
            </div>

            <div className="meal-cal">
              <Flame size={10} style={{ color: "#c4a87a" }} />
              <span
                className="font-mono"
                style={{
                  color: "#0d3d35",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                }}
              >
                {meal.totalCalories || 0}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {data?.dailyTargets && (
        <div className="meals-macros-summary">
          {[
            {
              label: "Cal",
              value: meals.totalCalories || 0,
              target: data.dailyTargets.calories,
              color: "#0d3d35",
            },
            {
              label: "Prot",
              value: meals.totalProtein || 0,
              target: data.dailyTargets.protein,
              color: "#1a5d52",
            },
            {
              label: "Carbs",
              value: meals.totalCarbs || 0,
              target: data.dailyTargets.carbs,
              color: "#4a7c59",
            },
            {
              label: "Fat",
              value: meals.totalFat || 0,
              target: data.dailyTargets.fat,
              color: "#c4a87a",
            },
          ].map((macro) => (
            <div key={macro.label} className="macro-cell">
              <p
                className="font-mono macro-label"
                style={{
                  color: "#6b7068",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {macro.label}
              </p>
              <p
                className="font-display macro-value"
                style={{ color: macro.color, lineHeight: 1 }}
              >
                {Math.round(macro.value)}
              </p>
              <div
                style={{
                  height: "2px",
                  background: "rgba(13, 61, 53, 0.06)",
                  marginTop: "5px",
                  borderRadius: "1px",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{ height: "100%", background: macro.color }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min((macro.value / macro.target) * 100, 100)}%`,
                  }}
                  transition={{ duration: 0.8 }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .today-meals-card {
          padding: 1.25rem;
        }

        .meals-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 1.25rem;
        }

        .meals-icon-wrapper {
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

        .meals-icon-svg {
          width: 16px;
          height: 16px;
        }

        .meals-title {
          font-size: 1.125rem;
        }

        .meals-total {
          font-size: 9px;
        }

        .meals-view-all {
          font-size: 10px;
        }

        .meals-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .meal-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: #f5f3ee;
          border: 1px solid rgba(13, 61, 53, 0.04);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .meal-type-badge {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: #0d3d35;
          color: #c4a87a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: Space Grotesk;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .meal-type-name {
          font-size: 12px;
        }

        .meal-foods {
          font-size: 10px;
        }

        .meal-cal {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
          font-size: 10px;
        }

        .meals-macros-summary {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(13, 61, 53, 0.06);
        }

        .macro-cell {
          text-align: center;
        }

        .macro-label {
          font-size: 8px;
          margin-bottom: 3px;
        }

        .macro-value {
          font-size: 0.875rem;
        }

        @media (min-width: 480px) {
          .today-meals-card {
            padding: 1.5rem;
          }
          .meals-icon-wrapper {
            width: 40px;
            height: 40px;
          }
          .meals-icon-svg {
            width: 17px;
            height: 17px;
          }
          .meals-title {
            font-size: 1.25rem;
          }
          .meals-total {
            font-size: 10px;
          }
          .meals-view-all {
            font-size: 11px;
          }
          .meal-row {
            padding: 12px 14px;
            gap: 12px;
          }
          .meal-type-badge {
            width: 40px;
            height: 40px;
            font-size: 10px;
          }
          .meal-type-name {
            font-size: 13px;
          }
          .meal-foods {
            font-size: 11px;
          }
          .meal-cal {
            font-size: 11px;
          }
          .macro-label {
            font-size: 9px;
          }
          .macro-value {
            font-size: 1rem;
          }
        }

        @media (min-width: 1024px) {
          .today-meals-card {
            padding: 1.75rem;
          }
          .meals-title {
            font-size: 1.375rem;
          }
        }
      `}</style>
    </div>
  );
};

export default TodayMeals;

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, Check, Plus } from "lucide-react";

const mealLabels = {
  breakfast: "BF",
  lunch: "LN",
  dinner: "DN",
  snack: "SN",
  pre_workout: "PRE",
  post_workout: "PST",
};

const MealCard = ({ meal, onLog }) => {
  const [expanded, setExpanded] = useState(false);
  const [logged, setLogged] = useState(false);

  const handleLog = () => {
    onLog({
      calories: meal.totalCalories || 0,
      protein: meal.totalProtein || 0,
      carbs: meal.totalCarbs || 0,
      fat: meal.totalFat || 0,
    });
    setLogged(true);
    setTimeout(() => setLogged(false), 3000);
  };

  return (
    <div className="premium-card meal-card">
      <div className="meal-card-top">
        <div className="meal-label-badge">{mealLabels[meal.type] || "ML"}</div>

        <div className="meal-info">
          <h3 className="meal-type-title">{meal.type.replace("_", " ")}</h3>
          <p className="font-mono meal-time">{meal.time}</p>
        </div>

        <div className="meal-card-right">
          <div className="meal-cal-info">
            <div className="font-display meal-cal-value">
              {meal.totalCalories}
              <span className="font-mono meal-cal-unit">cal</span>
            </div>
            <div className="font-mono meal-macros-line">
              P:{meal.totalProtein}g · C:{meal.totalCarbs}g · F:{meal.totalFat}g
            </div>
          </div>

          {logged ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="meal-logged-badge"
            >
              <Check size={14} strokeWidth={3} />
            </motion.div>
          ) : (
            <button onClick={handleLog} className="meal-log-btn">
              <Plus size={11} />
              Log
            </button>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="meal-expand-btn"
          >
            {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: "hidden" }}
          >
            <div className="meal-expanded">
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                {meal.foods?.map((food, i) => (
                  <div key={i} className="food-row">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p className="food-name">{food.name}</p>
                      <p className="font-mono food-qty">
                        {food.quantity}
                        {food.unit}
                      </p>
                    </div>
                    <div className="food-stats">
                      <span className="font-mono food-cal">
                        {food.calories}cal
                      </span>
                      <span className="font-mono food-prot">
                        P:{food.protein}g
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .meal-card {
          overflow: hidden;
        }
        .meal-card-top {
          padding: 1rem 1.125rem;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .meal-label-badge {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #0d3d35;
          color: #c4a87a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-family: Space Grotesk;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }
        .meal-info {
          flex: 1;
          min-width: 100px;
        }
        .meal-type-title {
          font-size: 13px;
          font-family: Inter;
          font-weight: 700;
          color: #0d3d35;
          text-transform: capitalize;
          margin-bottom: 2px;
        }
        .meal-time {
          font-size: 9px;
          color: #6b7068;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .meal-card-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
          flex-wrap: wrap;
          justify-content: flex-end;
        }
        .meal-cal-info {
          text-align: right;
        }
        .meal-cal-value {
          font-size: 1.125rem;
          color: #c4a87a;
          line-height: 1;
        }
        .meal-cal-unit {
          font-size: 9px;
          color: #6b7068;
          font-weight: 600;
          margin-left: 3px;
        }
        .meal-macros-line {
          font-size: 8px;
          color: #6b7068;
          letter-spacing: 0.08em;
          margin-top: 3px;
          font-weight: 600;
        }
        .meal-logged-badge {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #4a7c59;
          color: #f5f3ee;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .meal-log-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 12px;
          background: #0d3d35;
          color: #f5f3ee;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          font-family: Inter;
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .meal-expand-btn {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          background: #f5f3ee;
          border: none;
          cursor: pointer;
          color: #6b7068;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .meal-expanded {
          padding: 0 1.125rem 1.125rem 1.125rem;
          border-top: 1px solid rgba(13, 61, 53, 0.04);
          padding-top: 1rem;
        }
        .food-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 8px 12px;
          background: #f5f3ee;
          border-radius: 8px;
        }
        .food-name {
          font-size: 12px;
          color: #1a1a1a;
          font-family: Inter;
          font-weight: 600;
        }
        .food-qty {
          font-size: 9px;
          color: #6b7068;
          margin-top: 2px;
          letter-spacing: 0.1em;
          font-weight: 500;
        }
        .food-stats {
          display: flex;
          gap: 10px;
          flex-shrink: 0;
        }
        .food-cal {
          font-size: 10px;
          color: #c4a87a;
          font-weight: 700;
        }
        .food-prot {
          font-size: 9px;
          color: #6b7068;
          font-weight: 600;
        }
        @media (min-width: 480px) {
          .meal-card-top {
            padding: 1.125rem 1.25rem;
            gap: 12px;
            flex-wrap: nowrap;
          }
          .meal-label-badge {
            width: 44px;
            height: 44px;
            font-size: 11px;
          }
          .meal-type-title {
            font-size: 14px;
          }
          .meal-time {
            font-size: 10px;
          }
          .meal-cal-value {
            font-size: 1.25rem;
          }
          .meal-cal-unit {
            font-size: 10px;
          }
          .meal-macros-line {
            font-size: 9px;
          }
          .meal-log-btn {
            font-size: 11px;
            padding: 8px 14px;
          }
          .meal-expand-btn {
            width: 30px;
            height: 30px;
          }
          .meal-expanded {
            padding: 0 1.25rem 1.25rem 1.25rem;
          }
          .food-name {
            font-size: 13px;
          }
        }
        @media (min-width: 1024px) {
          .meal-card-top {
            padding: 1.25rem 1.5rem;
          }
          .meal-label-badge {
            width: 48px;
            height: 48px;
            font-size: 12px;
          }
          .meal-cal-value {
            font-size: 1.375rem;
          }
        }
      `}</style>
    </div>
  );
};

export default MealCard;

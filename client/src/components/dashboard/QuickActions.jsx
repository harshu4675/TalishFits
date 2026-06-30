import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dumbbell, UtensilsCrossed, Droplets, Scale } from "lucide-react";
import { dietAPI } from "../../api/dietApi";
import toast from "react-hot-toast";

const QuickActions = () => {
  const navigate = useNavigate();

  const logWater = async () => {
    try {
      await dietAPI.logNutrition({ water: 0.25 });
      toast.success("250ml water logged");
    } catch {
      toast.error("Failed to log water");
    }
  };

  const actions = [
    { label: "Workout", icon: Dumbbell, onClick: () => navigate("/workout") },
    { label: "Meal", icon: UtensilsCrossed, onClick: () => navigate("/diet") },
    { label: "Water", icon: Droplets, onClick: logWater },
    { label: "Weight", icon: Scale, onClick: () => navigate("/progress") },
  ];

  return (
    <div className="quick-actions-grid">
      {actions.map((action) => (
        <motion.button
          key={action.label}
          onClick={action.onClick}
          whileTap={{ scale: 0.95 }}
          className="quick-action-btn"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(13, 61, 53, 0.08)",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#0d3d35";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(13, 61, 53, 0.08)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <div className="quick-action-icon">
            <action.icon className="quick-action-svg" strokeWidth={2} />
          </div>
          <span className="quick-action-label">{action.label}</span>
        </motion.button>
      ))}

      <style>{`
        .quick-actions-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
        }

        .quick-action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0.75rem 0.5rem;
        }

        .quick-action-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #0d3d35;
          color: #f5f3ee;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .quick-action-svg {
          width: 14px;
          height: 14px;
        }

        .quick-action-label {
          font-size: 10px;
          font-family: Inter;
          font-weight: 700;
          color: #0d3d35;
        }

        @media (min-width: 480px) {
          .quick-action-btn {
            padding: 0.875rem 0.625rem;
          }
          .quick-action-icon {
            width: 36px;
            height: 36px;
          }
          .quick-action-svg {
            width: 16px;
            height: 16px;
          }
          .quick-action-label {
            font-size: 11px;
          }
        }

        @media (min-width: 768px) {
          .quick-actions-grid {
            gap: 12px;
          }
          .quick-action-btn {
            flex-direction: row;
            gap: 12px;
            padding: 1rem 1.25rem;
            justify-content: flex-start;
          }
          .quick-action-icon {
            width: 38px;
            height: 38px;
          }
          .quick-action-label {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
};

export default QuickActions;

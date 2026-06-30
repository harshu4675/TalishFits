import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Droplets, Plus, Minus } from "lucide-react";

const WaterTracker = ({ target = 3, currentAmount = 0, onLog }) => {
  const glassSize = 0.25;
  const totalGlasses = Math.ceil(target / glassSize);

  const [optimisticAmount, setOptimisticAmount] = useState(currentAmount);
  const [isLogging, setIsLogging] = useState(false);

  useEffect(() => {
    setOptimisticAmount(currentAmount);
  }, [currentAmount]);

  const currentGlasses = Math.round(optimisticAmount / glassSize);
  const percentage = Math.min((optimisticAmount / target) * 100, 100);

  const addGlass = async () => {
    if (isLogging) return;
    setIsLogging(true);
    setOptimisticAmount((prev) => prev + glassSize);
    try {
      await onLog(glassSize);
    } catch (e) {
      setOptimisticAmount((prev) => prev - glassSize);
    } finally {
      setTimeout(() => setIsLogging(false), 300);
    }
  };

  const removeGlass = async () => {
    if (isLogging || currentGlasses === 0) return;
    setIsLogging(true);
    setOptimisticAmount((prev) => Math.max(0, prev - glassSize));
    try {
      await onLog(-glassSize);
    } catch (e) {
      setOptimisticAmount((prev) => prev + glassSize);
    } finally {
      setTimeout(() => setIsLogging(false), 300);
    }
  };

  return (
    <div className="premium-card water-card">
      <div className="water-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Droplets size={13} style={{ color: "#0d3d35" }} />
          <h4 className="font-mono water-title">Water Intake</h4>
        </div>
        <span className="font-mono water-total">
          {optimisticAmount.toFixed(2)}L / {target}L
        </span>
      </div>

      <div className="water-glasses-grid">
        {Array.from({ length: Math.min(totalGlasses, 12) }).map((_, i) => {
          const filled = i < currentGlasses;
          return (
            <motion.div
              key={i}
              animate={filled ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
              className="water-glass"
              style={{
                borderColor: filled ? "#0d3d35" : "rgba(13, 61, 53, 0.1)",
                background: filled ? "#0d3d35" : "transparent",
              }}
            >
              <Droplets
                size={10}
                style={{ color: filled ? "#c4a87a" : "rgba(13, 61, 53, 0.15)" }}
                fill={filled ? "#c4a87a" : "transparent"}
              />
            </motion.div>
          );
        })}
      </div>

      <div className="water-progress-bar">
        <motion.div
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          className="water-progress-fill"
        />
      </div>

      <div className="water-controls">
        <button
          type="button"
          onClick={removeGlass}
          disabled={currentGlasses === 0 || isLogging}
          className="water-btn water-btn-minus"
          style={{
            opacity: currentGlasses === 0 ? 0.4 : 1,
            cursor: currentGlasses === 0 ? "not-allowed" : "pointer",
          }}
          aria-label="Remove water"
        >
          <Minus size={16} strokeWidth={2.5} />
        </button>

        <div className="water-counter">
          <div className="font-display water-count-value">{currentGlasses}</div>
          <div className="font-mono water-count-label">Cups · 250ml</div>
        </div>

        <button
          type="button"
          onClick={addGlass}
          disabled={isLogging}
          className="water-btn water-btn-plus"
          aria-label="Add water"
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>

      <style>{`
        .water-card { padding: 1.25rem; }
        .water-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 6px; }
        .water-title { font-size: 10px; color: #0d3d35; letter-spacing: 0.25em; text-transform: uppercase; font-weight: 700; }
        .water-total { font-size: 11px; color: #c4a87a; font-weight: 700; }
        .water-glasses-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 5px; margin-bottom: 0.875rem; }
        .water-glass { aspect-ratio: 1/1; border-radius: 7px; border: 1.5px solid; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
        .water-progress-bar { height: 5px; background: rgba(13, 61, 53, 0.06); border-radius: 3px; overflow: hidden; margin-bottom: 1rem; }
        .water-progress-fill { height: 100%; background: #0d3d35; border-radius: 3px; }
        .water-controls { display: flex; align-items: center; justify-content: center; gap: 1rem; }
        .water-btn { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.15s; flex-shrink: 0; -webkit-tap-highlight-color: transparent; touch-action: manipulation; user-select: none; }
        .water-btn-minus { background: #ffffff; border: 1.5px solid #0d3d35; color: #0d3d35; }
        .water-btn-minus:not(:disabled):hover { background: #0d3d35; color: #f5f3ee; }
        .water-btn-minus:not(:disabled):active { transform: scale(0.92); }
        .water-btn-plus { background: #0d3d35; color: #c4a87a; border: 1.5px solid #0d3d35; cursor: pointer; }
        .water-btn-plus:not(:disabled):hover { background: #1a5d52; border-color: #1a5d52; }
        .water-btn-plus:not(:disabled):active { transform: scale(0.92); }
        .water-counter { text-align: center; min-width: 90px; }
        .water-count-value { font-size: 1.75rem; color: #0d3d35; line-height: 1; }
        .water-count-label { font-size: 8px; color: #6b7068; margin-top: 4px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 600; }
        @media (min-width: 480px) {
          .water-card { padding: 1.5rem; }
          .water-total { font-size: 12px; }
          .water-glasses-grid { gap: 6px; }
          .water-btn { width: 44px; height: 44px; }
          .water-count-value { font-size: 2rem; }
          .water-count-label { font-size: 9px; }
        }
      `}</style>
    </div>
  );
};

export default WaterTracker;

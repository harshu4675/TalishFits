import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import { useStepCounter } from "../../hooks/useStepCounter";
import { useAuth } from "../../context/AuthContext";
import {
  Footprints,
  Flame,
  MapPin,
  Play,
  Pause,
  RotateCcw,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";

const StepCounter = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [manualSteps, setManualSteps] = useState("");

  const weightKg = user?.healthProfile?.weight?.value || 70;
  const heightCm = user?.healthProfile?.height?.value || 170;

  const calculateMetrics = (stepCount) => {
    const strideLength = (heightCm * 0.413) / 100;
    const distanceKm = (stepCount * strideLength) / 1000;
    const calories = Math.round(stepCount * 0.04 * (weightKg / 70));
    return { distance: parseFloat(distanceKm.toFixed(2)), calories };
  };

  const syncMutation = useMutation({
    mutationFn: (steps) => axiosInstance.post("/progress/steps", { steps }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todaySteps"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });

  const { data: serverSteps } = useQuery({
    queryKey: ["todaySteps"],
    queryFn: () => axiosInstance.get("/progress/steps/today"),
    select: (res) => res.data.data?.steps,
    refetchInterval: 60000,
  });

  const debouncedSync = useCallback(
    debounce((stepCount) => {
      if (stepCount > 0) {
        syncMutation.mutate(stepCount);
      }
    }, 5000),
    [],
  );

  const { steps, isActive, error, start, stop, reset, addManualSteps } =
    useStepCounter({
      enabled: false,
      onStepUpdate: debouncedSync,
    });

  const displaySteps = Math.max(steps, serverSteps?.count || 0);
  const targetSteps = serverSteps?.target || 10000;
  const metrics = calculateMetrics(displaySteps);
  const percentage = Math.min((displaySteps / targetSteps) * 100, 100);

  const handleToggle = async () => {
    if (isActive) {
      stop();
      toast.success("Step tracking paused");
    } else {
      const success = await start();
      if (success) {
        toast.success("Step tracking started");
      } else {
        toast.error("Permission denied. Use manual input.");
      }
    }
  };

  const handleAddManual = () => {
    const num = parseInt(manualSteps);
    if (!num || num < 0) {
      toast.error("Enter valid step count");
      return;
    }
    addManualSteps(num);
    syncMutation.mutate(displaySteps + num);
    setManualSteps("");
    setShowAddModal(false);
    toast.success(`+${num} steps added`);
  };

  const handleReset = () => {
    reset();
    syncMutation.mutate(0);
    toast.success("Steps reset");
  };

  return (
    <div className="step-counter-card">
      <div className="step-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="step-icon-wrapper">
            <Footprints size={16} strokeWidth={2.5} />
          </div>
          <div>
            <h3 className="font-display step-title">Step Counter</h3>
            <p className="font-mono step-subtitle">Today's Activity</p>
          </div>
        </div>
        {isActive && (
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="step-live-indicator"
          >
            <div className="step-live-dot" />
            LIVE
          </motion.div>
        )}
      </div>

      <div className="step-main-display">
        <div className="step-progress-ring">
          <svg viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="rgba(245, 243, 238, 0.08)"
              strokeWidth="8"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="#c4a87a"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 70}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 70 }}
              animate={{
                strokeDashoffset: 2 * Math.PI * 70 * (1 - percentage / 100),
              }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
            />
          </svg>
          <div className="step-count-display">
            <span className="font-display step-count-value">
              {displaySteps.toLocaleString()}
            </span>
            <span className="font-mono step-count-label">
              of {targetSteps.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="step-metrics">
        <div className="step-metric">
          <div className="step-metric-icon">
            <Flame size={14} strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display step-metric-value">
              {metrics.calories}
            </div>
            <div className="font-mono step-metric-label">Calories</div>
          </div>
        </div>
        <div className="step-metric-divider" />
        <div className="step-metric">
          <div className="step-metric-icon">
            <MapPin size={14} strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display step-metric-value">
              {metrics.distance}
            </div>
            <div className="font-mono step-metric-label">Kilometers</div>
          </div>
        </div>
      </div>

      <div className="step-controls">
        <button onClick={handleToggle} className="step-main-btn">
          {isActive ? (
            <>
              <Pause size={14} strokeWidth={2.5} />
              Pause Tracking
            </>
          ) : (
            <>
              <Play size={14} strokeWidth={2.5} />
              Start Tracking
            </>
          )}
        </button>

        <div className="step-secondary-controls">
          <button
            onClick={() => setShowAddModal(true)}
            className="step-icon-btn"
            title="Add manual steps"
          >
            <Plus size={15} strokeWidth={2.5} />
          </button>
          <button
            onClick={handleReset}
            className="step-icon-btn step-icon-btn-danger"
            title="Reset"
          >
            <RotateCcw size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {error && (
        <div className="step-error">
          {error}. Use the + button to add steps manually.
        </div>
      )}

      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="step-modal-backdrop"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="step-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display step-modal-title">Add Steps</h3>
              <p className="step-modal-desc">
                Manually log steps you've taken today.
              </p>
              <input
                type="number"
                placeholder="Enter step count"
                value={manualSteps}
                onChange={(e) => setManualSteps(e.target.value)}
                className="step-modal-input"
                autoFocus
              />
              <div className="step-modal-presets">
                {[500, 1000, 2000, 5000].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setManualSteps(String(preset))}
                    className="step-modal-preset"
                  >
                    +{preset}
                  </button>
                ))}
              </div>
              <div className="step-modal-actions">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="step-modal-cancel"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddManual}
                  className="step-modal-confirm"
                >
                  Add Steps
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .step-counter-card {
          background: #0d3d35;
          color: #f5f3ee;
          border-radius: 16px;
          padding: 1.25rem;
          position: relative;
          overflow: hidden;
        }

        .step-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
          gap: 10px;
        }

        .step-icon-wrapper {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #c4a87a;
          color: #0d3d35;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-title {
          font-size: 1.125rem;
          color: #f5f3ee;
          letter-spacing: -0.01em;
        }

        .step-subtitle {
          font-size: 9px;
          color: rgba(245, 243, 238, 0.5);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
          margin-top: 2px;
        }

        .step-live-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 10px;
          background: rgba(196, 168, 122, 0.15);
          border: 1px solid rgba(196, 168, 122, 0.3);
          border-radius: 9999px;
          font-family: Space Grotesk;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.2em;
          color: #c4a87a;
        }

        .step-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #c4a87a;
        }

        .step-main-display {
          display: flex;
          justify-content: center;
          margin-bottom: 1.25rem;
        }

        .step-progress-ring {
          position: relative;
          width: 180px;
          height: 180px;
        }

        .step-progress-ring svg {
          width: 100%;
          height: 100%;
        }

        .step-count-display {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .step-count-value {
          font-size: 2.25rem;
          color: #f5f3ee;
          line-height: 1;
          letter-spacing: -0.03em;
        }

        .step-count-label {
          font-size: 9px;
          color: rgba(245, 243, 238, 0.5);
          margin-top: 6px;
          letter-spacing: 0.15em;
          font-weight: 600;
        }

        .step-metrics {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(245, 243, 238, 0.04);
          border-radius: 12px;
          margin-bottom: 1.25rem;
        }

        .step-metric {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .step-metric-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(196, 168, 122, 0.15);
          color: #c4a87a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-metric-value {
          font-size: 1.125rem;
          color: #f5f3ee;
          line-height: 1;
        }

        .step-metric-label {
          font-size: 8px;
          color: rgba(245, 243, 238, 0.5);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
          margin-top: 3px;
        }

        .step-metric-divider {
          width: 1px;
          height: 32px;
          background: rgba(245, 243, 238, 0.1);
        }

        .step-controls {
          display: flex;
          gap: 8px;
        }

        .step-main-btn {
          flex: 1;
          padding: 0.875rem 1rem;
          background: #c4a87a;
          color: #0d3d35;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-family: Inter;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
        }

        .step-main-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(196, 168, 122, 0.3);
        }

        .step-secondary-controls {
          display: flex;
          gap: 6px;
        }

        .step-icon-btn {
          width: 42px;
          height: 42px;
          background: rgba(245, 243, 238, 0.06);
          border: 1px solid rgba(245, 243, 238, 0.1);
          color: #f5f3ee;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .step-icon-btn:hover {
          background: rgba(245, 243, 238, 0.1);
        }

        .step-icon-btn-danger:hover {
          background: rgba(168, 72, 56, 0.2);
          border-color: rgba(168, 72, 56, 0.4);
        }

        .step-error {
          margin-top: 0.875rem;
          padding: 10px 12px;
          background: rgba(168, 72, 56, 0.1);
          border: 1px solid rgba(168, 72, 56, 0.2);
          border-radius: 8px;
          color: #f5b5a8;
          font-size: 11px;
          font-family: Inter;
        }

        .step-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(13, 61, 53, 0.6);
          backdrop-filter: blur(8px);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .step-modal {
          background: #ffffff;
          border-radius: 16px;
          padding: 1.5rem;
          max-width: 400px;
          width: 100%;
        }

        .step-modal-title {
          font-size: 1.5rem;
          color: #0d3d35;
          margin-bottom: 6px;
          letter-spacing: -0.02em;
        }

        .step-modal-desc {
          font-size: 12px;
          color: #6b7068;
          font-family: Inter;
          margin-bottom: 1.25rem;
        }

        .step-modal-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 1.5px solid rgba(13, 61, 53, 0.15);
          border-radius: 10px;
          font-family: Inter;
          font-size: 16px;
          outline: none;
          color: #0d3d35;
          margin-bottom: 0.875rem;
          font-weight: 600;
        }

        .step-modal-input:focus {
          border-color: #0d3d35;
        }

        .step-modal-presets {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          margin-bottom: 1.25rem;
        }

        .step-modal-preset {
          padding: 8px;
          background: #f5f3ee;
          border: 1px solid rgba(13, 61, 53, 0.08);
          border-radius: 8px;
          cursor: pointer;
          font-family: Space Grotesk;
          font-size: 11px;
          font-weight: 700;
          color: #0d3d35;
          transition: all 0.2s;
        }

        .step-modal-preset:hover {
          background: #0d3d35;
          color: #c4a87a;
          border-color: #0d3d35;
        }

        .step-modal-actions {
          display: flex;
          gap: 8px;
        }

        .step-modal-cancel,
        .step-modal-confirm {
          flex: 1;
          padding: 0.875rem;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          font-family: Inter;
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .step-modal-cancel {
          background: transparent;
          border: 1.5px solid #0d3d35;
          color: #0d3d35;
        }

        .step-modal-confirm {
          background: #0d3d35;
          color: #f5f3ee;
        }

        @media (min-width: 480px) {
          .step-counter-card {
            padding: 1.5rem;
          }
          .step-title {
            font-size: 1.25rem;
          }
          .step-progress-ring {
            width: 200px;
            height: 200px;
          }
          .step-count-value {
            font-size: 2.5rem;
          }
          .step-metric-value {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export default StepCounter;

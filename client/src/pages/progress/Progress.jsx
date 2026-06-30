import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { progressAPI } from "../../api/progressApi";
import DashboardLayout from "../../components/layout/DashboardLayout";
import WeightChart from "../../components/progress/WeightChart";
import BMICard from "../../components/progress/BMICard";
import BodyMeasurements from "../../components/progress/BodyMeasurements";
import toast from "react-hot-toast";
import { Scale, Save, Brain } from "lucide-react";

const Progress = () => {
  const queryClient = useQueryClient();
  const [period, setPeriod] = useState("30");

  const [logData, setLogData] = useState({
    weight: "",
    mood: "",
    energyLevel: "5",
    sleepHours: "",
    notes: "",
  });

  useEffect(() => {
    document.title = "Progress — TalishFits";
  }, []);

  const { data: historyData } = useQuery({
    queryKey: ["progressHistory", period],
    queryFn: () => progressAPI.getHistory({ period }),
    select: (res) => res.data.data,
  });

  const { data: adviceData } = useQuery({
    queryKey: ["progressAdvice"],
    queryFn: () => progressAPI.getAdvice(),
    select: (res) => res.data.data,
    staleTime: 1000 * 60 * 60,
  });

  const logMutation = useMutation({
    mutationFn: (data) => progressAPI.logProgress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["progressHistory"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Progress logged successfully");
      setLogData({
        weight: "",
        mood: "",
        energyLevel: "5",
        sleepHours: "",
        notes: "",
      });
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to log"),
  });

  const handleLog = () => {
    const data = {};
    if (logData.weight) data.weight = parseFloat(logData.weight);
    if (logData.mood) data.mood = logData.mood;
    if (logData.energyLevel) data.energyLevel = parseInt(logData.energyLevel);
    if (logData.sleepHours) {
      data.sleep = { hours: parseFloat(logData.sleepHours), quality: "good" };
    }
    if (logData.notes) data.notes = logData.notes;

    if (Object.keys(data).length === 0) {
      toast.error("Please fill in at least one field");
      return;
    }
    logMutation.mutate(data);
  };

  const moods = [
    { value: "terrible", label: "Low" },
    { value: "bad", label: "Bad" },
    { value: "okay", label: "Okay" },
    { value: "good", label: "Good" },
    { value: "great", label: "Great" },
  ];

  return (
    <DashboardLayout>
      <div className="progress-page">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="progress-page-header"
        >
          <div className="progress-header-content">
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "1.5px",
                    background: "#c4a87a",
                  }}
                />
                <span className="font-mono progress-tag">Your Journey</span>
              </div>
              <h1 className="font-display progress-page-title">Progress.</h1>
            </div>

            <div className="progress-period-tabs">
              {["7", "30", "90"].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="period-tab"
                  style={{
                    background: period === p ? "#0d3d35" : "#ffffff",
                    color: period === p ? "#f5f3ee" : "#0d3d35",
                    borderColor:
                      period === p ? "#0d3d35" : "rgba(13, 61, 53, 0.1)",
                  }}
                >
                  {p}D
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="progress-content-grid">
          <div className="progress-main">
            <WeightChart data={historyData?.charts?.weight || []} />
            <BMICard />
            <BodyMeasurements />
          </div>

          <div className="progress-sidebar">
            <div className="premium-card log-card">
              <h3 className="font-display log-title">Log Today</h3>
              <p className="font-mono log-subtitle">Track Your Stats</p>

              <div className="log-form">
                <div>
                  <label className="font-mono log-label">Weight (kg)</label>
                  <div style={{ position: "relative" }}>
                    <Scale
                      size={15}
                      style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "#9ca09a",
                      }}
                    />
                    <input
                      type="number"
                      placeholder="70.5"
                      value={logData.weight}
                      onChange={(e) =>
                        setLogData({ ...logData, weight: e.target.value })
                      }
                      className="input-field"
                      style={{ paddingLeft: "2.5rem" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono log-label">
                    How do you feel?
                  </label>
                  <div className="mood-grid">
                    {moods.map((mood) => {
                      const isSelected = logData.mood === mood.value;
                      return (
                        <button
                          key={mood.value}
                          onClick={() =>
                            setLogData({ ...logData, mood: mood.value })
                          }
                          className="mood-btn"
                          style={{
                            background: isSelected ? "#0d3d35" : "#ffffff",
                            color: isSelected ? "#f5f3ee" : "#0d3d35",
                            borderColor: isSelected
                              ? "#0d3d35"
                              : "rgba(13, 61, 53, 0.1)",
                          }}
                        >
                          {mood.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="energy-header">
                    <label className="font-mono log-label">Energy</label>
                    <span className="font-display energy-value">
                      {logData.energyLevel}
                      <span style={{ fontSize: "0.7em", color: "#6b7068" }}>
                        /10
                      </span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={logData.energyLevel}
                    onChange={(e) =>
                      setLogData({ ...logData, energyLevel: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="font-mono log-label">Sleep (hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="8"
                    value={logData.sleepHours}
                    onChange={(e) =>
                      setLogData({ ...logData, sleepHours: e.target.value })
                    }
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="font-mono log-label">Notes</label>
                  <textarea
                    rows={2}
                    placeholder="How was your day..."
                    value={logData.notes}
                    onChange={(e) =>
                      setLogData({ ...logData, notes: e.target.value })
                    }
                    className="input-field"
                    style={{ resize: "vertical", minHeight: "60px" }}
                  />
                </div>

                <button
                  onClick={handleLog}
                  disabled={logMutation.isPending}
                  className="btn-primary"
                  style={{ width: "100%" }}
                >
                  <Save size={13} />
                  {logMutation.isPending ? "Saving..." : "Save Progress"}
                </button>
              </div>
            </div>

            {adviceData?.advice && (
              <div className="advice-card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "0.875rem",
                  }}
                >
                  <Brain size={14} style={{ color: "#c4a87a" }} />
                  <span className="font-mono advice-label">AI Analysis</span>
                </div>
                <p className="advice-text">{adviceData.advice.analysis}</p>
                <p className="advice-encouragement">
                  {adviceData.advice.encouragement}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .progress-page {
          max-width: 1400px;
          margin: 0 auto;
        }
        .progress-page-header {
          margin-bottom: 1.5rem;
        }
        .progress-header-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .progress-tag {
          font-size: 9px;
          color: #c4a87a;
          letter-spacing: 0.3em;
          font-weight: 700;
          text-transform: uppercase;
        }
        .progress-page-title {
          font-size: 1.75rem;
          color: #0d3d35;
          letter-spacing: -0.02em;
        }
        .progress-period-tabs {
          display: flex;
          gap: 6px;
        }
        .period-tab {
          padding: 0.5rem 1rem;
          border: 1.5px solid;
          border-radius: 9999px;
          cursor: pointer;
          font-family: Space Grotesk;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          transition: all 0.3s;
        }
        .progress-content-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        .progress-main,
        .progress-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .log-card {
          padding: 1.25rem;
        }
        .log-title {
          font-size: 1.25rem;
          color: #0d3d35;
          margin-bottom: 4px;
          letter-spacing: -0.01em;
        }
        .log-subtitle {
          font-size: 9px;
          color: #6b7068;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 1.25rem;
        }
        .log-form {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
        }
        .log-label {
          font-size: 9px;
          color: #0d3d35;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          display: block;
          margin-bottom: 6px;
        }
        .mood-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 5px;
        }
        .mood-btn {
          padding: 8px 4px;
          border: 1.5px solid;
          border-radius: 7px;
          cursor: pointer;
          font-size: 9px;
          font-family: Inter;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          transition: all 0.2s;
        }
        .energy-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .energy-value {
          font-size: 1.125rem;
          color: #c4a87a;
        }
        .advice-card {
          background: #0d3d35;
          color: #f5f3ee;
          padding: 1.25rem;
          border-radius: 16px;
        }
        .advice-label {
          font-size: 9px;
          color: #c4a87a;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .advice-text {
          font-size: 12px;
          color: rgba(245, 243, 238, 0.85);
          font-family: Inter;
          line-height: 1.65;
          margin-bottom: 10px;
        }
        .advice-encouragement {
          font-size: 12px;
          color: #f5f3ee;
          font-family: Inter;
          line-height: 1.65;
          font-weight: 500;
        }
        @media (min-width: 480px) {
          .progress-page-title {
            font-size: 2rem;
          }
          .progress-tag {
            font-size: 10px;
          }
          .period-tab {
            font-size: 11px;
            padding: 0.625rem 1.25rem;
          }
          .log-card {
            padding: 1.5rem;
          }
          .log-title {
            font-size: 1.375rem;
          }
          .log-label {
            font-size: 10px;
          }
          .mood-btn {
            font-size: 10px;
            padding: 10px 4px;
          }
          .advice-card {
            padding: 1.5rem;
          }
          .advice-text,
          .advice-encouragement {
            font-size: 13px;
          }
        }
        @media (min-width: 768px) {
          .progress-header-content {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
          }
        }
        @media (min-width: 1024px) {
          .progress-page-title {
            font-size: 2.25rem;
          }
          .progress-content-grid {
            grid-template-columns: 1fr 340px;
          }
          .progress-main,
          .progress-sidebar {
            gap: 1.25rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Progress;

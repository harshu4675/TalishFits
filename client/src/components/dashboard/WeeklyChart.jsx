import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BarChart3 } from "lucide-react";

const formatDateShort = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div
      style={{
        background: "#0d3d35",
        borderRadius: "10px",
        padding: "10px 14px",
        border: "1px solid rgba(245, 243, 238, 0.1)",
        boxShadow: "0 12px 30px rgba(13, 61, 53, 0.3)",
      }}
    >
      <p
        className="font-mono"
        style={{
          fontSize: "10px",
          color: "#c4a87a",
          marginBottom: "6px",
          letterSpacing: "0.2em",
          fontWeight: 600,
        }}
      >
        {label}
      </p>
      {payload.map((entry, i) => (
        <div
          key={i}
          style={{ display: "flex", alignItems: "center", gap: "8px" }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: entry.color,
            }}
          />
          <span
            style={{
              fontSize: "11px",
              color: "rgba(245, 243, 238, 0.6)",
              fontFamily: "Inter",
              textTransform: "capitalize",
            }}
          >
            {entry.dataKey}:
          </span>
          <span
            className="font-mono"
            style={{ fontSize: "11px", color: "#f5f3ee", fontWeight: 700 }}
          >
            {Math.round(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const WeeklyChart = ({ weekProgress }) => {
  const [activeChart, setActiveChart] = useState("calories");

  const chartData = (() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const dayName = dayNames[date.getDay()];

      const dayData = weekProgress.find(
        (p) => new Date(p.date).toISOString().split("T")[0] === dateStr,
      );

      last7Days.push({
        day: dayName,
        date: formatDateShort(date),
        calories: dayData?.nutrition?.calories || 0,
        burned: dayData?.workout?.caloriesBurned || 0,
        protein: dayData?.nutrition?.protein || 0,
        water: dayData?.nutrition?.water || 0,
      });
    }
    return last7Days;
  })();

  const tabs = [
    { id: "calories", label: "Calories", color: "#0d3d35" },
    { id: "protein", label: "Protein", color: "#1a5d52" },
    { id: "burned", label: "Burned", color: "#c4a87a" },
    { id: "water", label: "Water", color: "#4a7c59" },
  ];

  const activeColor =
    tabs.find((t) => t.id === activeChart)?.color || "#0d3d35";

  return (
    <div className="premium-card weekly-chart-card">
      <div className="weekly-chart-header">
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div className="weekly-chart-icon-wrapper">
            <BarChart3 className="weekly-chart-icon-svg" strokeWidth={2} />
          </div>
          <div>
            <h3
              className="font-display weekly-chart-title"
              style={{ color: "#0d3d35", letterSpacing: "-0.01em" }}
            >
              Weekly Overview
            </h3>
            <p
              className="font-mono"
              style={{
                fontSize: "9px",
                color: "#6b7068",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginTop: "2px",
              }}
            >
              Last 7 Days
            </p>
          </div>
        </div>

        <div className="weekly-chart-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveChart(tab.id)}
              className="weekly-chart-tab"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: activeChart === tab.id ? "#f5f3ee" : "#6b7068",
                transition: "color 0.3s",
                position: "relative",
              }}
            >
              {activeChart === tab.id && (
                <motion.div
                  layoutId="activeChartTab"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: tab.color,
                    borderRadius: "6px",
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <span style={{ position: "relative", zIndex: 1 }}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="weekly-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 5, bottom: 0, left: -25 }}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={activeColor} stopOpacity={0.2} />
                <stop offset="100%" stopColor={activeColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(13, 61, 53, 0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 10,
                fill: "#6b7068",
                fontFamily: "Inter",
                fontWeight: 600,
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "#9ca09a", fontFamily: "Inter" }}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Area
              type="monotone"
              dataKey={activeChart}
              stroke={activeColor}
              strokeWidth={2.5}
              fill="url(#chartGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: activeColor,
                stroke: "#ffffff",
                strokeWidth: 3,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <style>{`
        .weekly-chart-card {
          padding: 1.25rem;
        }

        .weekly-chart-header {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.25rem;
        }

        .weekly-chart-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #0d3d35;
          color: #f5f3ee;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .weekly-chart-icon-svg {
          width: 16px;
          height: 16px;
        }

        .weekly-chart-title {
          font-size: 1.25rem;
        }

        .weekly-chart-tabs {
          display: flex;
          gap: 4px;
          padding: 4px;
          background: #e8ebe5;
          border-radius: 8px;
          overflow-x: auto;
          flex-shrink: 0;
        }

        .weekly-chart-tab {
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 9px;
          font-family: Inter;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .weekly-chart-container {
          height: 180px;
          margin: 0 -0.5rem;
        }

        @media (min-width: 480px) {
          .weekly-chart-card {
            padding: 1.5rem;
          }
          .weekly-chart-title {
            font-size: 1.375rem;
          }
          .weekly-chart-tab {
            font-size: 10px;
            padding: 6px 12px;
          }
          .weekly-chart-container {
            height: 200px;
          }
        }

        @media (min-width: 640px) {
          .weekly-chart-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        @media (min-width: 1024px) {
          .weekly-chart-card {
            padding: 1.75rem;
          }
          .weekly-chart-icon-wrapper {
            width: 40px;
            height: 40px;
          }
          .weekly-chart-icon-svg {
            width: 18px;
            height: 18px;
          }
          .weekly-chart-container {
            height: 220px;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default WeeklyChart;

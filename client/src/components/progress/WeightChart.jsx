import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Scale, TrendingDown, TrendingUp } from "lucide-react";

const formatDateShort = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: "#0d3d35",
        borderRadius: "10px",
        padding: "10px 14px",
        boxShadow: "0 12px 30px rgba(13, 61, 53, 0.3)",
      }}
    >
      <p
        className="font-mono"
        style={{
          fontSize: "10px",
          color: "#c4a87a",
          letterSpacing: "0.2em",
          fontWeight: 700,
          marginBottom: "4px",
        }}
      >
        {payload[0].payload.date}
      </p>
      <p
        className="font-display"
        style={{ fontSize: "1.125rem", color: "#f5f3ee", lineHeight: 1 }}
      >
        {payload[0].value} kg
      </p>
    </div>
  );
};

const WeightChart = ({ data }) => {
  const chartData = data.map((d) => ({
    date: formatDateShort(d.date),
    weight: d.value,
  }));
  const firstWeight = chartData[0]?.weight || 0;
  const lastWeight = chartData[chartData.length - 1]?.weight || 0;
  const change = lastWeight - firstWeight;
  const isLoss = change < 0;

  return (
    <div className="premium-card" style={{ padding: "1.75rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "#0d3d35",
              color: "#c4a87a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Scale size={17} strokeWidth={2} />
          </div>
          <div>
            <h3
              className="font-display"
              style={{
                fontSize: "1.375rem",
                color: "#0d3d35",
                letterSpacing: "-0.01em",
              }}
            >
              Weight Trend
            </h3>
            <p
              className="font-mono"
              style={{
                fontSize: "10px",
                color: "#6b7068",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginTop: "2px",
              }}
            >
              {chartData.length} {chartData.length === 1 ? "Entry" : "Entries"}
            </p>
          </div>
        </div>

        {chartData.length >= 2 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              background: isLoss
                ? "rgba(74, 124, 89, 0.1)"
                : "rgba(196, 168, 122, 0.1)",
              borderRadius: "9999px",
              border: `1px solid ${isLoss ? "rgba(74, 124, 89, 0.2)" : "rgba(196, 168, 122, 0.2)"}`,
            }}
          >
            {isLoss ? (
              <TrendingDown size={13} style={{ color: "#4a7c59" }} />
            ) : (
              <TrendingUp size={13} style={{ color: "#c4a87a" }} />
            )}
            <span
              className="font-mono"
              style={{
                fontSize: "12px",
                color: isLoss ? "#4a7c59" : "#c4a87a",
                fontWeight: 700,
              }}
            >
              {isLoss ? "" : "+"}
              {change.toFixed(1)} kg
            </span>
          </div>
        )}
      </div>

      <div style={{ height: "220px" }}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(13, 61, 53, 0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
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
                tick={{ fontSize: 10, fill: "#9ca09a", fontFamily: "Inter" }}
                domain={["dataMin - 2", "dataMax + 2"]}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#0d3d35"
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: "#c4a87a",
                  stroke: "#0d3d35",
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 6,
                  fill: "#0d3d35",
                  stroke: "#c4a87a",
                  strokeWidth: 3,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <Scale size={32} style={{ color: "#9ca09a", opacity: 0.4 }} />
            <p
              style={{
                fontSize: "13px",
                color: "#6b7068",
                fontFamily: "Inter",
              }}
            >
              No weight data yet
            </p>
            <p
              style={{
                fontSize: "11px",
                color: "#9ca09a",
                fontFamily: "Inter",
              }}
            >
              Start logging to see your trend
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeightChart;

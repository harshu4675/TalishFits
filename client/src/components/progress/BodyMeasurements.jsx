import React from "react";
import { useQuery } from "@tanstack/react-query";
import { progressAPI } from "../../api/progressApi";
import { Ruler } from "lucide-react";

const BodyMeasurements = () => {
  const { data } = useQuery({
    queryKey: ["measurements"],
    queryFn: () => progressAPI.getMeasurements(),
    select: (res) => res.data.data,
  });

  const measurements = data?.latest;
  const fields = [
    { key: "chest", label: "Chest" },
    { key: "waist", label: "Waist" },
    { key: "hips", label: "Hips" },
    { key: "bicep", label: "Bicep" },
    { key: "thigh", label: "Thigh" },
    { key: "shoulder", label: "Shoulders" },
  ];

  return (
    <div className="premium-card" style={{ padding: "1.75rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "#1a5d52",
            color: "#f5f3ee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ruler size={17} strokeWidth={2} />
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
            Body Measurements
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
            Track Your Physique
          </p>
        </div>
      </div>

      {measurements ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "12px",
          }}
        >
          {fields.map(({ key, label }) => (
            <div
              key={key}
              style={{
                padding: "1rem",
                background: "#f5f3ee",
                borderRadius: "12px",
                border: "1px solid rgba(13, 61, 53, 0.04)",
              }}
            >
              <p
                className="font-mono"
                style={{
                  fontSize: "9px",
                  color: "#6b7068",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  marginBottom: "6px",
                }}
              >
                {label}
              </p>
              <p
                className="font-display"
                style={{ fontSize: "1.5rem", color: "#0d3d35", lineHeight: 1 }}
              >
                {measurements[key] ? `${measurements[key]}` : "—"}
                {measurements[key] && (
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "#6b7068",
                      marginLeft: "4px",
                    }}
                  >
                    cm
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
          <Ruler
            size={28}
            style={{
              color: "#9ca09a",
              opacity: 0.4,
              margin: "0 auto 12px auto",
            }}
          />
          <p
            style={{
              fontSize: "13px",
              color: "#6b7068",
              fontFamily: "Inter",
              marginBottom: "4px",
            }}
          >
            No measurements logged yet
          </p>
          <p
            style={{ fontSize: "11px", color: "#9ca09a", fontFamily: "Inter" }}
          >
            Track your progress visually
          </p>
        </div>
      )}
    </div>
  );
};

export default BodyMeasurements;

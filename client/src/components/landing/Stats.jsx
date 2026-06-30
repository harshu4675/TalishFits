import React, { useRef, useEffect } from "react";
import { useInView } from "react-intersection-observer";

const StatItem = ({ value, suffix, label }) => {
  const ref = useRef(null);
  const animated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const duration = 2200;
          const start = performance.now();
          const run = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            if (ref.current)
              ref.current.textContent = Math.round(
                value * eased,
              ).toLocaleString();
            if (p < 1) requestAnimationFrame(run);
          };
          requestAnimationFrame(run);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div style={{ textAlign: "left", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
        <span
          ref={ref}
          className="font-display stat-value"
          style={{ color: "#0d3d35", lineHeight: 1, letterSpacing: "-0.02em" }}
        >
          0
        </span>
        <span
          className="font-display stat-suffix"
          style={{ color: "#c4a87a", lineHeight: 1 }}
        >
          {suffix}
        </span>
      </div>
      <p
        className="font-mono stat-label"
        style={{
          color: "#6b7068",
          letterSpacing: "0.25em",
          fontWeight: 600,
          marginTop: "0.75rem",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
    </div>
  );
};

const Stats = () => {
  const { ref } = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <section
      ref={ref}
      style={{
        position: "relative",
        padding: "clamp(4rem, 8vw, 7rem) 0",
        backgroundColor: "#d8e0d4",
        overflow: "hidden",
      }}
    >
      <div className="section-container">
        <div
          className="stats-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "2rem",
          }}
        >
          <StatItem value={12000} suffix="+" label="Active Athletes" />
          <StatItem value={50000} suffix="+" label="Workouts" />
          <StatItem value={98} suffix="%" label="Success Rate" />
          <StatItem value={340000} suffix="+" label="Meals Planned" />
        </div>
      </div>

      <style>{`
        .stat-value {
          font-size: clamp(2rem, 8vw, 4.5rem);
        }

        .stat-suffix {
          font-size: clamp(1.25rem, 5vw, 3rem);
        }

        .stat-label {
          font-size: 9px;
        }

        @media (min-width: 480px) {
          .stat-label {
            font-size: 10px;
          }
        }

        @media (min-width: 640px) {
          .stat-label {
            font-size: 11px;
          }

          .stats-grid {
            gap: 2.5rem !important;
          }
        }

        @media (min-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 2rem !important;
          }
        }

        @media (min-width: 1024px) {
          .stat-value {
            font-size: 4rem;
          }
          .stat-suffix {
            font-size: 2.5rem;
          }
          .stats-grid {
            gap: 3rem !important;
          }
        }

        @media (min-width: 1280px) {
          .stat-value {
            font-size: 5rem;
          }
          .stat-suffix {
            font-size: 3rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Stats;

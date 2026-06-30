import React from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { progressAPI } from "../../api/progressApi";
import { Dumbbell, UtensilsCrossed, Scale, Activity } from "lucide-react";

const formatRelativeTime = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const activityIcons = {
  workout: { icon: Dumbbell, color: "#0d3d35" },
  nutrition: { icon: UtensilsCrossed, color: "#4a7c59" },
  weight: { icon: Scale, color: "#c4a87a" },
  default: { icon: Activity, color: "#6b7068" },
};

const RecentActivity = () => {
  const { data } = useQuery({
    queryKey: ["recentProgress"],
    queryFn: () => progressAPI.getHistory({ period: "7" }),
    select: (res) => res.data.data,
  });

  const activities = React.useMemo(() => {
    if (!data?.progress) return [];
    const items = [];
    data.progress.forEach((entry) => {
      if (entry.workout?.completed) {
        items.push({
          type: "workout",
          text: `Completed ${entry.workout.workoutType || "workout"}`,
          detail: `${entry.workout.caloriesBurned || 0} cal burned`,
          date: entry.date,
        });
      }
      if (entry.weight) {
        items.push({
          type: "weight",
          text: "Logged weight",
          detail: `${entry.weight} kg`,
          date: entry.date,
        });
      }
      if (entry.nutrition?.calories > 0) {
        items.push({
          type: "nutrition",
          text: "Logged nutrition",
          detail: `${entry.nutrition.calories} cal`,
          date: entry.date,
        });
      }
    });
    return items
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [data]);

  if (activities.length === 0) {
    return (
      <div className="recent-activity-card">
        <h3
          className="font-mono activity-title"
          style={{
            color: "#0d3d35",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontWeight: 700,
            marginBottom: "1rem",
          }}
        >
          Recent Activity
        </h3>
        <div className="activity-empty">
          <Activity
            className="activity-empty-icon"
            style={{ color: "#9ca09a", opacity: 0.4 }}
          />
          <p
            className="activity-empty-text"
            style={{ color: "#6b7068", fontFamily: "Inter" }}
          >
            No activity yet
          </p>
          <p
            className="activity-empty-sub"
            style={{ color: "#9ca09a", fontFamily: "Inter" }}
          >
            Start a workout to begin
          </p>
        </div>

        <style>{`
          .recent-activity-card {
            background: #ffffff;
            border: 1px solid rgba(13, 61, 53, 0.08);
            border-radius: 16px;
            padding: 1.25rem;
          }
          .activity-title {
            font-size: 9px;
          }
          .activity-empty {
            text-align: center;
            padding: 1rem 0;
          }
          .activity-empty-icon {
            width: 26px;
            height: 26px;
            margin: 0 auto 8px auto;
          }
          .activity-empty-text {
            font-size: 11px;
          }
          .activity-empty-sub {
            font-size: 9px;
            margin-top: 4px;
          }
          @media (min-width: 480px) {
            .recent-activity-card {
              padding: 1.5rem;
            }
            .activity-title {
              font-size: 10px;
            }
            .activity-empty-icon {
              width: 28px;
              height: 28px;
            }
            .activity-empty-text {
              font-size: 12px;
            }
            .activity-empty-sub {
              font-size: 10px;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="recent-activity-card">
      <h3
        className="font-mono activity-title"
        style={{
          color: "#0d3d35",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: "1rem",
        }}
      >
        Recent Activity
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        {activities.map((activity, i) => {
          const config = activityIcons[activity.type] || activityIcons.default;
          const Icon = config.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
              className="activity-row"
            >
              <div
                className="activity-icon-wrapper"
                style={{ background: config.color }}
              >
                <Icon size={12} strokeWidth={2} style={{ color: "#f5f3ee" }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  className="activity-text"
                  style={{
                    color: "#1a1a1a",
                    fontFamily: "Inter",
                    fontWeight: 600,
                  }}
                >
                  {activity.text}
                </p>
                <p
                  className="font-mono activity-detail"
                  style={{
                    color: "#6b7068",
                    marginTop: "2px",
                    letterSpacing: "0.05em",
                    fontWeight: 500,
                  }}
                >
                  {activity.detail}
                </p>
              </div>
              <span
                className="font-mono activity-time"
                style={{
                  color: "#9ca09a",
                  flexShrink: 0,
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                }}
              >
                {formatRelativeTime(activity.date)}
              </span>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .recent-activity-card {
          background: #ffffff;
          border: 1px solid rgba(13, 61, 53, 0.08);
          border-radius: 16px;
          padding: 1.25rem;
        }

        .activity-title {
          font-size: 9px;
        }

        .activity-row {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 0;
        }

        .activity-icon-wrapper {
          width: 26px;
          height: 26px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-text {
          font-size: 11px;
        }

        .activity-detail {
          font-size: 9px;
        }

        .activity-time {
          font-size: 8px;
        }

        @media (min-width: 480px) {
          .recent-activity-card {
            padding: 1.5rem;
          }
          .activity-title {
            font-size: 10px;
          }
          .activity-row {
            padding: 10px 0;
            gap: 12px;
          }
          .activity-icon-wrapper {
            width: 28px;
            height: 28px;
          }
          .activity-text {
            font-size: 12px;
          }
          .activity-detail {
            font-size: 10px;
          }
          .activity-time {
            font-size: 9px;
          }
        }
      `}</style>
    </div>
  );
};

export default RecentActivity;

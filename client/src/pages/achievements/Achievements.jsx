import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import { Trophy, Lock, Award, Zap, Flame } from "lucide-react";

const rarityConfig = {
  common: { label: "Common", color: "#4a7c59" },
  rare: { label: "Rare", color: "#1a5d52" },
  epic: { label: "Epic", color: "#0d3d35" },
  legendary: { label: "Legendary", color: "#c4a87a" },
};

const Achievements = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = "Achievements — TalishFits";
  }, []);

  const { data } = useQuery({
    queryKey: ["achievements"],
    queryFn: () => axiosInstance.get("/achievements"),
    select: (res) => res.data.data,
  });

  const checkMutation = useMutation({
    mutationFn: () => axiosInstance.post("/achievements/check"),
    onSuccess: (res) => {
      if (res.data.data.count > 0) {
        queryClient.invalidateQueries({ queryKey: ["achievements"] });
      }
    },
  });

  useEffect(() => {
    checkMutation.mutate();
  }, []);

  const achievements = data?.achievements || [];
  const earned = data?.earned || 0;
  const total = data?.total || 0;
  const overallProgress = total > 0 ? Math.round((earned / total) * 100) : 0;

  const categories = [...new Set(achievements.map((a) => a.category))];
  const gamification = user?.gamification || {};

  return (
    <DashboardLayout>
      <div className="achievements-page">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: "1.5rem" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "8px",
            }}
          >
            <div
              style={{ width: "24px", height: "1.5px", background: "#c4a87a" }}
            />
            <span className="font-mono ach-tag">Your Milestones</span>
          </div>
          <h1 className="font-display ach-title">Achievements.</h1>
          <p className="ach-subtitle">
            {earned} of {total} unlocked · {overallProgress}% complete
          </p>
        </motion.div>

        <div className="ach-stats-grid">
          {[
            {
              label: "Score",
              value: gamification.fitnessScore || 0,
              icon: Award,
            },
            { label: "Level", value: `${gamification.level || 1}`, icon: Zap },
            {
              label: "Total XP",
              value: (gamification.xp || 0).toLocaleString(),
              icon: Award,
            },
            {
              label: "Best Streak",
              value: `${gamification.streak?.longest || 0}d`,
              icon: Flame,
            },
          ].map((stat) => (
            <div key={stat.label} className="premium-card ach-stat-card">
              <div className="ach-stat-icon">
                <stat.icon size={16} strokeWidth={2} />
              </div>
              <div>
                <p className="font-display ach-stat-value">{stat.value}</p>
                <p className="font-mono ach-stat-label">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="level-progress-card">
          <div className="level-prog-header">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Zap size={13} style={{ color: "#c4a87a" }} />
              <span className="font-mono level-prog-label">
                Level {gamification.level || 1}
              </span>
            </div>
            <span className="font-mono level-prog-xp">
              {(gamification.xp || 0) % 500} / 500 XP
            </span>
          </div>
          <div
            style={{
              height: "5px",
              background: "rgba(245, 243, 238, 0.1)",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((gamification.xp || 0) % 500) / 5}%` }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ height: "100%", background: "#c4a87a" }}
            />
          </div>
        </div>

        {categories.map((category) => {
          const categoryAchievements = achievements.filter(
            (a) => a.category === category,
          );
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ marginBottom: "1.75rem" }}
            >
              <div className="category-header">
                <Trophy size={12} style={{ color: "#c4a87a" }} />
                <h2 className="font-mono category-title">{category}</h2>
                <span className="font-mono category-count">
                  ({categoryAchievements.filter((a) => a.earned).length}/
                  {categoryAchievements.length})
                </span>
              </div>

              <div className="ach-grid">
                {categoryAchievements.map((achievement) => (
                  <AchievementItem
                    key={achievement.id}
                    achievement={achievement}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .achievements-page {
          max-width: 1400px;
          margin: 0 auto;
        }
        .ach-tag {
          font-size: 9px;
          color: #c4a87a;
          letter-spacing: 0.3em;
          font-weight: 700;
          text-transform: uppercase;
        }
        .ach-title {
          font-size: 1.75rem;
          color: #0d3d35;
          letter-spacing: -0.02em;
        }
        .ach-subtitle {
          font-size: 12px;
          color: #6b7068;
          font-family: Inter;
          margin-top: 6px;
        }
        .ach-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 1.25rem;
        }
        .ach-stat-card {
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ach-stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #0d3d35;
          color: #c4a87a;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ach-stat-value {
          font-size: 1.25rem;
          color: #0d3d35;
          line-height: 1;
        }
        .ach-stat-label {
          font-size: 8px;
          color: #6b7068;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
          margin-top: 3px;
        }
        .level-progress-card {
          background: #0d3d35;
          color: #f5f3ee;
          padding: 1.25rem;
          border-radius: 14px;
          margin-bottom: 1.5rem;
        }
        .level-prog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .level-prog-label {
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .level-prog-xp {
          font-size: 10px;
          color: #c4a87a;
          font-weight: 700;
          letter-spacing: 0.1em;
        }
        .category-header {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 1rem;
        }
        .category-title {
          font-size: 10px;
          color: #0d3d35;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .category-count {
          font-size: 10px;
          color: #6b7068;
          letter-spacing: 0.1em;
          font-weight: 600;
        }
        .ach-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        @media (min-width: 480px) {
          .ach-title {
            font-size: 2rem;
          }
          .ach-subtitle {
            font-size: 13px;
          }
          .ach-stat-card {
            padding: 1.25rem;
            gap: 12px;
          }
          .ach-stat-icon {
            width: 40px;
            height: 40px;
          }
          .ach-stat-value {
            font-size: 1.5rem;
          }
          .ach-stat-label {
            font-size: 9px;
          }
          .level-progress-card {
            padding: 1.5rem;
          }
          .level-prog-label {
            font-size: 11px;
          }
          .level-prog-xp {
            font-size: 11px;
          }
        }
        @media (min-width: 640px) {
          .ach-stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .ach-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
        @media (min-width: 1024px) {
          .ach-title {
            font-size: 2.25rem;
          }
          .ach-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

const AchievementItem = ({ achievement }) => {
  const { earned, isNew } = achievement;
  const rarity = rarityConfig[achievement.rarity] || rarityConfig.common;

  return (
    <motion.div
      whileHover={earned ? { y: -4 } : {}}
      className="ach-item"
      style={{
        background: earned ? "#ffffff" : "#f5f3ee",
        borderColor: earned ? rarity.color : "rgba(13, 61, 53, 0.06)",
        opacity: earned ? 1 : 0.55,
      }}
    >
      {isNew && <div className="font-mono ach-new-badge">NEW</div>}
      {!earned && <Lock size={10} className="ach-lock-icon" />}

      <div className="ach-item-content">
        <div
          className="ach-item-icon"
          style={{
            background: earned ? rarity.color : "rgba(13, 61, 53, 0.05)",
            color: earned ? "#f5f3ee" : "#9ca09a",
          }}
        >
          <Trophy size={20} strokeWidth={1.8} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            className="ach-name"
            style={{ color: earned ? "#0d3d35" : "#6b7068" }}
          >
            {achievement.name}
          </h3>
          <p
            className="ach-desc"
            style={{ color: earned ? "#6b7068" : "#9ca09a" }}
          >
            {achievement.description}
          </p>
          <div className="ach-meta">
            <span
              className="font-mono ach-rarity"
              style={{
                background: earned
                  ? `${rarity.color}15`
                  : "rgba(13, 61, 53, 0.04)",
                color: earned ? rarity.color : "#9ca09a",
                border: `1px solid ${earned ? rarity.color + "30" : "rgba(13, 61, 53, 0.06)"}`,
              }}
            >
              {rarity.label}
            </span>
            <span
              className="font-mono ach-xp"
              style={{ color: earned ? "#c4a87a" : "#9ca09a" }}
            >
              +{achievement.xpReward} XP
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .ach-item {
          position: relative;
          padding: 1rem;
          border: 1.5px solid;
          border-radius: 12px;
          transition: all 0.3s;
        }
        .ach-new-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          padding: 2px 6px;
          background: #c4a87a;
          color: #0d3d35;
          font-size: 8px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 700;
          border-radius: 4px;
        }
        .ach-lock-icon {
          position: absolute;
          top: 12px;
          right: 12px;
          color: #9ca09a;
        }
        .ach-item-content {
          display: flex;
          gap: 12px;
        }
        .ach-item-icon {
          width: 44px;
          height: 44px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ach-name {
          font-size: 13px;
          font-family: Inter;
          font-weight: 700;
          margin-bottom: 3px;
        }
        .ach-desc {
          font-size: 10px;
          font-family: Inter;
          line-height: 1.5;
          margin-bottom: 8px;
        }
        .ach-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }
        .ach-rarity {
          padding: 2px 7px;
          border-radius: 4px;
          font-size: 8px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 700;
        }
        .ach-xp {
          font-size: 9px;
          letter-spacing: 0.1em;
          font-weight: 700;
        }
        @media (min-width: 480px) {
          .ach-item {
            padding: 1.25rem;
          }
          .ach-item-icon {
            width: 52px;
            height: 52px;
          }
          .ach-name {
            font-size: 14px;
          }
          .ach-desc {
            font-size: 11px;
          }
          .ach-rarity {
            font-size: 9px;
          }
          .ach-xp {
            font-size: 10px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Achievements;

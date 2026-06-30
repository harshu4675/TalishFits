import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Flame,
  Droplets,
  Moon,
  Dumbbell,
  UtensilsCrossed,
  Trophy,
  Sparkles,
  AlertCircle,
} from "lucide-react";

const typeConfig = {
  motivation: { icon: Flame, color: "#c4a87a" },
  workout_reminder: { icon: Dumbbell, color: "#0d3d35" },
  water_reminder: { icon: Droplets, color: "#1a5d52" },
  sleep_reminder: { icon: Moon, color: "#1a5d52" },
  meal_reminder: { icon: UtensilsCrossed, color: "#4a7c59" },
  weekly_report: { icon: AlertCircle, color: "#0d3d35" },
  achievement: { icon: Trophy, color: "#c4a87a" },
  system: { icon: Bell, color: "#6b7068" },
  ai_tip: { icon: Sparkles, color: "#c4a87a" },
};

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

const Notifications = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    document.title = "Notifications — TalishFits";
  }, []);

  const { data } = useQuery({
    queryKey: ["notifications", filter],
    queryFn: () =>
      axiosInstance.get("/notifications", {
        params: {
          page: 1,
          limit: 30,
          unreadOnly: filter === "unread" ? "true" : "false",
        },
      }),
    select: (res) => res.data.data,
  });

  const markReadMutation = useMutation({
    mutationFn: (id) => axiosInstance.put(`/notifications/read/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/notifications/${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllRead = () => markReadMutation.mutate("all");

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  return (
    <DashboardLayout>
      <div className="notif-page">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="notif-page-header"
        >
          <div className="notif-header-row">
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
                <span className="font-mono notif-tag">Stay Updated</span>
              </div>
              <h1 className="font-display notif-title">Notifications.</h1>
              <p className="notif-subtitle">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "You're all caught up"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                disabled={markReadMutation.isPending}
                className="notif-mark-all-btn"
              >
                <CheckCheck size={12} />
                Mark All Read
              </button>
            )}
          </div>
        </motion.div>

        <div className="notif-filters">
          {[
            { id: "all", label: "All" },
            { id: "unread", label: `Unread (${unreadCount})` },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="notif-filter-btn"
              style={{
                background: filter === f.id ? "#0d3d35" : "#ffffff",
                color: filter === f.id ? "#f5f3ee" : "#0d3d35",
                borderColor:
                  filter === f.id ? "#0d3d35" : "rgba(13, 61, 53, 0.1)",
              }}
            >
              {f.label.toUpperCase()}
            </button>
          ))}
        </div>

        {notifications.length === 0 ? (
          <div className="notif-empty">
            <Bell size={32} className="notif-empty-icon" />
            <h3 className="font-display notif-empty-title">
              No notifications yet
            </h3>
            <p className="notif-empty-text">
              We'll notify you about workouts, meals, and achievements.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <AnimatePresence>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkRead={() => markReadMutation.mutate(notification._id)}
                  onDelete={() => deleteMutation.mutate(notification._id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <style>{`
        .notif-page {
          max-width: 900px;
          margin: 0 auto;
        }
        .notif-page-header {
          margin-bottom: 1.5rem;
        }
        .notif-header-row {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .notif-tag {
          font-size: 9px;
          color: #c4a87a;
          letter-spacing: 0.3em;
          font-weight: 700;
          text-transform: uppercase;
        }
        .notif-title {
          font-size: 1.75rem;
          color: #0d3d35;
          letter-spacing: -0.02em;
        }
        .notif-subtitle {
          font-size: 12px;
          color: #6b7068;
          font-family: Inter;
          margin-top: 6px;
        }
        .notif-mark-all-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0.5rem 1rem;
          background: transparent;
          color: #0d3d35;
          border: 1.5px solid #0d3d35;
          border-radius: 9999px;
          cursor: pointer;
          font-family: Inter;
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .notif-filters {
          display: flex;
          gap: 6px;
          margin-bottom: 1.25rem;
        }
        .notif-filter-btn {
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
        .notif-empty {
          text-align: center;
          padding: 3.5rem 1.5rem;
          background: #ffffff;
          border-radius: 16px;
          border: 1px solid rgba(13, 61, 53, 0.06);
        }
        .notif-empty-icon {
          color: #9ca09a;
          opacity: 0.5;
          margin: 0 auto 0.875rem auto;
        }
        .notif-empty-title {
          font-size: 1.25rem;
          color: #0d3d35;
          margin-bottom: 6px;
        }
        .notif-empty-text {
          font-size: 12px;
          color: #6b7068;
          font-family: Inter;
        }
        @media (min-width: 480px) {
          .notif-title {
            font-size: 2rem;
          }
          .notif-subtitle {
            font-size: 13px;
          }
          .notif-mark-all-btn {
            font-size: 11px;
            padding: 0.625rem 1.25rem;
          }
          .notif-filter-btn {
            font-size: 11px;
            padding: 0.625rem 1.25rem;
          }
          .notif-empty {
            padding: 5rem 2rem;
          }
          .notif-empty-title {
            font-size: 1.5rem;
          }
          .notif-empty-text {
            font-size: 13px;
          }
        }
        @media (min-width: 640px) {
          .notif-header-row {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-end;
          }
          .notif-mark-all-btn {
            flex-shrink: 0;
          }
        }
        @media (min-width: 1024px) {
          .notif-title {
            font-size: 2.25rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

const NotificationItem = ({ notification, onMarkRead, onDelete }) => {
  const config = typeConfig[notification.type] || typeConfig.system;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      exit={{ opacity: 0, x: -100, height: 0 }}
      className="notif-item"
      style={{
        borderLeft: !notification.isRead
          ? `3px solid ${config.color}`
          : "1px solid rgba(13, 61, 53, 0.08)",
      }}
    >
      <div className="notif-item-content">
        <div className="notif-item-icon" style={{ background: config.color }}>
          <Icon size={14} strokeWidth={2} style={{ color: "#f5f3ee" }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="notif-item-header">
            <h4
              className="notif-item-title"
              style={{ color: notification.isRead ? "#2a2a2a" : "#0d3d35" }}
            >
              {notification.title}
            </h4>
            <span className="font-mono notif-item-time">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>
          <p
            className="notif-item-message"
            style={{ color: notification.isRead ? "#6b7068" : "#2a2a2a" }}
          >
            {notification.message}
          </p>
        </div>

        <div className="notif-item-actions">
          {!notification.isRead && (
            <button
              onClick={onMarkRead}
              className="notif-action-btn"
              title="Mark as read"
            >
              <Check size={11} />
            </button>
          )}
          <button
            onClick={onDelete}
            className="notif-action-btn notif-action-btn-danger"
            title="Delete"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>

      <style>{`
        .notif-item {
          background: #ffffff;
          border-radius: 12px;
          border: 1px solid rgba(13, 61, 53, 0.08);
          overflow: hidden;
          transition: all 0.3s;
        }
        .notif-item-content {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 1rem 1.125rem;
        }
        .notif-item-icon {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .notif-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 3px;
          flex-wrap: wrap;
        }
        .notif-item-title {
          font-size: 13px;
          font-family: Inter;
          font-weight: 700;
        }
        .notif-item-time {
          font-size: 9px;
          color: #9ca09a;
          flex-shrink: 0;
          letter-spacing: 0.1em;
          font-weight: 600;
          white-space: nowrap;
        }
        .notif-item-message {
          font-size: 11px;
          font-family: Inter;
          line-height: 1.6;
        }
        .notif-item-actions {
          display: flex;
          gap: 5px;
          flex-shrink: 0;
        }
        .notif-action-btn {
          width: 26px;
          height: 26px;
          border-radius: 6px;
          background: #f5f3ee;
          border: 1px solid rgba(13, 61, 53, 0.06);
          color: #6b7068;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .notif-action-btn:hover {
          background: #0d3d35;
          color: #f5f3ee;
          border-color: #0d3d35;
        }
        .notif-action-btn-danger:hover {
          background: #a84838;
          border-color: #a84838;
        }
        @media (min-width: 480px) {
          .notif-item-content {
            padding: 1.125rem 1.25rem;
            gap: 12px;
          }
          .notif-item-icon {
            width: 40px;
            height: 40px;
          }
          .notif-item-title {
            font-size: 14px;
          }
          .notif-item-time {
            font-size: 10px;
          }
          .notif-item-message {
            font-size: 12px;
          }
          .notif-action-btn {
            width: 28px;
            height: 28px;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default Notifications;

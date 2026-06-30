const Notification = require("../models/Notification");
const User = require("../models/User");
const { asyncHandler } = require("../middleware/errorHandler");
const { successResponse } = require("../utils/responseHandler");

const NOTIFICATION_TEMPLATES = {
  morning_motivation: [
    {
      title: "Rise & Conquer 🌅",
      message:
        "Small steps every day lead to massive results. Your journey continues today.",
    },
    {
      title: "Good Morning Warrior 🔥",
      message:
        "Yesterday you said tomorrow. Today IS tomorrow. Let's make it count.",
    },
    {
      title: "New Day, New Gains 💪",
      message:
        "The sun is up. Your competition is training. What's your excuse?",
    },
  ],
  workout_reminder: [
    {
      title: "Time to Train 💪",
      message: "Your body is ready. Your workout is waiting. No excuses today.",
    },
    {
      title: "Workout Time 🏋️",
      message: "Discipline beats motivation every single day. Get it done.",
    },
    {
      title: "Skip Netflix, Hit the Gym 🎯",
      message:
        "Your future self will thank you. 45 minutes. That's all it takes.",
    },
  ],
  water_reminder: [
    {
      title: "Hydrate or Die-drate 💧",
      message:
        "You're probably dehydrated right now. Drink a glass of water immediately.",
    },
    {
      title: "Water Check 💦",
      message: "Performance drops by 20% when dehydrated. Drink up, champion.",
    },
  ],
  sleep_reminder: [
    {
      title: "Recovery Time 😴",
      message:
        "Muscle is built while you sleep. Wind down and get your 8 hours.",
    },
    {
      title: "Sleep Is Training Too 🌙",
      message:
        "Champions sleep early. Put the phone down. Your gains depend on it.",
    },
  ],
  meal_reminder: [
    {
      title: "Meal Time ⏰",
      message: "Nutrition is 70% of your results. Don't miss this meal.",
    },
    {
      title: "Fuel Your Body 🥗",
      message:
        "Your muscles are waiting for nutrition. Time to eat strategically.",
    },
  ],
  weekly_report: [
    {
      title: "Your Weekly Report Is Ready 📊",
      message: "See how you performed this week and what to improve next week.",
    },
  ],
};

// ─── GET NOTIFICATIONS ────────────────────────────────────────────────────────
const getNotifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;

  const query = { user: req.user._id };
  if (unreadOnly === "true") query.isRead = false;

  const [notifications, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit)),
    Notification.countDocuments({ user: req.user._id, isRead: false }),
  ]);

  return successResponse(res, 200, "Notifications fetched", {
    notifications,
    unreadCount,
    page: parseInt(page),
    limit: parseInt(limit),
  });
});

// ─── MARK AS READ ─────────────────────────────────────────────────────────────
const markAsRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;

  if (notificationId === "all") {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true },
    );
    return successResponse(res, 200, "All notifications marked as read");
  }

  await Notification.findOneAndUpdate(
    { _id: notificationId, user: req.user._id },
    { isRead: true },
  );

  return successResponse(res, 200, "Notification marked as read");
});

// ─── CREATE NOTIFICATION ──────────────────────────────────────────────────────
const createNotification = asyncHandler(async (req, res) => {
  const { title, message, type, metadata, actionUrl } = req.body;

  const notification = await Notification.create({
    user: req.user._id,
    title,
    message,
    type,
    metadata,
    actionUrl,
  });

  return successResponse(res, 201, "Notification created", { notification });
});

// ─── SEND SCHEDULED NOTIFICATIONS ─────────────────────────────────────────────
const sendScheduledNotifications = async () => {
  const users = await User.find({
    isActive: true,
    "preferences.notifications.morning": true,
  }).select("_id name preferences gamification");

  const hour = new Date().getHours();
  let notificationType = null;

  if (hour >= 6 && hour < 8) notificationType = "morning_motivation";
  else if (hour >= 8 && hour < 10) notificationType = "workout_reminder";
  else if (hour >= 12 && hour < 13) notificationType = "water_reminder";
  else if (hour >= 13 && hour < 14) notificationType = "meal_reminder";
  else if (hour >= 17 && hour < 18) notificationType = "water_reminder";
  else if (hour >= 20 && hour < 21) notificationType = "workout_reminder";
  else if (hour >= 22 && hour < 23) notificationType = "sleep_reminder";

  if (!notificationType) return;

  const templates = NOTIFICATION_TEMPLATES[notificationType];
  const bulkOps = [];

  for (const user of users) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    bulkOps.push({
      insertOne: {
        document: {
          user: user._id,
          title: template.title,
          message: template.message,
          type: notificationType
            .replace("_reminder", "_reminder")
            .replace("morning_motivation", "motivation"),
          isRead: false,
          isDelivered: false,
          createdAt: new Date(),
        },
      },
    });
  }

  if (bulkOps.length > 0) {
    await Notification.bulkWrite(bulkOps);
  }
};

// ─── DELETE NOTIFICATION ──────────────────────────────────────────────────────
const deleteNotification = asyncHandler(async (req, res) => {
  await Notification.findOneAndDelete({
    _id: req.params.notificationId,
    user: req.user._id,
  });

  return successResponse(res, 200, "Notification deleted");
});

module.exports = {
  getNotifications,
  markAsRead,
  createNotification,
  sendScheduledNotifications,
  deleteNotification,
};

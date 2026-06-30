const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "motivation",
        "workout_reminder",
        "water_reminder",
        "sleep_reminder",
        "meal_reminder",
        "weekly_report",
        "achievement",
        "system",
        "ai_tip",
      ],
      required: true,
    },
    icon: String,
    color: String,
    isRead: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    scheduledFor: Date,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    actionUrl: String,
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);

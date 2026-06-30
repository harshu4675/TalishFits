const mongoose = require("mongoose");

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    enum: ["strength", "cardio", "flexibility", "hiit", "warmup", "cooldown"],
  },
  musclesWorked: [String],
  primaryMuscle: String,
  equipment: [String],
  difficulty: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
  },
  sets: Number,
  reps: { min: Number, max: Number },
  duration: Number,
  restTime: Number,
  calories: Number,
  instructions: [String],
  tips: [String],
  commonMistakes: [String],
  videoUrl: String,
  imageUrl: String,
  alternatives: [String],
  isCompound: Boolean,
  order: Number,
});

const workoutDaySchema = new mongoose.Schema({
  dayNumber: Number,
  dayName: String,
  focus: String,
  type: {
    type: String,
    enum: [
      "strength",
      "cardio",
      "hiit",
      "rest",
      "active_recovery",
      "full_body",
    ],
  },
  totalDuration: Number,
  totalCalories: Number,
  warmup: [exerciseSchema],
  exercises: [exerciseSchema],
  cooldown: [exerciseSchema],
  cardio: {
    type: String,
    duration: Number,
    intensity: String,
  },
  notes: String,
  isRestDay: { type: Boolean, default: false },
});

const workoutPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
    },
    title: { type: String, required: true },
    description: String,
    type: {
      type: String,
      enum: ["gym", "home", "outdoor", "mixed"],
      default: "gym",
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
    },
    duration: {
      weeks: Number,
      daysPerWeek: Number,
      minutesPerSession: Number,
    },
    schedule: [workoutDaySchema],
    isActive: { type: Boolean, default: true },
    isAIGenerated: { type: Boolean, default: true },
    completedDays: [
      {
        date: Date,
        dayNumber: Number,
        completed: Boolean,
        feedback: String,
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    weekNumber: { type: Number, default: 1 },
    tags: [String],
  },
  { timestamps: true },
);

workoutPlanSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model("WorkoutPlan", workoutPlanSchema);

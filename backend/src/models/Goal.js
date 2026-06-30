const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "lean",
        "athletic",
        "muscular",
        "bodybuilder",
        "fat_loss",
        "six_pack",
        "v_shape",
        "womens_toned",
        "powerlifting",
        "functional_fitness",
      ],
      required: true,
    },
    title: String,
    description: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    targetDate: Date,
    estimatedWeeks: Number,

    // AI Generated Roadmap
    roadmap: {
      overview: String,
      expectedTransformation: String,
      difficulty: String,
      calorieTarget: Number,
      weeklyTargets: [
        {
          week: Number,
          goal: String,
          workouts: Number,
          targetWeight: Number,
          calories: Number,
          focus: String,
        },
      ],
      monthlyTargets: [
        {
          month: Number,
          goal: String,
          expectedWeightChange: Number,
          milestones: [String],
        },
      ],
    },

    // Progress tracking
    currentWeight: Number,
    targetWeight: Number,
    startWeight: Number,
    progressPercentage: {
      type: Number,
      default: 0,
    },

    // Generated Plans
    workoutPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkoutPlan",
    },
    dietPlanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Meal",
    },

    // Supplements & Recovery
    supplements: [
      {
        name: String,
        timing: String,
        dosage: String,
        purpose: String,
      },
    ],
    recoveryAdvice: [String],
    sleepAdvice: String,
  },
  { timestamps: true },
);

goalSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model("Goal", goalSchema);

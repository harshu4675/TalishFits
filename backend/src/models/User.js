const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: { type: String, default: "" },
    },
    role: {
      type: String,
      enum: ["user", "admin", "trainer"],
      default: "user",
    },

    googleId: { type: String, sparse: true },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: String,
    emailVerificationExpires: Date,

    emailOTP: {
      code: String,
      expiresAt: Date,
      attempts: { type: Number, default: 0 },
      verifiedAt: Date,
    },

    passwordResetToken: String,
    passwordResetExpires: Date,
    refreshToken: { type: String, select: false },
    rememberMe: { type: Boolean, default: false },

    isOnboarded: { type: Boolean, default: false },
    onboardingStep: { type: Number, default: 0 },

    healthProfile: {
      gender: { type: String, enum: ["male", "female", "other"] },
      dateOfBirth: Date,
      age: Number,
      height: { value: Number, unit: { type: String, default: "cm" } },
      weight: { value: Number, unit: { type: String, default: "kg" } },
      activityLevel: {
        type: String,
        enum: [
          "sedentary",
          "lightly_active",
          "moderately_active",
          "very_active",
          "extremely_active",
        ],
      },
      lifestyle: {
        type: String,
        enum: ["office_job", "student", "gym", "sports", "mixed"],
      },
      sleepHours: { type: Number, min: 1, max: 24 },
      waterIntake: Number,
      medicalConditions: [String],
      foodPreference: {
        type: String,
        enum: ["veg", "non_veg", "vegan", "vegetarian"],
      },
      allergies: [String],
      workoutExperience: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
      },
    },

    bodyMetrics: {
      bmi: Number,
      bmiCategory: String,
      bodyFatEstimate: Number,
      idealWeight: Number,
      healthyWeightRange: { min: Number, max: Number },
      bmr: Number,
      tdee: Number,
      maintenanceCalories: Number,
      dailyWaterIntake: Number,
      macros: {
        protein: Number,
        fat: Number,
        carbs: Number,
        calories: Number,
      },
      calorieDeficit: Number,
      calorieSurplus: Number,
      weightStatus: {
        current: Number,
        ideal: Number,
        toLose: Number,
        toGain: Number,
        status: String,
        message: String,
      },
      calculatedAt: Date,
    },

    selectedGoal: {
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
    },

    preferences: {
      notifications: {
        morning: { type: Boolean, default: true },
        workout: { type: Boolean, default: true },
        water: { type: Boolean, default: true },
        sleep: { type: Boolean, default: true },
        meal: { type: Boolean, default: true },
        weekly: { type: Boolean, default: true },
      },
      theme: { type: String, enum: ["dark", "light"], default: "dark" },
      units: {
        weight: { type: String, default: "kg" },
        height: { type: String, default: "cm" },
      },
    },

    gamification: {
      fitnessScore: { type: Number, default: 0 },
      streak: {
        current: { type: Number, default: 0 },
        longest: { type: Number, default: 0 },
        lastWorkout: Date,
      },
      totalWorkouts: { type: Number, default: 0 },
      totalCaloriesBurned: { type: Number, default: 0 },
      badges: [
        {
          id: String,
          name: String,
          description: String,
          icon: String,
          earnedAt: Date,
        },
      ],
      level: { type: Number, default: 1 },
      xp: { type: Number, default: 0 },
    },

    subscription: {
      plan: { type: String, enum: ["free", "pro", "elite"], default: "free" },
      startDate: Date,
      endDate: Date,
      isActive: { type: Boolean, default: false },
    },

    isActive: { type: Boolean, default: true },
    lastLogin: Date,
    fcmToken: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.virtual("firstName").get(function () {
  return this.name.split(" ")[0];
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.emailVerificationToken;
  delete obj.passwordResetToken;
  delete obj.emailOTP;
  return obj;
};

userSchema.index({ "gamification.fitnessScore": -1 });

module.exports = mongoose.model("User", userSchema);

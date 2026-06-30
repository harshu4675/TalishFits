const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: Number,
  unit: String,
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  fiber: Number,
  recipe: String,
  alternatives: [String],
  imageUrl: String,
  isVeg: Boolean,
});

const mealSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: [
      "breakfast",
      "lunch",
      "dinner",
      "snack",
      "pre_workout",
      "post_workout",
    ],
    required: true,
  },
  time: String,
  foods: [foodItemSchema],
  totalCalories: Number,
  totalProtein: Number,
  totalCarbs: Number,
  totalFat: Number,
  notes: String,
  isOptional: Boolean,
});

const dietPlanSchema = new mongoose.Schema(
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
    title: String,
    description: String,
    type: {
      type: String,
      enum: [
        "veg",
        "non_veg",
        "vegan",
        "vegetarian",
        "high_protein",
        "budget",
        "indian",
      ],
    },
    dailyCalorieTarget: Number,
    dailyProteinTarget: Number,
    dailyCarbTarget: Number,
    dailyFatTarget: Number,
    dailyWaterTarget: Number,
    days: [
      {
        dayNumber: Number,
        dayName: String,
        meals: [mealSchema],
        totalCalories: Number,
        totalProtein: Number,
        totalCarbs: Number,
        totalFat: Number,
        waterIntake: Number,
        shoppingList: [String],
      },
    ],
    supplements: [
      {
        name: String,
        timing: String,
        amount: String,
        purpose: String,
      },
    ],
    isActive: { type: Boolean, default: true },
    isAIGenerated: { type: Boolean, default: true },
    weekNumber: { type: Number, default: 1 },
  },
  { timestamps: true },
);

dietPlanSchema.index({ user: 1, isActive: 1 });

module.exports = mongoose.model("DietPlan", dietPlanSchema);

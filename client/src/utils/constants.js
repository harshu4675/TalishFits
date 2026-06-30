export const GOALS = [
  {
    id: "lean",
    label: "Lean Body",
    emoji: "⚡",
    description:
      "Build a lean, defined physique with low body fat and visible muscle tone",
    expectedTime: "12-16 weeks",
    difficulty: "Moderate",
    calories: "300-500 deficit",
    color: "#22c55e",
  },
  {
    id: "athletic",
    label: "Athletic",
    emoji: "🏃",
    description:
      "Develop explosive power, speed, agility and peak athletic performance",
    expectedTime: "8-12 weeks",
    difficulty: "Hard",
    calories: "Maintenance",
    color: "#3b82f6",
  },
  {
    id: "muscular",
    label: "Muscular",
    emoji: "💪",
    description:
      "Build significant muscle mass and strength through progressive overload",
    expectedTime: "16-24 weeks",
    difficulty: "Hard",
    calories: "300-500 surplus",
    color: "#f97316",
  },
  {
    id: "bodybuilder",
    label: "Bodybuilder",
    emoji: "🏆",
    description:
      "Achieve a competition-ready physique with maximum muscle definition",
    expectedTime: "24-52 weeks",
    difficulty: "Elite",
    calories: "Cycling",
    color: "#a855f7",
  },
  {
    id: "fat_loss",
    label: "Fat Loss",
    emoji: "🔥",
    description: "Maximum fat burning while preserving lean muscle mass",
    expectedTime: "8-16 weeks",
    difficulty: "Moderate",
    calories: "500-750 deficit",
    color: "#ff2d55",
  },
  {
    id: "six_pack",
    label: "Six Pack",
    emoji: "✨",
    description:
      "Achieve visible six-pack abs with intense core training and diet",
    expectedTime: "12-20 weeks",
    difficulty: "Hard",
    calories: "400-600 deficit",
    color: "#eab308",
  },
  {
    id: "v_shape",
    label: "V-Shape",
    emoji: "🦅",
    description:
      "Build wide shoulders with narrow waist for the classic V-taper",
    expectedTime: "16-24 weeks",
    difficulty: "Hard",
    calories: "Slight surplus",
    color: "#06b6d4",
  },
  {
    id: "womens_toned",
    label: "Women's Toned",
    emoji: "👸",
    description:
      "Achieve a lean, toned feminine physique with curves in the right places",
    expectedTime: "12-16 weeks",
    difficulty: "Moderate",
    calories: "200-400 deficit",
    color: "#ec4899",
  },
  {
    id: "powerlifting",
    label: "Powerlifting",
    emoji: "🏋️",
    description: "Maximize raw strength in squat, bench press, and deadlift",
    expectedTime: "16-24 weeks",
    difficulty: "Elite",
    calories: "Surplus",
    color: "#dc2626",
  },
  {
    id: "functional_fitness",
    label: "Functional",
    emoji: "⚙️",
    description:
      "Build practical strength and mobility for everyday activities",
    expectedTime: "8-12 weeks",
    difficulty: "Easy",
    calories: "Maintenance",
    color: "#16a34a",
  },
];

export const ACTIVITY_LEVELS = [
  {
    value: "sedentary",
    label: "Sedentary",
    description: "Little to no exercise",
    multiplier: 1.2,
  },
  {
    value: "lightly_active",
    label: "Lightly Active",
    description: "Exercise 1-3 days/week",
    multiplier: 1.375,
  },
  {
    value: "moderately_active",
    label: "Moderately Active",
    description: "Exercise 3-5 days/week",
    multiplier: 1.55,
  },
  {
    value: "very_active",
    label: "Very Active",
    description: "Hard exercise 6-7 days/week",
    multiplier: 1.725,
  },
  {
    value: "extremely_active",
    label: "Extremely Active",
    description: "Very hard exercise & physical job",
    multiplier: 1.9,
  },
];

export const FOOD_PREFERENCES = [
  { value: "non_veg", label: "Non Vegetarian", emoji: "🍗" },
  { value: "veg", label: "Vegetarian", emoji: "🥗" },
  { value: "vegan", label: "Vegan", emoji: "🌱" },
  { value: "vegetarian", label: "Eggetarian", emoji: "🥚" },
];

export const EXPERIENCE_LEVELS = [
  {
    value: "beginner",
    label: "Beginner",
    description: "0-1 year of training",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "1-3 years of training",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "3+ years of training",
  },
];

export const LIFESTYLE_OPTIONS = [
  { value: "office_job", label: "Office Job", emoji: "💻" },
  { value: "student", label: "Student", emoji: "📚" },
  { value: "gym", label: "Gym Enthusiast", emoji: "🏋️" },
  { value: "sports", label: "Sports Player", emoji: "⚽" },
  { value: "mixed", label: "Mixed Lifestyle", emoji: "🔄" },
];

export const COMMON_ALLERGIES = [
  "Dairy",
  "Gluten",
  "Nuts",
  "Eggs",
  "Soy",
  "Fish",
  "Shellfish",
  "Wheat",
  "Peanuts",
];

export const MEDICAL_CONDITIONS = [
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Asthma",
  "Arthritis",
  "Back Pain",
  "Knee Problems",
  "None",
];

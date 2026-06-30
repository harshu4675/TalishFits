/**
 * TalishFits Body Metrics Calculator
 * Comprehensive fitness metrics calculation engine
 */

const calculateBMI = (weightKg, heightCm) => {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
};

const getBMICategory = (bmi) => {
  if (bmi < 16) return "Severely Underweight";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal Weight";
  if (bmi < 30) return "Overweight";
  if (bmi < 35) return "Obese Class I";
  if (bmi < 40) return "Obese Class II";
  return "Obese Class III";
};

const calculateBMR = (weightKg, heightCm, age, gender) => {
  // Mifflin-St Jeor Equation
  let bmr;
  if (gender === "male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }
  return Math.round(bmr);
};

const activityMultipliers = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extremely_active: 1.9,
};

const calculateTDEE = (bmr, activityLevel) => {
  const multiplier = activityMultipliers[activityLevel] || 1.55;
  return Math.round(bmr * multiplier);
};

const calculateIdealWeight = (heightCm, gender) => {
  // Devine Formula
  const heightInches = heightCm / 2.54;
  let idealWeight;
  if (gender === "male") {
    idealWeight = 50 + 2.3 * (heightInches - 60);
  } else {
    idealWeight = 45.5 + 2.3 * (heightInches - 60);
  }
  return Math.max(Math.round(idealWeight * 10) / 10, 40);
};

const calculateHealthyWeightRange = (heightCm) => {
  const heightM = heightCm / 100;
  return {
    min: Math.round(18.5 * heightM * heightM * 10) / 10,
    max: Math.round(24.9 * heightM * heightM * 10) / 10,
  };
};

const calculateBodyFatEstimate = (bmi, age, gender) => {
  // Deurenberg Formula
  let bodyFat;
  const genderFactor = gender === "male" ? 1 : 0;
  bodyFat = 1.2 * bmi + 0.23 * age - 10.8 * genderFactor - 5.4;
  return Math.max(Math.round(bodyFat * 10) / 10, 3);
};

const calculateMacros = (calories, goal, weightKg) => {
  let proteinRatio, carbRatio, fatRatio;

  const goalMacros = {
    fat_loss: { protein: 0.4, carbs: 0.35, fat: 0.25 },
    lean: { protein: 0.35, carbs: 0.4, fat: 0.25 },
    athletic: { protein: 0.3, carbs: 0.5, fat: 0.2 },
    muscular: { protein: 0.35, carbs: 0.45, fat: 0.2 },
    bodybuilder: { protein: 0.4, carbs: 0.4, fat: 0.2 },
    six_pack: { protein: 0.45, carbs: 0.3, fat: 0.25 },
    v_shape: { protein: 0.35, carbs: 0.4, fat: 0.25 },
    womens_toned: { protein: 0.35, carbs: 0.4, fat: 0.25 },
    powerlifting: { protein: 0.3, carbs: 0.5, fat: 0.2 },
    functional_fitness: { protein: 0.3, carbs: 0.45, fat: 0.25 },
    default: { protein: 0.3, carbs: 0.45, fat: 0.25 },
  };

  const ratios = goalMacros[goal] || goalMacros.default;

  // Minimum protein: 1.6g per kg bodyweight
  const minProteinG = weightKg * 1.6;
  const minProteinCal = minProteinG * 4;

  const proteinCal = Math.max(calories * ratios.protein, minProteinCal);
  const fatCal = calories * ratios.fat;
  const carbCal = calories - proteinCal - fatCal;

  return {
    protein: Math.round(proteinCal / 4),
    carbs: Math.round(carbCal / 4),
    fat: Math.round(fatCal / 9),
    calories,
  };
};

const calculateWaterIntake = (weightKg, activityLevel) => {
  let baseWater = weightKg * 0.033; // Base: 33ml per kg

  const activityAdditions = {
    sedentary: 0,
    lightly_active: 0.25,
    moderately_active: 0.5,
    very_active: 0.75,
    extremely_active: 1.0,
  };

  baseWater += activityAdditions[activityLevel] || 0;
  return Math.round(baseWater * 10) / 10; // In liters
};

const calculateAllMetrics = (profile) => {
  const { weight, height, age, gender, activityLevel, goal } = profile;

  const weightKg = weight;
  const heightCm = height;

  const bmi = calculateBMI(weightKg, heightCm);
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const idealWeight = calculateIdealWeight(heightCm, gender);
  const healthyWeightRange = calculateHealthyWeightRange(heightCm);
  const bodyFatEstimate = calculateBodyFatEstimate(bmi, age, gender);
  const waterIntake = calculateWaterIntake(weightKg, activityLevel);

  // Calorie targets based on goal
  const goalCalories = {
    fat_loss: Math.round(tdee * 0.8),
    lean: Math.round(tdee * 0.9),
    athletic: tdee,
    muscular: Math.round(tdee * 1.1),
    bodybuilder: Math.round(tdee * 1.15),
    six_pack: Math.round(tdee * 0.75),
    v_shape: Math.round(tdee * 0.9),
    womens_toned: Math.round(tdee * 0.9),
    powerlifting: Math.round(tdee * 1.1),
    functional_fitness: tdee,
  };

  const targetCalories = goalCalories[goal] || tdee;
  const macros = calculateMacros(targetCalories, goal, weightKg);

  // Weight status
  const weightDiff = weightKg - idealWeight;
  let weightStatus = {};

  if (Math.abs(weightDiff) < 2) {
    weightStatus = {
      current: weightKg,
      ideal: idealWeight,
      status: "maintain",
      difference: 0,
      message: "You're at your ideal weight! Focus on body composition.",
    };
  } else if (weightDiff > 0) {
    weightStatus = {
      current: weightKg,
      ideal: idealWeight,
      toLose: Math.round(weightDiff * 10) / 10,
      status: "lose",
      message: `Lose ${Math.round(weightDiff * 10) / 10}kg to reach your ideal weight.`,
    };
  } else {
    weightStatus = {
      current: weightKg,
      ideal: idealWeight,
      toGain: Math.round(Math.abs(weightDiff) * 10) / 10,
      status: "gain",
      message: `Gain ${Math.round(Math.abs(weightDiff) * 10) / 10}kg to reach your ideal weight.`,
    };
  }

  return {
    bmi,
    bmiCategory,
    bmr,
    tdee,
    maintenanceCalories: tdee,
    idealWeight,
    healthyWeightRange,
    bodyFatEstimate,
    dailyWaterIntake: waterIntake,
    macros,
    calorieDeficit: tdee - Math.round(tdee * 0.8),
    calorieSurplus: Math.round(tdee * 1.15) - tdee,
    weightStatus,
    calculatedAt: new Date(),
  };
};

module.exports = {
  calculateBMI,
  getBMICategory,
  calculateBMR,
  calculateTDEE,
  calculateIdealWeight,
  calculateHealthyWeightRange,
  calculateBodyFatEstimate,
  calculateMacros,
  calculateWaterIntake,
  calculateAllMetrics,
};

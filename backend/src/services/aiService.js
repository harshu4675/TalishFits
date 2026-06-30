const OpenAI = require("openai");
const logger = require("../utils/logger");

// Initialize AI client - using OpenAI with Gemini fallback
let aiClient;

try {
  aiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
} catch (err) {
  logger.warn("OpenAI not available, will use Gemini fallback");
}

const systemPrompt = `You are an expert fitness coach, certified nutritionist, and sports scientist with 20 years of experience. 
You provide precise, science-backed, personalized fitness and nutrition advice. 
Your responses are professional, motivating, and detailed. 
Always respond in valid JSON format when requested.
Never mention AI, OpenAI, or any technology names in your responses.
Present yourself as TalishFits AI Coach.`;

const generateWithOpenAI = async (prompt, maxTokens = 2000) => {
  const response = await aiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    max_tokens: maxTokens,
    temperature: 0.7,
    response_format: { type: "json_object" },
  });
  return response.choices[0].message.content;
};

const generateWithGemini = async (prompt) => {
  // Gemini fallback using REST API
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `${systemPrompt}\n\nUser Request: ${prompt}\n\nRespond with valid JSON only.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
        },
      }),
    },
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  return jsonMatch ? jsonMatch[0] : text;
};

const generate = async (prompt, maxTokens = 2000) => {
  try {
    if (process.env.OPENAI_API_KEY) {
      return await generateWithOpenAI(prompt, maxTokens);
    } else if (process.env.GEMINI_API_KEY) {
      return await generateWithGemini(prompt);
    } else {
      throw new Error("No AI provider configured");
    }
  } catch (error) {
    logger.error("AI generation error:", error);
    // Try Gemini as fallback
    if (error.code !== "GEMINI_ERROR" && process.env.GEMINI_API_KEY) {
      try {
        return await generateWithGemini(prompt);
      } catch (fallbackError) {
        logger.error("Gemini fallback also failed:", fallbackError);
        throw fallbackError;
      }
    }
    throw error;
  }
};

const generateWorkoutPlan = async (userProfile) => {
  const prompt = `
Create a complete, detailed ${userProfile.duration || 8}-week workout plan for:
- Goal: ${userProfile.goal}
- Experience: ${userProfile.experience}
- Gender: ${userProfile.gender}
- Age: ${userProfile.age}
- Weight: ${userProfile.weight}kg
- Height: ${userProfile.height}cm
- Activity Level: ${userProfile.activityLevel}
- Equipment: ${userProfile.equipment || "Gym"}
- Days per week: ${userProfile.daysPerWeek || 5}
- Medical conditions: ${userProfile.medicalConditions?.join(", ") || "None"}

Return a JSON object with this exact structure:
{
  "title": "Plan name",
  "description": "Brief overview",
  "type": "gym|home|mixed",
  "level": "beginner|intermediate|advanced",
  "duration": { "weeks": 8, "daysPerWeek": 5, "minutesPerSession": 60 },
  "schedule": [
    {
      "dayNumber": 1,
      "dayName": "Monday",
      "focus": "Chest & Triceps",
      "type": "strength",
      "totalDuration": 60,
      "totalCalories": 400,
      "isRestDay": false,
      "warmup": [
        {
          "name": "Exercise name",
          "sets": 2,
          "reps": {"min": 10, "max": 15},
          "duration": 5,
          "restTime": 30,
          "calories": 20,
          "musclesWorked": ["chest"],
          "instructions": ["Step 1", "Step 2"],
          "tips": ["Tip 1"],
          "difficulty": "beginner",
          "equipment": ["none"],
          "order": 1
        }
      ],
      "exercises": [...],
      "cooldown": [...],
      "notes": "Day notes"
    }
  ]
}

Include 7 days with proper rest days. Make exercises specific, detailed, and appropriate for the goal.
`;

  const response = await generate(prompt, 4000);
  return JSON.parse(response);
};

const generateDietPlan = async (userProfile) => {
  const prompt = `
Create a complete 7-day meal plan for:
- Goal: ${userProfile.goal}
- Food Preference: ${userProfile.foodPreference}
- Daily Calories: ${userProfile.targetCalories}
- Protein Target: ${userProfile.macros.protein}g
- Carbs Target: ${userProfile.macros.carbs}g
- Fat Target: ${userProfile.macros.fat}g
- Allergies: ${userProfile.allergies?.join(", ") || "None"}
- Diet Style: ${userProfile.dietStyle || "balanced"}
- Weight: ${userProfile.weight}kg
- Gender: ${userProfile.gender}
- Budget: ${userProfile.budget || "medium"}

Return JSON with this structure:
{
  "title": "Diet plan name",
  "description": "Overview",
  "type": "veg|non_veg|vegan",
  "dailyCalorieTarget": 2000,
  "dailyProteinTarget": 150,
  "dailyCarbTarget": 200,
  "dailyFatTarget": 65,
  "dailyWaterTarget": 3.5,
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Monday",
      "totalCalories": 2000,
      "totalProtein": 150,
      "totalCarbs": 200,
      "totalFat": 65,
      "waterIntake": 3.5,
      "meals": [
        {
          "type": "breakfast",
          "time": "7:00 AM",
          "totalCalories": 450,
          "totalProtein": 35,
          "totalCarbs": 50,
          "totalFat": 12,
          "foods": [
            {
              "name": "Food item",
              "quantity": 100,
              "unit": "g",
              "calories": 200,
              "protein": 15,
              "carbs": 25,
              "fat": 5,
              "recipe": "How to prepare",
              "alternatives": ["Alternative 1", "Alternative 2"],
              "isVeg": true
            }
          ]
        }
      ],
      "shoppingList": ["Item 1", "Item 2"]
    }
  ],
  "supplements": [
    {
      "name": "Supplement",
      "timing": "Morning",
      "amount": "5g",
      "purpose": "Why needed"
    }
  ]
}
`;

  const response = await generate(prompt, 4000);
  return JSON.parse(response);
};

const generateRoadmap = async (userProfile) => {
  const prompt = `
Generate a comprehensive fitness transformation roadmap for:
- Goal: ${userProfile.goal}
- Current Weight: ${userProfile.weight}kg
- Target/Ideal Weight: ${userProfile.idealWeight}kg
- BMI: ${userProfile.bmi}
- Experience: ${userProfile.experience}
- Timeline Goal: ${userProfile.timelineWeeks || 12} weeks

Return JSON:
{
  "overview": "Complete overview of the transformation journey",
  "expectedTransformation": "What to expect",
  "difficulty": "Beginner-Friendly|Moderate|Challenging|Elite",
  "estimatedWeeks": 12,
  "calorieTarget": 2000,
  "weeklyTargets": [
    {
      "week": 1,
      "goal": "Week goal description",
      "workouts": 4,
      "targetWeight": 80,
      "calories": 2000,
      "focus": "Foundation building"
    }
  ],
  "monthlyTargets": [
    {
      "month": 1,
      "goal": "Month goal",
      "expectedWeightChange": -2,
      "milestones": ["Milestone 1", "Milestone 2"]
    }
  ],
  "supplements": [
    {
      "name": "Supplement name",
      "timing": "When to take",
      "dosage": "Amount",
      "purpose": "Why"
    }
  ],
  "recoveryAdvice": ["Advice 1", "Advice 2"],
  "sleepAdvice": "Sleep optimization advice"
}
`;

  const response = await generate(prompt, 3000);
  return JSON.parse(response);
};

const generateMotivation = async (userProfile) => {
  const prompt = `
Generate 5 personalized motivational messages for a fitness user:
- Name: ${userProfile.name}
- Goal: ${userProfile.goal}
- Current Streak: ${userProfile.streak} days
- Progress: ${userProfile.progress}%

Return JSON:
{
  "messages": [
    {
      "type": "morning|workout|general|milestone",
      "title": "Short title",
      "message": "Motivational message (2-3 sentences)",
      "emoji": "🔥"
    }
  ],
  "dailyQuote": "Powerful fitness quote",
  "weeklyChallenge": "A specific challenge for this week"
}
`;

  const response = await generate(prompt, 1000);
  return JSON.parse(response);
};

const generateExerciseTips = async (exerciseName, userLevel) => {
  const prompt = `
Provide detailed coaching tips for "${exerciseName}" for a ${userLevel} level user.
Return JSON:
{
  "exercise": "${exerciseName}",
  "formTips": ["Tip 1", "Tip 2", "Tip 3"],
  "commonMistakes": ["Mistake 1", "Mistake 2"],
  "breathingTechnique": "How to breathe",
  "progressionTips": ["How to progress"],
  "alternatives": ["Alternative 1", "Alternative 2"],
  "warmupAdvice": "How to warm up for this exercise",
  "musclesExplained": "Detailed muscle engagement explanation"
}
`;

  const response = await generate(prompt, 1000);
  return JSON.parse(response);
};

const generateProgressAdvice = async (progressData) => {
  const prompt = `
Analyze this fitness progress and provide personalized advice:
- Current Weight: ${progressData.currentWeight}kg
- Starting Weight: ${progressData.startWeight}kg
- Weeks Into Program: ${progressData.weeksIn}
- Goal: ${progressData.goal}
- Avg Workouts/Week: ${progressData.avgWorkouts}
- Avg Calories: ${progressData.avgCalories}

Return JSON:
{
  "analysis": "Honest analysis of their progress",
  "progressRating": "on_track|ahead|behind",
  "adjustments": ["Adjustment 1", "Adjustment 2"],
  "encouragement": "Personalized encouragement message",
  "nextWeekFocus": "What to focus on next week",
  "nutritionTweak": "Specific nutrition adjustment",
  "workoutTweak": "Specific workout adjustment"
}
`;

  const response = await generate(prompt, 1500);
  return JSON.parse(response);
};

const generateMealAlternatives = async (meal, preference) => {
  const prompt = `
Suggest healthy alternatives to this meal:
- Original Meal: ${meal}
- Food Preference: ${preference}

Return JSON:
{
  "alternatives": [
    {
      "name": "Meal name",
      "calories": 400,
      "protein": 30,
      "carbs": 40,
      "fat": 12,
      "prepTime": "15 min",
      "recipe": "Quick recipe",
      "whyBetter": "Why this is a good alternative"
    }
  ]
}
`;

  const response = await generate(prompt, 1000);
  return JSON.parse(response);
};

module.exports = {
  generate,
  generateWorkoutPlan,
  generateDietPlan,
  generateRoadmap,
  generateMotivation,
  generateExerciseTips,
  generateProgressAdvice,
  generateMealAlternatives,
};

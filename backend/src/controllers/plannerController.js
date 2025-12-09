const { GoogleGenerativeAI } = require('@google/generative-ai');
const MealPlan = require('../models/MealPlan');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

const generateWeeklyPlan = async (req, res) => {
  try {
    const { mood, days = 7, diet } = req.body;

    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    // Build prompt for weekly meal plan
    const prompt = `You are a meal planning assistant. Generate a ${days}-day meal plan in JSON format only. Return an array of day objects.

Each day object should have:
- day: "Monday", "Tuesday", etc.
- breakfast: { title, ingredients (array), prep_time_minutes }
- lunch: { title, ingredients (array), prep_time_minutes }
- dinner: { title, ingredients (array), prep_time_minutes }

Input:
- mood: "${mood}"
- diet: "${diet || 'both'}"
- days: ${days}

Rules:
- Return JSON only (no explanation).
- Vary recipes across days.
- Match the mood to meal types.
- Keep prep times realistic.
- Ensure nutritional balance.

Example format:
[
  {
    "day": "Monday",
    "breakfast": { "title": "Oatmeal", "ingredients": ["1 cup oats", "2 cups milk"], "prep_time_minutes": 10 },
    "lunch": { "title": "Salad", "ingredients": ["lettuce", "tomato"], "prep_time_minutes": 15 },
    "dinner": { "title": "Pasta", "ingredients": ["pasta", "sauce"], "prep_time_minutes": 30 }
  },
  ...
]

Generate the meal plan now.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract JSON
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      return res.status(500).json({ error: 'Failed to parse meal plan' });
    }

    const weekPlan = JSON.parse(jsonMatch[0]);

    // Save meal plan
    const mealPlan = new MealPlan({
      user: req.userId,
      weekPlan,
    });
    await mealPlan.save();

    res.json(weekPlan);
  } catch (error) {
    console.error('Generate weekly plan error:', error);
    res.status(500).json({ error: 'Failed to generate meal plan' });
  }
};

const getMealPlans = async (req, res) => {
  try {
    const plans = await MealPlan.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    console.error('Get meal plans error:', error);
    res.status(500).json({ error: 'Failed to fetch meal plans' });
  }
};

module.exports = { generateWeeklyPlan, getMealPlans };

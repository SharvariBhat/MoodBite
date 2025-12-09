const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const RecipeLog = require('../models/RecipeLog');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY);

// Simple in-memory rate limiter (5 requests per minute per user)
const rateLimitMap = {};
const RATE_LIMIT = 5;
const RATE_WINDOW = 60000; // 1 minute

const checkRateLimit = (userId) => {
  const now = Date.now();
  if (!rateLimitMap[userId]) {
    rateLimitMap[userId] = [];
  }

  // Remove old requests outside the window
  rateLimitMap[userId] = rateLimitMap[userId].filter((time) => now - time < RATE_WINDOW);

  if (rateLimitMap[userId].length >= RATE_LIMIT) {
    return false;
  }

  rateLimitMap[userId].push(now);
  return true;
};

const buildGeminiPrompt = (mood, diet, time, difficulty, cuisine) => {
  return `You are a helpful chef assistant. Output valid JSON only — nothing else. Return an array of exactly 3 recipe objects. Each object must have the keys: title (string), ingredients (array of strings), steps (array of strings), calories (string), difficulty (one of: beginner, medium, hard), prep_time_minutes (number), image (URL or empty string), youtube_query (a short query string to find one good YouTube video for this recipe), macros (object with protein, carbs, fat as numbers).

Input:
- mood: "${mood}"
- diet: "${diet || 'both'}"
- time_filter: "${time || 'any'}"
- difficulty: "${difficulty || 'any'}"
- cuisine: "${cuisine || 'any'}"

Rules:
- Return JSON only (no explanation).
- Each ingredient should be concise (e.g., "2 eggs", "200g spaghetti").
- Steps should be short actionable steps.
- Provide realistic prep_time_minutes (integer) and approximate calories.
- youtube_query must be a short string suitable for a YouTube search API call.
- For diet: both=any, veg=vegetarian, non-veg=meat included, vegan=no animal products, keto=low carb, pescatarian=fish ok.
- Match the mood to recipe type (e.g., "cozy" → comfort food, "energetic" → quick & light, "happy" → colorful & fun).

Example output format:
[
  {
    "title": "Sunny Scramble",
    "ingredients": ["2 eggs", "1 tbsp butter", "salt to taste"],
    "steps": ["Beat eggs", "Melt butter in pan", "Cook eggs until set"],
    "calories": "320 kcal",
    "difficulty": "beginner",
    "prep_time_minutes": 10,
    "image": "https://example.com/img.png",
    "youtube_query": "scrambled eggs easy recipe",
    "macros": { "protein": 18, "carbs": 2, "fat": 25 }
  },
  ...
]

Now generate 3 recipes matching the input criteria.`;
};

const extractJSON = (text) => {
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error('No JSON array found in response');
};

const searchYouTube = async (query) => {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      return {
        title: query,
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        thumbnail: '',
        channel: 'YouTube Search',
      };
    }

    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        q: query,
        part: 'snippet',
        type: 'video',
        maxResults: 1,
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      const item = response.data.items[0];
      return {
        title: item.snippet.title,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        thumbnail: item.snippet.thumbnails.default.url,
        channel: item.snippet.channelTitle,
      };
    }

    return {
      title: query,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      thumbnail: '',
      channel: 'YouTube Search',
    };
  } catch (error) {
    console.error('YouTube search error:', error.message);
    return {
      title: query,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
      thumbnail: '',
      channel: 'YouTube Search',
    };
  }
};

const generateRecipes = async (req, res) => {
  try {
    // Check rate limit
    if (!checkRateLimit(req.userId)) {
      return res.status(429).json({ error: 'Rate limit exceeded. Max 5 requests per minute.' });
    }

    const { mood, diet, time, difficulty, cuisine } = req.body;

    if (!mood) {
      return res.status(400).json({ error: 'Mood is required' });
    }

    // Mock recipes for demo (remove this when you have a valid Gemini key)
    const mockRecipes = {
      cozy: [
        {
          title: "Creamy Tomato Pasta",
          ingredients: ["400g pasta", "2 tomatoes", "200ml cream", "2 cloves garlic", "salt", "pepper"],
          steps: ["Boil pasta", "Sauté garlic", "Add tomatoes", "Mix with cream", "Combine with pasta"],
          calories: "450 kcal",
          difficulty: "beginner",
          prep_time_minutes: 25,
          image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
          youtube_query: "creamy tomato pasta recipe",
          macros: { protein: 15, carbs: 60, fat: 18 }
        },
        {
          title: "Mushroom Risotto",
          ingredients: ["300g risotto rice", "200g mushrooms", "1L vegetable broth", "100ml white wine", "parmesan"],
          steps: ["Heat broth", "Toast rice", "Add wine", "Gradually add broth", "Stir in mushrooms", "Add cheese"],
          calories: "380 kcal",
          difficulty: "medium",
          prep_time_minutes: 35,
          image: "https://images.unsplash.com/photo-1476124369162-f4978d1b3dff?w=400",
          youtube_query: "mushroom risotto recipe",
          macros: { protein: 12, carbs: 55, fat: 14 }
        },
        {
          title: "Baked Mac and Cheese",
          ingredients: ["400g pasta", "300ml milk", "200g cheddar", "100g butter", "flour", "breadcrumbs"],
          steps: ["Cook pasta", "Make cheese sauce", "Mix together", "Top with breadcrumbs", "Bake at 180°C for 20 min"],
          calories: "520 kcal",
          difficulty: "beginner",
          prep_time_minutes: 30,
          image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
          youtube_query: "baked mac and cheese recipe",
          macros: { protein: 18, carbs: 65, fat: 22 }
        }
      ],
      happy: [
        {
          title: "Colorful Buddha Bowl",
          ingredients: ["1 cup quinoa", "1 avocado", "2 carrots", "1 cucumber", "chickpeas", "tahini"],
          steps: ["Cook quinoa", "Chop vegetables", "Arrange in bowl", "Add chickpeas", "Drizzle tahini"],
          calories: "420 kcal",
          difficulty: "beginner",
          prep_time_minutes: 20,
          image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
          youtube_query: "buddha bowl recipe",
          macros: { protein: 14, carbs: 52, fat: 16 }
        },
        {
          title: "Tropical Smoothie Bowl",
          ingredients: ["1 cup mango", "1 banana", "200ml yogurt", "granola", "coconut", "berries"],
          steps: ["Blend mango and banana", "Pour into bowl", "Top with granola", "Add coconut", "Add berries"],
          calories: "320 kcal",
          difficulty: "beginner",
          prep_time_minutes: 10,
          image: "https://images.unsplash.com/photo-1590080876-a371a6b6d7c5?w=400",
          youtube_query: "smoothie bowl recipe",
          macros: { protein: 8, carbs: 58, fat: 6 }
        },
        {
          title: "Veggie Stir Fry",
          ingredients: ["2 cups mixed vegetables", "200g tofu", "3 tbsp soy sauce", "2 cloves garlic", "ginger", "rice"],
          steps: ["Cook rice", "Cube tofu", "Stir fry vegetables", "Add tofu", "Season with soy sauce"],
          calories: "380 kcal",
          difficulty: "beginner",
          prep_time_minutes: 25,
          image: "https://images.unsplash.com/photo-1609501676725-7186f017a4b0?w=400",
          youtube_query: "vegetable stir fry recipe",
          macros: { protein: 16, carbs: 48, fat: 12 }
        }
      ],
      energetic: [
        {
          title: "Protein Power Smoothie",
          ingredients: ["1 scoop protein powder", "1 banana", "200ml almond milk", "2 tbsp peanut butter", "oats"],
          steps: ["Add all ingredients", "Blend until smooth", "Pour and serve"],
          calories: "380 kcal",
          difficulty: "beginner",
          prep_time_minutes: 5,
          image: "https://images.unsplash.com/photo-1590080876-a371a6b6d7c5?w=400",
          youtube_query: "protein smoothie recipe",
          macros: { protein: 25, carbs: 35, fat: 12 }
        },
        {
          title: "Quick Chickpea Salad",
          ingredients: ["2 cans chickpeas", "cherry tomatoes", "cucumber", "red onion", "lemon juice", "olive oil"],
          steps: ["Drain chickpeas", "Chop vegetables", "Mix together", "Dress with lemon and oil"],
          calories: "320 kcal",
          difficulty: "beginner",
          prep_time_minutes: 10,
          image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400",
          youtube_query: "chickpea salad recipe",
          macros: { protein: 12, carbs: 42, fat: 8 }
        },
        {
          title: "Avocado Toast",
          ingredients: ["2 slices whole grain bread", "1 avocado", "lemon", "red pepper flakes", "salt"],
          steps: ["Toast bread", "Mash avocado", "Spread on toast", "Season with lemon and pepper flakes"],
          calories: "280 kcal",
          difficulty: "beginner",
          prep_time_minutes: 5,
          image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400",
          youtube_query: "avocado toast recipe",
          macros: { protein: 10, carbs: 32, fat: 14 }
        }
      ]
    };

    // Get recipes based on mood (or use default)
    const moodKey = mood.toLowerCase();
    let recipes = mockRecipes[moodKey] || mockRecipes.happy;

    // Fetch YouTube videos for each recipe
    const recipesWithVideos = await Promise.all(
      recipes.map(async (recipe) => {
        const youtube = await searchYouTube(recipe.youtube_query);
        return {
          ...recipe,
          id: Math.random().toString(36).substr(2, 9),
          youtube,
          moodMatchedBy: `Generated for mood: ${mood}`,
        };
      })
    );

    // Log the request
    const log = new RecipeLog({
      user: req.userId,
      mood,
      queryBody: { mood, diet, time, difficulty, cuisine },
      recipesReturned: recipesWithVideos,
    });
    await log.save();

    res.json(recipesWithVideos);
  } catch (error) {
    console.error('Generate recipes error:', error);
    res.status(500).json({ error: 'Failed to generate recipes' });
  }
};

module.exports = { generateRecipes };

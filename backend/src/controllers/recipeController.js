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

    // Build prompt
    const prompt = buildGeminiPrompt(mood, diet, time, difficulty, cuisine);

    // Call Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse JSON
    let recipes;
    try {
      recipes = extractJSON(responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError.message);
      return res.status(500).json({
        error: 'Failed to parse recipe data. Please try again.',
        debug: responseText.substring(0, 200),
      });
    }

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

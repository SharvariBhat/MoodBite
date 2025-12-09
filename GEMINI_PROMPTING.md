# Gemini Prompting Guide for MoodBite

## Overview

MoodBite uses Google's Gemini API to generate recipes based on mood and filters. This document explains the prompting strategy and how to debug issues.

## Recipe Generation Prompt

The backend sends this exact prompt to Gemini:

```
You are a helpful chef assistant. Output valid JSON only — nothing else. Return an array of exactly 3 recipe objects. Each object must have the keys: title (string), ingredients (array of strings), steps (array of strings), calories (string), difficulty (one of: beginner, medium, hard), prep_time_minutes (number), image (URL or empty string), youtube_query (a short query string to find one good YouTube video for this recipe), macros (object with protein, carbs, fat as numbers).

Input:
- mood: "cozy"
- diet: "veg"
- time_filter: "under_30"
- difficulty: "beginner"
- cuisine: "italian"

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

Now generate 3 recipes matching the input criteria.
```

## Mood Mappings

The system maps moods to recipe characteristics:

| Mood | Recipe Type | Characteristics |
|------|------------|-----------------|
| happy | Colorful, fun | Bright ingredients, festive presentation |
| cozy | Comfort food | Warm, hearty, familiar flavors |
| energetic | Quick, light | Fresh, energizing, quick to prepare |
| calm | Soothing, mild | Gentle flavors, meditative preparation |
| adventurous | Exotic, bold | Interesting spices, unique combinations |
| healthy | Nutritious, balanced | Whole foods, good macros, fresh |

## Diet Mappings

| Diet | Definition | Examples |
|------|-----------|----------|
| both | Any ingredients | Meat, vegetables, dairy all allowed |
| veg | Vegetarian | No meat, but dairy and eggs allowed |
| non-veg | Meat included | Any meat, poultry, seafood |
| vegan | No animal products | Only plant-based ingredients |
| keto | Low carb, high fat | Meat, cheese, low-carb vegetables |
| pescatarian | Fish only | Fish and seafood, no other meat |

## Time Filters

| Filter | Meaning |
|--------|---------|
| under_10 | 10 minutes or less |
| under_20 | 20 minutes or less |
| under_30 | 30 minutes or less |
| any | No time constraint |

## JSON Response Format

Expected structure from Gemini:

```json
[
  {
    "title": "Recipe Name",
    "ingredients": [
      "ingredient 1 with quantity",
      "ingredient 2 with quantity",
      "..."
    ],
    "steps": [
      "Step 1 description",
      "Step 2 description",
      "..."
    ],
    "calories": "XXX kcal",
    "difficulty": "beginner|medium|hard",
    "prep_time_minutes": 15,
    "image": "https://url.to.image.jpg or empty string",
    "youtube_query": "short search query for youtube",
    "macros": {
      "protein": 25,
      "carbs": 45,
      "fat": 12
    }
  },
  {
    "title": "Recipe 2",
    ...
  },
  {
    "title": "Recipe 3",
    ...
  }
]
```

## Debugging

### Issue: Gemini returns non-JSON response

**Symptoms**: Error message "Failed to parse recipe data"

**Solution**: The backend has a fallback JSON extraction mechanism:

```javascript
const extractJSON = (text) => {
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error('No JSON array found in response');
};
```

This looks for the first `[...]` block in the response and attempts to parse it.

**Debug Steps**:
1. Check backend logs for the raw response
2. Verify Gemini API key is valid
3. Try the prompt manually in Google AI Studio
4. Check API quota and billing

### Issue: Recipes don't match mood

**Symptoms**: Generated recipes don't feel appropriate for the selected mood

**Solution**: The prompt includes mood-to-recipe mapping. If results are off:

1. Check the mood value being sent
2. Verify the prompt is being constructed correctly
3. Try a different mood to test
4. Consider the model's interpretation of mood

### Issue: Missing or invalid fields

**Symptoms**: Some recipes missing `macros`, `image`, or `youtube_query`

**Solution**: These fields are optional in the prompt:
- `image`: Can be empty string if no URL available
- `youtube_query`: Should always be present but can be generic
- `macros`: Should always be present with protein, carbs, fat

The backend handles missing fields gracefully.

### Issue: Rate limit exceeded

**Symptoms**: Error "Rate limit exceeded. Max 5 requests per minute."

**Solution**: This is intentional to prevent API abuse. The backend tracks requests per user:

```javascript
const RATE_LIMIT = 5;
const RATE_WINDOW = 60000; // 1 minute

const checkRateLimit = (userId) => {
  const now = Date.now();
  if (!rateLimitMap[userId]) {
    rateLimitMap[userId] = [];
  }

  rateLimitMap[userId] = rateLimitMap[userId].filter((time) => now - time < RATE_WINDOW);

  if (rateLimitMap[userId].length >= RATE_LIMIT) {
    return false;
  }

  rateLimitMap[userId].push(now);
  return true;
};
```

Wait 60 seconds before making another request.

## Testing Gemini Directly

### Using Google AI Studio

1. Go to https://aistudio.google.com
2. Create a new prompt
3. Paste the recipe generation prompt
4. Replace input values with test data
5. Run and check output

### Using cURL

```bash
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "You are a helpful chef assistant. Output valid JSON only — nothing else. Return an array of exactly 3 recipe objects..."
      }]
    }]
  }'
```

## Meal Planner Prompt

For weekly meal planning, a similar approach is used:

```
You are a meal planning assistant. Generate a 7-day meal plan in JSON format only. Return an array of day objects.

Each day object should have:
- day: "Monday", "Tuesday", etc.
- breakfast: { title, ingredients (array), prep_time_minutes }
- lunch: { title, ingredients (array), prep_time_minutes }
- dinner: { title, ingredients (array), prep_time_minutes }

Input:
- mood: "healthy"
- diet: "vegan"
- days: 7

Rules:
- Return JSON only (no explanation).
- Vary recipes across days.
- Match the mood to meal types.
- Keep prep times realistic.
- Ensure nutritional balance.

Generate the meal plan now.
```

## Optimization Tips

### For Better Results

1. **Be Specific**: Include all filter values, even if "any"
2. **Use Examples**: The prompt includes example output format
3. **Clear Rules**: Explicit rules about JSON-only output
4. **Mood Context**: Explain what each mood means

### For Faster Responses

1. Reduce the number of rules
2. Use shorter example output
3. Request fewer recipes (but we need 3)
4. Simplify ingredient descriptions

### For Cost Efficiency

1. Cache common requests
2. Batch requests when possible
3. Use smaller model if available
4. Monitor token usage

## Fallback Strategies

If Gemini API fails:

1. **Retry Logic**: Backend automatically retries failed requests
2. **Cached Recipes**: Consider caching popular recipes
3. **Fallback Recipes**: Have hardcoded recipes for common moods
4. **User Notification**: Clear error messages to users

## Monitoring

### Key Metrics

- API response time
- JSON parse success rate
- Rate limit hits
- Error frequency by mood/diet combination

### Logging

Backend logs all Gemini interactions:

```javascript
console.log('Gemini request:', { mood, diet, time, difficulty, cuisine });
console.log('Gemini response:', responseText.substring(0, 200));
console.log('Parsed recipes:', recipesWithVideos.length);
```

Check these logs when debugging issues.

## Future Improvements

1. **Prompt Optimization**: A/B test different prompt formulations
2. **Model Upgrade**: Use newer Gemini models as available
3. **Fine-tuning**: Create custom model trained on recipe data
4. **Caching**: Cache popular mood/diet combinations
5. **Feedback Loop**: Use user ratings to improve prompts

---

**Need help? Check the backend logs and Google AI Studio for debugging!**

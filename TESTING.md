# MoodBite Testing Guide

## Unit & Integration Tests

### Running Backend Tests

```bash
cd backend
npm test
```

Tests are located in `src/__tests__/` and cover:
- Authentication (register, login)
- Recipe generation validation
- Shopping list categorization
- Error handling

## Manual Smoke Test

Follow these steps to verify the application works end-to-end:

### 1. Setup

```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Wait for both to be ready. Backend should log "MongoDB connected" and frontend should open at http://localhost:3000.

### 2. User Registration

1. Click "Sign Up" button
2. Fill in:
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "password123"
   - Confirm: "password123"
3. Click "Sign Up"
4. **Expected**: Redirected to home page, logged in

### 3. Generate Recipes

1. On home page, select:
   - Mood: "cozy"
   - Diet: "veg"
   - Time: "under_30"
   - Difficulty: "beginner"
   - Cuisine: "italian"
2. Click "✨ Generate Recipes"
3. **Expected**: 3 recipe cards appear with:
   - Title, image, prep time, calories
   - Ingredients list
   - "Cook Mode" button
   - YouTube link
   - Save button

### 4. View Recipe Details

1. Click "▶ Cook Mode" on any recipe
2. **Expected**: Steps expand showing numbered instructions
3. Click "▼ Hide Steps" to collapse

### 5. Watch YouTube Video

1. Click "▶️ Watch on YouTube" button
2. **Expected**: Opens YouTube in new tab with recipe video

### 6. Save Favorite

1. Click "🤍 Save" button on a recipe
2. **Expected**: Button changes to "❤️ Saved"
3. Navigate to "❤️ Favorites" in header
4. **Expected**: Saved recipe appears in favorites list

### 7. Delete Favorite

1. On Favorites page, click "✕" button on a recipe
2. **Expected**: Recipe is removed from list

### 8. Generate Shopping List

1. Go back to Home
2. Generate recipes again (or use existing ones)
3. Check the checkbox on 2-3 recipes
4. Click "🛒 Shopping List"
5. **Expected**: Modal appears with categorized ingredients:
   - Produce
   - Dairy
   - Spices
   - Proteins
   - Grains
   - Others

### 9. Weekly Meal Planner

1. Click "📅 Planner" in header
2. Select:
   - Mood: "healthy"
   - Diet: "vegan"
   - Days: 7
3. Click "✨ Generate"
4. **Expected**: 7-day plan appears with:
   - Each day showing breakfast, lunch, dinner
   - Meal titles and prep times
   - Ingredient lists for each meal

### 10. Logout

1. Click "Logout" button in header
2. **Expected**: Redirected to home, login/signup buttons appear

### 11. Login

1. Click "Login"
2. Enter:
   - Email: "test@example.com"
   - Password: "password123"
3. Click "Login"
4. **Expected**: Logged in, redirected to home

## API Testing with cURL

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Generate Recipes

```bash
TOKEN="your_token_here"

curl -X POST http://localhost:5000/api/recipes/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "mood": "cozy",
    "diet": "veg",
    "time": "under_30",
    "difficulty": "beginner",
    "cuisine": "italian"
  }'
```

**Expected Response:**
```json
[
  {
    "id": "abc123",
    "title": "Creamy Tomato Pasta",
    "ingredients": ["400g pasta", "2 tomatoes", "200ml cream"],
    "steps": ["Boil pasta", "Sauté tomatoes", "Mix with cream"],
    "calories": "450 kcal",
    "difficulty": "beginner",
    "prep_time_minutes": 25,
    "image": "https://...",
    "youtube": {
      "title": "Easy Tomato Pasta",
      "url": "https://youtube.com/watch?v=...",
      "thumbnail": "https://...",
      "channel": "Cooking Channel"
    },
    "macros": {
      "protein": 15,
      "carbs": 60,
      "fat": 18
    },
    "moodMatchedBy": "Generated for mood: cozy"
  },
  ...
]
```

### Save Favorite

```bash
TOKEN="your_token_here"

curl -X POST http://localhost:5000/api/recipes/favorite \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "recipe": {
      "id": "abc123",
      "title": "Creamy Tomato Pasta",
      "ingredients": ["400g pasta", "2 tomatoes", "200ml cream"],
      "steps": ["Boil pasta", "Sauté tomatoes", "Mix with cream"],
      "calories": "450 kcal",
      "difficulty": "beginner",
      "prep_time_minutes": 25,
      "image": "https://...",
      "youtube": {
        "title": "Easy Tomato Pasta",
        "url": "https://youtube.com/watch?v=..."
      },
      "macros": {
        "protein": 15,
        "carbs": 60,
        "fat": 18
      }
    }
  }'
```

### Get Favorites

```bash
TOKEN="your_token_here"

curl -X GET http://localhost:5000/api/recipes/favorite \
  -H "Authorization: Bearer $TOKEN"
```

### Generate Shopping List

```bash
TOKEN="your_token_here"

curl -X POST http://localhost:5000/api/recipes/shopping-list \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "recipes": [
      {
        "title": "Pasta",
        "ingredients": ["400g pasta", "2 tomatoes", "200ml cream"]
      },
      {
        "title": "Salad",
        "ingredients": ["lettuce", "tomato", "olive oil"]
      }
    ]
  }'
```

**Expected Response:**
```json
{
  "produce": ["2 tomatoes", "lettuce", "tomato"],
  "dairy": ["200ml cream"],
  "spices": [],
  "proteins": [],
  "grains": ["400g pasta"],
  "others": ["olive oil"]
}
```

### Generate Weekly Meal Plan

```bash
TOKEN="your_token_here"

curl -X POST http://localhost:5000/api/planner/week \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "mood": "healthy",
    "days": 7,
    "diet": "vegan"
  }'
```

## Error Testing

### Test Missing Required Fields

```bash
# Missing mood
curl -X POST http://localhost:5000/api/recipes/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{}'
```

**Expected**: 400 error with "Mood is required"

### Test Invalid Token

```bash
curl -X GET http://localhost:5000/api/recipes/favorite \
  -H "Authorization: Bearer invalid_token"
```

**Expected**: 401 error with "Invalid token"

### Test Rate Limiting

```bash
# Make 6 requests in quick succession
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/recipes/generate \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"mood": "happy"}'
done
```

**Expected**: 6th request returns 429 "Rate limit exceeded"

## Performance Testing

### Load Testing (Optional)

Using Apache Bench:
```bash
ab -n 100 -c 10 http://localhost:3000/
```

### Browser DevTools

1. Open DevTools (F12)
2. Go to Network tab
3. Generate recipes
4. Check:
   - API response time
   - Payload sizes
   - Number of requests

## Accessibility Testing

1. **Keyboard Navigation**
   - Tab through all buttons and inputs
   - Enter should activate buttons
   - Escape should close modals

2. **Screen Reader**
   - Use NVDA (Windows) or VoiceOver (Mac)
   - Verify all interactive elements are announced
   - Check aria-labels are descriptive

3. **Color Contrast**
   - Use WebAIM Contrast Checker
   - All text should have sufficient contrast

## Mobile Testing

1. Open frontend on mobile device or use DevTools device emulation
2. Test:
   - Layout responsiveness
   - Touch interactions
   - Form inputs
   - Navigation menu

## Cleanup

After testing, you can reset the database:

```bash
# Connect to MongoDB
mongo

# In MongoDB shell
use moodbite
db.users.deleteMany({})
db.favorites.deleteMany({})
db.recipeLogs.deleteMany({})
db.mealplans.deleteMany({})
```

## Troubleshooting

**Tests fail with "Cannot find module"**
- Run `npm install` in backend directory
- Ensure all dependencies are installed

**API returns 500 errors**
- Check backend console for error messages
- Verify MongoDB is running
- Check environment variables

**Frontend can't connect to backend**
- Ensure backend is running on port 5000
- Check VITE_API_BASE in frontend .env
- Check browser console for CORS errors

**Gemini API errors**
- Verify API key is valid
- Check API quota
- Ensure API is enabled in Google Cloud Console

---

**All tests passing? You're ready to deploy! 🚀**

# MoodBite Backend

Node.js + Express + MongoDB backend for the MoodBite mood-based recipe generator.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your values:
- `MONGO_URI`: MongoDB connection string (local or Atlas)
- `JWT_SECRET`: Any random string for JWT signing
- `GEMINI_KEY`: Your Google Gemini API key
- `YOUTUBE_API_KEY`: Your YouTube Data API key (optional)
- `PORT`: Server port (default 5000)

4. Start MongoDB (if local):
```bash
mongod
```

## Running

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Testing

Run tests:
```bash
npm test
```

## API Endpoints

### Authentication

**Register**
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Login**
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Recipes

**Generate Recipes** (Protected)
```bash
POST /api/recipes/generate
Authorization: Bearer <token>
Content-Type: application/json

{
  "mood": "cozy",
  "diet": "veg",
  "time": "under_30",
  "difficulty": "beginner",
  "cuisine": "italian"
}
```

Response:
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

**Save Favorite** (Protected)
```bash
POST /api/recipes/favorite
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipe": { ...recipe object... }
}
```

**Get Favorites** (Protected)
```bash
GET /api/recipes/favorite
Authorization: Bearer <token>
```

**Delete Favorite** (Protected)
```bash
DELETE /api/recipes/favorite/:id
Authorization: Bearer <token>
```

**Generate Shopping List** (Protected)
```bash
POST /api/recipes/shopping-list
Authorization: Bearer <token>
Content-Type: application/json

{
  "recipes": [
    { "title": "Pasta", "ingredients": ["400g pasta", "tomato"] },
    { "title": "Salad", "ingredients": ["lettuce", "tomato"] }
  ]
}
```

Response:
```json
{
  "produce": ["tomato", "lettuce"],
  "dairy": [],
  "spices": [],
  "proteins": [],
  "grains": ["400g pasta"],
  "others": []
}
```

### Meal Planner

**Generate Weekly Plan** (Protected)
```bash
POST /api/planner/week
Authorization: Bearer <token>
Content-Type: application/json

{
  "mood": "healthy",
  "days": 7,
  "diet": "vegan"
}
```

**Get Meal Plans** (Protected)
```bash
GET /api/planner
Authorization: Bearer <token>
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection | mongodb://localhost:27017/moodbite |
| JWT_SECRET | JWT signing secret | your_secret_key |
| GEMINI_KEY | Google Gemini API key | AIzaSy... |
| YOUTUBE_API_KEY | YouTube Data API key | AIzaSy... |
| NODE_ENV | Environment | development |

## Architecture

- `src/config/` - Database configuration
- `src/models/` - Mongoose schemas
- `src/controllers/` - Business logic
- `src/routes/` - API endpoints
- `src/middleware/` - Auth and validation
- `src/__tests__/` - Unit and integration tests

## Rate Limiting

Recipe generation is rate-limited to 5 requests per minute per user to prevent abuse of Gemini API.

## Error Handling

All endpoints return consistent error responses:
```json
{
  "error": "Error message"
}
```

HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 429: Rate limit exceeded
- 500: Server error

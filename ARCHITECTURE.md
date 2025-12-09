# MoodBite Architecture

## System Overview

MoodBite is a full-stack MERN application that generates personalized recipes based on user mood using Google's Gemini AI.

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Pages: Home, Login, Register, Favorites, Planner    │   │
│  │ Components: Header, MoodSelector, RecipeCard        │   │
│  │ State: User, Recipes, Favorites, MealPlan           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ (HTTP/REST)
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Node.js + Express)                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Routes: /auth, /recipes, /planner                   │   │
│  │ Controllers: Auth, Recipe, Favorite, Planner        │   │
│  │ Middleware: Auth, Validation, Error Handling        │   │
│  │ Models: User, Favorite, RecipeLog, MealPlan         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ (Mongoose)
┌─────────────────────────────────────────────────────────────┐
│                    MongoDB Database                         │
│  Collections: users, favorites, recipeLogs, mealplans       │
└─────────────────────────────────────────────────────────────┘
                            ↕ (API)
┌─────────────────────────────────────────────────────────────┐
│              External Services                              │
│  • Google Gemini API (Recipe Generation)                    │
│  • YouTube Data API (Video Search)                          │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── Header
│   ├── Navigation
│   ├── User Info
│   └── Auth Buttons
├── Pages (Router)
│   ├── Home
│   │   ├── MoodSelector
│   │   ├── RecipeCard (x3)
│   │   └── ShoppingList Modal
│   ├── Login
│   ├── Register
│   ├── Favorites
│   │   └── RecipeCard (x many)
│   └── Planner
│       └── MealPlanCard (x7)
└── Footer
```

### State Management

**Local Component State:**
- User authentication (login, register)
- Form inputs (mood, filters)
- Loading states
- Error messages

**Browser Storage:**
- JWT token (localStorage)
- User data (localStorage)
- Favorites list (derived from API)

**API State:**
- Recipes (fetched on demand)
- Favorites (fetched on page load)
- Meal plans (fetched on demand)

### Data Flow

```
User Input
    ↓
Component State Update
    ↓
API Call (fetch)
    ↓
Backend Processing
    ↓
Response Handling
    ↓
UI Update
```

### API Client Pattern

```javascript
// api.js provides typed API calls
export const recipes = {
  generate: (mood, diet, time, difficulty, cuisine) => apiCall(...),
  addFavorite: (recipe) => apiCall(...),
  getFavorites: () => apiCall(...),
  // ...
}

// Usage in components
const result = await recipes.generate(mood, diet, time, difficulty, cuisine);
```

## Backend Architecture

### Request Flow

```
HTTP Request
    ↓
Express Middleware (CORS, JSON parsing)
    ↓
Route Handler
    ↓
Auth Middleware (if protected)
    ↓
Validation Middleware
    ↓
Controller Logic
    ↓
Database Operations (Mongoose)
    ↓
External API Calls (Gemini, YouTube)
    ↓
Response Formatting
    ↓
HTTP Response
```

### Route Structure

```
/api/auth
├── POST /register          → authController.register
└── POST /login             → authController.login

/api/recipes
├── POST /generate          → recipeController.generateRecipes (protected)
├── POST /favorite          → favoriteController.addFavorite (protected)
├── GET  /favorite          → favoriteController.getFavorites (protected)
├── DELETE /favorite/:id    → favoriteController.deleteFavorite (protected)
└── POST /shopping-list     → shoppingController.generateShoppingList (protected)

/api/planner
├── POST /week              → plannerController.generateWeeklyPlan (protected)
└── GET  /                  → plannerController.getMealPlans (protected)
```

### Controller Responsibilities

**authController**
- User registration with password hashing
- User login with JWT generation
- Input validation

**recipeController**
- Gemini API integration
- JSON parsing and error handling
- YouTube video search
- Rate limiting
- Recipe logging

**favoriteController**
- Save recipes to database
- Retrieve user favorites
- Delete favorites

**shoppingController**
- Ingredient categorization
- List generation from multiple recipes

**plannerController**
- Weekly meal plan generation via Gemini
- Meal plan storage and retrieval

### Middleware Stack

```
Request
  ↓
CORS Middleware
  ↓
JSON Parser
  ↓
Route-specific Middleware
  ├── Auth Middleware (validates JWT)
  └── Validation Middleware (validates input)
  ↓
Controller
  ↓
Error Handler
  ↓
Response
```

### Database Schema

**User**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  passwordHash: String,
  createdAt: Date
}
```

**Favorite**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  recipe: Mixed (full recipe object),
  mood: String,
  createdAt: Date
}
```

**RecipeLog**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  mood: String,
  queryBody: Mixed (request parameters),
  recipesReturned: Array,
  createdAt: Date
}
```

**MealPlan**
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  weekPlan: Array (7 days of meals),
  createdAt: Date
}
```

## Authentication Flow

### Registration

```
User Input (name, email, password)
    ↓
Validation (email format, password length)
    ↓
Check if email exists
    ↓
Hash password (bcryptjs)
    ↓
Create User document
    ↓
Generate JWT token
    ↓
Return token + user data
    ↓
Frontend stores token in localStorage
```

### Login

```
User Input (email, password)
    ↓
Find user by email
    ↓
Compare password with hash (bcryptjs)
    ↓
Generate JWT token
    ↓
Return token + user data
    ↓
Frontend stores token in localStorage
```

### Protected Routes

```
Request with Authorization header
    ↓
Extract token from "Bearer <token>"
    ↓
Verify token signature (JWT)
    ↓
Decode token to get userId
    ↓
Attach userId to request
    ↓
Proceed to controller
```

## Recipe Generation Pipeline

### Step 1: Request Validation
```javascript
// Check mood is provided
if (!mood) return 400 error
```

### Step 2: Rate Limiting
```javascript
// Check user hasn't exceeded 5 requests/minute
if (requestCount >= 5) return 429 error
```

### Step 3: Prompt Construction
```javascript
// Build Gemini prompt with mood, diet, time, difficulty, cuisine
const prompt = buildGeminiPrompt(mood, diet, time, difficulty, cuisine)
```

### Step 4: Gemini API Call
```javascript
// Send prompt to Gemini
const result = await model.generateContent(prompt)
```

### Step 5: JSON Parsing
```javascript
// Extract JSON array from response
const recipes = extractJSON(responseText)
```

### Step 6: YouTube Integration
```javascript
// For each recipe, search YouTube for video
const youtube = await searchYouTube(recipe.youtube_query)
```

### Step 7: Response Formatting
```javascript
// Add metadata and return
return recipes.map(r => ({
  ...r,
  id: generateId(),
  youtube: youtubeData,
  moodMatchedBy: `Generated for mood: ${mood}`
}))
```

### Step 8: Logging
```javascript
// Log request for analytics
const log = new RecipeLog({
  user: userId,
  mood,
  queryBody: { mood, diet, time, difficulty, cuisine },
  recipesReturned: recipes
})
await log.save()
```

## Error Handling

### Frontend Error Handling

```javascript
try {
  const result = await api.call()
  // Success handling
} catch (error) {
  // Display error to user
  setError(error.message)
  // Log for debugging
  console.error(error)
}
```

### Backend Error Handling

```javascript
// Validation errors (400)
if (!mood) return res.status(400).json({ error: 'Mood required' })

// Auth errors (401)
if (!token) return res.status(401).json({ error: 'No token' })

// Not found errors (404)
if (!user) return res.status(404).json({ error: 'User not found' })

// Rate limit errors (429)
if (rateLimited) return res.status(429).json({ error: 'Rate limited' })

// Server errors (500)
catch (error) {
  console.error(error)
  return res.status(500).json({ error: 'Server error' })
}
```

## Performance Considerations

### Frontend Optimization
- **Code Splitting**: Pages loaded on demand
- **Lazy Loading**: Components render only when needed
- **Caching**: API responses cached in state
- **Memoization**: Prevent unnecessary re-renders

### Backend Optimization
- **Database Indexing**: Indexes on user._id, favorite.user
- **Rate Limiting**: Prevent API abuse
- **Error Recovery**: Graceful fallbacks for API failures
- **Logging**: Track performance metrics

### API Optimization
- **Minimal Payload**: Only send necessary data
- **Compression**: Gzip responses
- **Caching**: Cache Gemini responses if possible
- **Batch Operations**: Combine multiple requests

## Security Measures

### Authentication
- JWT tokens with 12-hour expiration
- Secure password hashing (bcryptjs)
- Token stored in localStorage (XSS vulnerable, but acceptable for demo)

### Authorization
- Protected routes require valid JWT
- Users can only access their own data
- Middleware validates token on each request

### Input Validation
- Email format validation
- Password length requirements
- Mood/diet enum validation
- Sanitize user inputs

### API Security
- CORS enabled for frontend only
- Rate limiting on recipe generation
- Error messages don't leak sensitive info
- Secure headers (in production)

## Scalability Considerations

### Horizontal Scaling
- Stateless backend (can run multiple instances)
- Load balancer distributes requests
- MongoDB handles concurrent connections

### Vertical Scaling
- Optimize database queries
- Cache frequently accessed data
- Implement pagination for large datasets

### Future Improvements
- Redis caching layer
- Message queue for async tasks
- CDN for static assets
- Database replication

## Deployment Architecture

### Development
```
Local Machine
├── Frontend (localhost:3000)
├── Backend (localhost:5000)
└── MongoDB (localhost:27017)
```

### Production
```
Cloud Provider (AWS/Heroku/Vercel)
├── Frontend (CDN/Static Hosting)
├── Backend (Container/Serverless)
├── MongoDB (Managed Database)
└── External APIs (Gemini, YouTube)
```

## Monitoring & Logging

### Backend Logs
- API request/response
- Database operations
- Gemini API calls
- Error stack traces

### Frontend Logs
- API calls and responses
- User interactions
- Error messages
- Performance metrics

### Metrics to Track
- API response time
- Error rate
- User registration rate
- Recipe generation success rate
- Database query performance

## Testing Strategy

### Unit Tests
- Controller functions
- Validation middleware
- Utility functions

### Integration Tests
- API endpoints
- Database operations
- Auth flow

### E2E Tests
- User registration
- Recipe generation
- Favorites management
- Meal planning

### Manual Testing
- UI/UX verification
- Cross-browser compatibility
- Mobile responsiveness
- Accessibility

---

**This architecture is designed for clarity, maintainability, and scalability.**

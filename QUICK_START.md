# MoodBite Quick Start Guide

Get MoodBite running in 5 minutes.

## Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- Google Gemini API key (free tier available)

## 1. Clone & Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env

# Frontend
cd frontend
npm install
cp .env.example .env
```

## 2. Configure Environment

### Backend `.env`

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/moodbite
JWT_SECRET=your_random_secret_key_12345
GEMINI_KEY=your_gemini_api_key_here
YOUTUBE_API_KEY=optional_youtube_key
NODE_ENV=development
```

### Frontend `.env`

```
VITE_API_BASE=http://localhost:5000/api
```

## 3. Start Services

### Terminal 1: MongoDB
```bash
mongod
```

### Terminal 2: Backend
```bash
cd backend
npm run dev
```

### Terminal 3: Frontend
```bash
cd frontend
npm run dev
```

## 4. Access Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

## 5. Test It Out

1. **Register**: Click "Sign Up", create account
2. **Generate**: Select mood, click "✨ Generate Recipes"
3. **Save**: Click "🤍 Save" on a recipe
4. **Plan**: Go to "📅 Planner", generate weekly plan
5. **Shop**: Select recipes, click "🛒 Shopping List"

## Common Issues

### MongoDB Connection Failed
```bash
# Start MongoDB
mongod

# Or use MongoDB Atlas
# Update MONGO_URI in .env to your Atlas connection string
```

### Gemini API Errors
- Get free API key: https://aistudio.google.com
- Enable Generative Language API in Google Cloud Console
- Check quota and billing

### Port Already in Use
```bash
# Change PORT in backend .env
# Or kill process using port:
# Windows: netstat -ano | findstr :5000
# Mac/Linux: lsof -i :5000
```

### CORS Errors
- Ensure backend is running
- Check VITE_API_BASE matches backend URL
- Verify backend has CORS enabled

## File Structure

```
backend/
├── src/
│   ├── server.js           # Main app
│   ├── config/db.js        # MongoDB config
│   ├── models/             # Schemas
│   ├── controllers/        # Business logic
│   ├── routes/             # API endpoints
│   └── middleware/         # Auth & validation
├── package.json
└── .env

frontend/
├── src/
│   ├── App.jsx             # Main component
│   ├── api.js              # API client
│   ├── pages/              # Page components
│   ├── components/         # Reusable components
│   └── index.css           # Tailwind styles
├── package.json
└── .env
```

## Key Features

| Feature | How to Use |
|---------|-----------|
| Generate Recipes | Home page → Select mood → Click "Generate" |
| Save Favorites | Click "🤍 Save" on recipe card |
| View Favorites | Click "❤️ Favorites" in header |
| Shopping List | Select recipes → Click "🛒 Shopping List" |
| Meal Planner | Click "📅 Planner" → Generate week |
| View Steps | Click "▶ Cook Mode" on recipe |
| Watch Video | Click "▶️ Watch on YouTube" |

## API Endpoints

```
POST   /api/auth/register          # Create account
POST   /api/auth/login             # Login
POST   /api/recipes/generate       # Get recipes (protected)
POST   /api/recipes/favorite       # Save recipe (protected)
GET    /api/recipes/favorite       # Get favorites (protected)
DELETE /api/recipes/favorite/:id   # Delete favorite (protected)
POST   /api/recipes/shopping-list  # Generate list (protected)
POST   /api/planner/week           # Generate plan (protected)
GET    /api/planner                # Get plans (protected)
```

## Testing

```bash
# Backend tests
cd backend
npm test

# Manual testing
# See TESTING.md for detailed guide
```

## Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Deploy from git
3. Ensure MongoDB is accessible

### Frontend (Vercel/Netlify)
1. Run `npm run build`
2. Deploy `dist/` folder
3. Set `VITE_API_BASE` to production backend

## Useful Commands

```bash
# Backend
npm run dev          # Start with auto-reload
npm start            # Start production
npm test             # Run tests

# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Database

### View Data (MongoDB)
```bash
mongo
use moodbite
db.users.find()
db.favorites.find()
db.recipeLogs.find()
db.mealplans.find()
```

### Reset Database
```bash
mongo
use moodbite
db.dropDatabase()
```

## Performance Tips

1. **Caching**: Recipes are cached in browser localStorage
2. **Lazy Loading**: Pages load on demand
3. **Optimized Images**: Use image URLs from Gemini
4. **Rate Limiting**: 5 requests/min per user to prevent abuse

## Security

- Passwords hashed with bcryptjs
- JWT tokens expire in 12 hours
- Protected API routes require authentication
- Input validation on all endpoints
- CORS enabled for frontend only

## Troubleshooting

**Can't login?**
- Check email/password are correct
- Verify MongoDB is running
- Check backend logs

**Recipes not generating?**
- Verify Gemini API key is valid
- Check API quota
- Try different mood/filters

**Shopping list empty?**
- Select at least one recipe
- Ensure recipes have ingredients

**Meal planner not working?**
- Login required
- Check backend logs for errors
- Verify Gemini API is working

## Next Steps

1. ✅ Get it running locally
2. 📖 Read full README.md for details
3. 🧪 Run tests in TESTING.md
4. 🚀 Deploy to production
5. 📊 Monitor and optimize

## Support

- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
- Testing Guide: `TESTING.md`
- Gemini Guide: `GEMINI_PROMPTING.md`
- Main README: `README.md`

---

**You're all set! Happy cooking! 🍽️**

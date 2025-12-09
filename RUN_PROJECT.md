# How to Run MoodBite Project

## Prerequisites

You need to have these installed:
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- A code editor (VS Code recommended)

## Step 1: Get Gemini API Key (Required)

1. Go to https://aistudio.google.com
2. Click "Get API Key"
3. Create a new API key
4. Copy the key

## Step 2: Update Backend Environment Variables

Edit `backend/.env` and add your Gemini key:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/moodbite
JWT_SECRET=your_super_secret_jwt_key_12345_change_in_production
GEMINI_KEY=YOUR_GEMINI_API_KEY_HERE  ← Paste your key here
YOUTUBE_API_KEY=your_youtube_api_key_here
NODE_ENV=development
```

## Step 3: Start MongoDB

### Option A: Local MongoDB (if installed)
```bash
mongod
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a cluster
4. Get connection string
5. Update `MONGO_URI` in backend/.env

## Step 4: Start Backend

Open a terminal and run:

```bash
cd backend
npm run dev
```

You should see:
```
MoodBite backend running on port 5000
MongoDB connected successfully
```

## Step 5: Start Frontend

Open a NEW terminal and run:

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v4.4.5  ready in 123 ms

➜  Local:   http://localhost:3000/
```

## Step 6: Open in Browser

Click the link or go to: **http://localhost:3000**

## Testing the App

1. **Register**: Click "Sign Up", create an account
2. **Generate Recipes**: Select mood, click "Generate Recipes"
3. **Save Favorite**: Click "Save" on a recipe
4. **View Favorites**: Click "Favorites" in header
5. **Shopping List**: Select recipes, click "Shopping List"
6. **Meal Planner**: Click "Planner", generate week

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB with `mongod` or use MongoDB Atlas

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: 
- Change PORT in backend/.env to 5001
- Or kill the process using port 5000

### Gemini API Error
```
Error: API key not valid
```
**Solution**: 
- Get a new key from https://aistudio.google.com
- Update GEMINI_KEY in backend/.env

### Frontend Can't Connect to Backend
```
Error: Failed to fetch
```
**Solution**:
- Ensure backend is running on port 5000
- Check VITE_API_BASE in frontend/.env is correct
- Check browser console for CORS errors

### npm install fails
```
npm ERR! code ETARGET
```
**Solution**:
```bash
npm cache clean --force
npm install
```

## Project Structure

```
MoodBite/
├── backend/
│   ├── src/
│   │   ├── server.js          # Main app
│   │   ├── config/db.js       # Database config
│   │   ├── models/            # Database schemas
│   │   ├── controllers/       # Business logic
│   │   ├── routes/            # API endpoints
│   │   └── middleware/        # Auth & validation
│   ├── package.json
│   ├── .env                   # Environment variables
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main component
│   │   ├── pages/             # Page components
│   │   ├── components/        # Reusable components
│   │   ├── api.js             # API client
│   │   └── index.css          # Styles
│   ├── package.json
│   ├── .env                   # Environment variables
│   └── README.md
│
└── README.md                  # Main documentation
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Recipes
- `POST /api/recipes/generate` - Generate recipes (protected)
- `POST /api/recipes/favorite` - Save recipe (protected)
- `GET /api/recipes/favorite` - Get favorites (protected)
- `DELETE /api/recipes/favorite/:id` - Delete favorite (protected)
- `POST /api/recipes/shopping-list` - Generate list (protected)

### Meal Planner
- `POST /api/planner/week` - Generate plan (protected)
- `GET /api/planner` - Get plans (protected)

## Development Tips

### Hot Reload
- Backend: Changes auto-reload with nodemon
- Frontend: Changes auto-reload with Vite

### Debug Backend
```bash
# In backend/.env, set:
NODE_ENV=development

# Check logs in terminal
```

### Debug Frontend
- Open browser DevTools (F12)
- Go to Console tab
- Check Network tab for API calls

### Test API Manually
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Set up environment variables
3. ✅ Start MongoDB
4. ✅ Start backend
5. ✅ Start frontend
6. ✅ Test the app
7. 📖 Read TESTING.md for comprehensive testing
8. 🚀 Read DEPLOYMENT.md for production setup

## Need Help?

- Check backend logs in terminal
- Check frontend console (F12)
- Read backend/README.md for API details
- Read frontend/README.md for UI details
- Read TESTING.md for testing guide

---

**Happy cooking! 🍽️**

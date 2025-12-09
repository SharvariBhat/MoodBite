# MoodBite Setup Checklist

## ✅ What's Already Done

- [x] Backend dependencies installed
- [x] Frontend dependencies installed
- [x] Backend `.env` file created
- [x] Frontend `.env` file created

## 📋 What You Need to Do

### 1. Get Gemini API Key (5 minutes)
- [ ] Go to https://aistudio.google.com
- [ ] Click "Get API Key"
- [ ] Create new API key
- [ ] Copy the key
- [ ] Paste in `backend/.env` as `GEMINI_KEY=YOUR_KEY_HERE`

### 2. Setup MongoDB (Choose One)

#### Option A: Local MongoDB (Recommended for Development)
- [ ] Download MongoDB from https://www.mongodb.com/try/download/community
- [ ] Install it
- [ ] Start MongoDB:
  ```bash
  mongod
  ```
- [ ] Keep it running in a terminal

#### Option B: MongoDB Atlas (Cloud - Free)
- [ ] Go to https://www.mongodb.com/cloud/atlas
- [ ] Create free account
- [ ] Create a cluster
- [ ] Create database user
- [ ] Get connection string
- [ ] Update `backend/.env`:
  ```
  MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/moodbite
  ```

### 3. Start Backend

Open a terminal:
```bash
cd backend
npm run dev
```

Wait for:
```
MoodBite backend running on port 5000
MongoDB connected successfully
```

### 4. Start Frontend

Open a NEW terminal:
```bash
cd frontend
npm run dev
```

Wait for:
```
➜  Local:   http://localhost:3000/
```

### 5. Test in Browser

- [ ] Go to http://localhost:3000
- [ ] Click "Sign Up"
- [ ] Create account with:
  - Name: Test User
  - Email: test@example.com
  - Password: password123
- [ ] Click "Generate Recipes"
- [ ] Select mood: "happy"
- [ ] Click "✨ Generate Recipes"
- [ ] Wait for 3 recipes to appear
- [ ] Click "🤍 Save" on a recipe
- [ ] Click "❤️ Favorites" to see saved recipe

## 🎯 Success Indicators

✅ Backend running on port 5000
✅ Frontend running on port 3000
✅ Can register new user
✅ Can generate recipes
✅ Can save favorites
✅ No error messages in console

## 🆘 If Something Goes Wrong

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# If in use, change PORT in backend/.env to 5001
```

### MongoDB connection error
```bash
# Make sure MongoDB is running
mongod

# Or use MongoDB Atlas connection string
```

### Frontend can't connect to backend
```bash
# Check backend is running on port 5000
# Check VITE_API_BASE in frontend/.env is correct
# Open browser console (F12) for error details
```

### Gemini API error
```bash
# Get new key from https://aistudio.google.com
# Update GEMINI_KEY in backend/.env
# Restart backend
```

## 📚 Documentation

- `RUN_PROJECT.md` - Detailed running instructions
- `README.md` - Project overview
- `QUICK_START.md` - 5-minute setup
- `TESTING.md` - Testing guide
- `ARCHITECTURE.md` - System design
- `DEPLOYMENT.md` - Production setup

## 🚀 You're Ready When

- [ ] Backend running and connected to MongoDB
- [ ] Frontend running and can access http://localhost:3000
- [ ] Can register and login
- [ ] Can generate recipes with Gemini
- [ ] Can save and view favorites

---

**Once all checkboxes are done, you're ready to explore the app! 🎉**

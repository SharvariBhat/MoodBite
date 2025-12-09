# MoodBite Frontend

React + Vite + Tailwind CSS frontend for the MoodBite mood-based recipe generator.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your backend URL:
```
VITE_API_BASE=http://localhost:5000/api
```

## Running

Development mode (with hot reload):
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Features

- **Mood-based Recipe Generation**: Select your mood and get 3 personalized recipe suggestions
- **Advanced Filters**: Filter by diet, cooking time, difficulty, and cuisine
- **Recipe Details**: View ingredients, steps, nutrition info, and YouTube videos
- **Favorites**: Save your favorite recipes for later
- **Shopping List**: Generate a categorized shopping list from selected recipes
- **Weekly Meal Planner**: Plan your entire week with mood-based meals
- **User Authentication**: Register and login to save your preferences
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

## Project Structure

```
src/
├── components/
│   ├── Header.jsx          # Navigation header
│   ├── MoodSelector.jsx    # Mood and filter selector
│   └── RecipeCard.jsx      # Recipe display card
├── pages/
│   ├── home.jsx            # Main recipe generation page
│   ├── login.jsx           # Login page
│   ├── register.jsx        # Registration page
│   ├── favourites.jsx      # Saved favorites page
│   └── planner.jsx         # Weekly meal planner page
├── api.js                  # API client helper
├── App.jsx                 # Main app component
├── main.jsx                # React entry point
└── index.css               # Global styles with Tailwind
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_API_BASE | Backend API base URL | http://localhost:5000/api |

## Styling

The app uses Tailwind CSS with a warm color gradient theme (orange to peach). All components are responsive and mobile-first.

### Color Scheme
- Primary: Orange gradient (#f97316 to #fb923c)
- Backgrounds: Light gray (#f9fafb)
- Text: Dark gray (#1f2937)

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Color contrast compliance
- Mobile-friendly touch targets

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

- Code splitting with Vite
- Lazy loading of pages
- Optimized images
- Minimal dependencies
- Fast hot module replacement (HMR) in dev

## Development Tips

1. **API Debugging**: Check browser DevTools Network tab to see API calls
2. **Local Storage**: User token and data are stored in localStorage
3. **Error Handling**: All API errors are caught and displayed to the user
4. **Loading States**: Components show loading indicators during API calls

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory ready for deployment.

## Deployment

The built app can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Any web server

Just ensure the `VITE_API_BASE` environment variable points to your production backend.

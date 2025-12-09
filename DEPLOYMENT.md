# MoodBite Deployment Guide

Complete guide to deploy MoodBite to production.

## Prerequisites

- Git repository set up
- Production MongoDB instance (Atlas recommended)
- Backend hosting (Heroku, Railway, Render, AWS, etc.)
- Frontend hosting (Vercel, Netlify, AWS S3, etc.)
- Google Gemini API key
- YouTube API key (optional)

## Backend Deployment

### Option 1: Heroku

1. **Install Heroku CLI**
```bash
# Windows
choco install heroku-cli

# Mac
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

2. **Login to Heroku**
```bash
heroku login
```

3. **Create Heroku App**
```bash
cd backend
heroku create moodbite-backend
```

4. **Set Environment Variables**
```bash
heroku config:set PORT=5000
heroku config:set MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/moodbite
heroku config:set JWT_SECRET=your_production_secret_key
heroku config:set GEMINI_KEY=your_gemini_api_key
heroku config:set YOUTUBE_API_KEY=your_youtube_api_key
heroku config:set NODE_ENV=production
```

5. **Deploy**
```bash
git push heroku main
```

6. **View Logs**
```bash
heroku logs --tail
```

### Option 2: Railway

1. **Connect GitHub**
- Go to railway.app
- Connect your GitHub account
- Select repository

2. **Create Project**
- Click "New Project"
- Select "Deploy from GitHub"
- Choose moodbite repository

3. **Configure Environment**
- Add environment variables in Railway dashboard
- Same variables as Heroku

4. **Deploy**
- Railway auto-deploys on git push

### Option 3: Render

1. **Connect GitHub**
- Go to render.com
- Connect GitHub account

2. **Create Web Service**
- Click "New +"
- Select "Web Service"
- Connect repository

3. **Configure**
- Set build command: `npm install`
- Set start command: `npm start`
- Add environment variables

4. **Deploy**
- Click "Create Web Service"

### Option 4: AWS EC2

1. **Launch EC2 Instance**
```bash
# Ubuntu 20.04 LTS recommended
# t2.micro for free tier
```

2. **SSH into Instance**
```bash
ssh -i your-key.pem ubuntu@your-instance-ip
```

3. **Install Dependencies**
```bash
sudo apt update
sudo apt install nodejs npm git
```

4. **Clone Repository**
```bash
git clone https://github.com/your-repo/moodbite.git
cd moodbite/backend
npm install
```

5. **Set Environment Variables**
```bash
nano .env
# Add all environment variables
```

6. **Install PM2 (Process Manager)**
```bash
sudo npm install -g pm2
pm2 start src/server.js --name "moodbite-backend"
pm2 startup
pm2 save
```

7. **Configure Nginx (Reverse Proxy)**
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

## Frontend Deployment

### Option 1: Vercel

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
cd frontend
vercel
```

3. **Configure Environment**
- Set `VITE_API_BASE` to production backend URL
- In Vercel dashboard: Settings → Environment Variables

4. **Auto-Deploy**
- Connect GitHub repository
- Auto-deploys on git push

### Option 2: Netlify

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Deploy via Netlify UI**
- Go to netlify.com
- Drag and drop `dist/` folder
- Or connect GitHub for auto-deploy

3. **Configure Environment**
- Site settings → Build & deploy
- Add environment variables
- Set build command: `npm run build`
- Set publish directory: `dist`

### Option 3: AWS S3 + CloudFront

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Create S3 Bucket**
```bash
aws s3 mb s3://moodbite-frontend
```

3. **Upload Build**
```bash
aws s3 sync dist/ s3://moodbite-frontend --delete
```

4. **Create CloudFront Distribution**
- Origin: S3 bucket
- Default root object: index.html
- Enable compression

5. **Configure DNS**
- Point domain to CloudFront distribution

### Option 4: GitHub Pages

1. **Build Frontend**
```bash
cd frontend
npm run build
```

2. **Deploy to GitHub Pages**
```bash
# Add to package.json
"homepage": "https://your-username.github.io/moodbite"

# Deploy
npm run build
git add dist/
git commit -m "Deploy to GitHub Pages"
git push
```

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Account**
- Go to mongodb.com/cloud/atlas
- Sign up for free account

2. **Create Cluster**
- Click "Create a Deployment"
- Choose free tier
- Select region closest to you

3. **Create Database User**
- Go to Database Access
- Add new database user
- Save username and password

4. **Get Connection String**
- Go to Clusters
- Click "Connect"
- Copy connection string
- Replace `<username>` and `<password>`

5. **Whitelist IP**
- Go to Network Access
- Add IP address (or 0.0.0.0/0 for anywhere)

6. **Use Connection String**
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/moodbite?retryWrites=true&w=majority
```

### Self-Hosted MongoDB

1. **Install MongoDB**
```bash
# Ubuntu
sudo apt install mongodb

# Mac
brew install mongodb-community
```

2. **Start MongoDB**
```bash
sudo systemctl start mongod
```

3. **Create Database**
```bash
mongo
use moodbite
db.createCollection("users")
```

4. **Connection String**
```
MONGO_URI=mongodb://localhost:27017/moodbite
```

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

1. **Install Certbot**
```bash
sudo apt install certbot python3-certbot-nginx
```

2. **Get Certificate**
```bash
sudo certbot certonly --nginx -d your-domain.com
```

3. **Configure Nginx**
```bash
sudo nano /etc/nginx/sites-available/default
```

Add:
```nginx
server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
    }
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

4. **Restart Nginx**
```bash
sudo systemctl restart nginx
```

## Environment Variables Checklist

### Backend Production
- [ ] PORT (usually 80 or 443)
- [ ] MONGO_URI (production database)
- [ ] JWT_SECRET (strong random string)
- [ ] GEMINI_KEY (valid API key)
- [ ] YOUTUBE_API_KEY (optional)
- [ ] NODE_ENV=production

### Frontend Production
- [ ] VITE_API_BASE (production backend URL)

## Pre-Deployment Checklist

### Backend
- [ ] All tests passing
- [ ] Error handling in place
- [ ] Logging configured
- [ ] Database indexes created
- [ ] Rate limiting enabled
- [ ] CORS configured for frontend domain
- [ ] Environment variables set
- [ ] Database backups configured

### Frontend
- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] API calls use production URL
- [ ] Images optimized
- [ ] Responsive design tested
- [ ] Accessibility checked
- [ ] Performance tested

### General
- [ ] Domain registered
- [ ] SSL certificate obtained
- [ ] Monitoring set up
- [ ] Backups configured
- [ ] Documentation updated
- [ ] Team notified

## Post-Deployment Testing

### Smoke Tests

1. **Health Check**
```bash
curl https://your-backend.com/api/health
```

2. **Register User**
```bash
curl -X POST https://your-backend.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"password123"}'
```

3. **Generate Recipes**
```bash
curl -X POST https://your-backend.com/api/recipes/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mood":"happy"}'
```

4. **Frontend Access**
- Open https://your-frontend.com
- Test all pages
- Test all features

## Monitoring & Logging

### Backend Monitoring

1. **Application Logs**
```bash
# Heroku
heroku logs --tail

# AWS EC2
tail -f /var/log/app.log

# Railway
View in dashboard
```

2. **Error Tracking**
- Set up Sentry for error tracking
- Configure email alerts

3. **Performance Monitoring**
- Monitor API response times
- Track database query performance
- Monitor Gemini API usage

### Frontend Monitoring

1. **Error Tracking**
- Set up Sentry for frontend errors
- Monitor console errors

2. **Performance**
- Monitor page load times
- Track Core Web Vitals
- Monitor API call performance

## Scaling Considerations

### Horizontal Scaling
- Run multiple backend instances
- Use load balancer
- MongoDB handles concurrent connections

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching

### Caching
- Add Redis for session caching
- Cache Gemini responses
- Cache popular recipes

## Backup Strategy

### Database Backups
```bash
# MongoDB Atlas: Automatic daily backups

# Self-hosted:
mongodump --uri "mongodb://localhost:27017/moodbite" --out /backups/
```

### Code Backups
- Use GitHub for version control
- Tag releases
- Keep deployment history

## Rollback Plan

### If Deployment Fails

1. **Backend**
```bash
# Heroku
heroku releases
heroku rollback v123

# AWS
git revert <commit-hash>
git push
```

2. **Frontend**
- Revert to previous deployment
- Redeploy from previous build

## Maintenance

### Regular Tasks
- Monitor logs daily
- Check error rates
- Review performance metrics
- Update dependencies monthly
- Test backups quarterly

### Security Updates
- Keep Node.js updated
- Update npm packages
- Patch security vulnerabilities
- Rotate API keys annually

## Troubleshooting

### Backend Won't Start
```bash
# Check logs
heroku logs --tail

# Check environment variables
heroku config

# Restart
heroku restart
```

### Frontend Not Loading
- Check browser console
- Verify API URL is correct
- Check CORS settings
- Clear browser cache

### Database Connection Issues
- Verify connection string
- Check IP whitelist
- Verify credentials
- Check network connectivity

### API Errors
- Check backend logs
- Verify API keys
- Check rate limiting
- Monitor Gemini API quota

## Performance Optimization

### Backend
- Enable gzip compression
- Implement caching
- Optimize database queries
- Use CDN for static files

### Frontend
- Minify and bundle code
- Optimize images
- Lazy load components
- Use service workers

## Cost Optimization

### Free/Cheap Options
- MongoDB Atlas free tier
- Heroku free tier (limited)
- Vercel free tier
- GitHub Pages
- Let's Encrypt SSL

### Paid Options
- AWS: ~$10-50/month
- Heroku: ~$7-50/month
- Railway: ~$5-50/month
- MongoDB Atlas: ~$0-100/month

## Support & Documentation

- Backend logs: Check hosting provider dashboard
- Frontend errors: Browser DevTools console
- API issues: Check Gemini API dashboard
- Database issues: MongoDB Atlas dashboard

---

**Your MoodBite app is now live! 🚀**

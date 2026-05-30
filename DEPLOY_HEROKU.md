# Deployment Guide - Heroku (Recommended for Students)

Heroku is the **easiest and fastest** way to deploy for free! This guide covers deploying both backend and frontend.

## Why Heroku?

✅ Free tier available (with credit)  
✅ One-command deployment  
✅ Automatic SSL/TLS  
✅ Easy environment variables  
✅ Built-in database options  
✅ No server management  

## Prerequisites

- Heroku account (free): `https://signup.heroku.com/`
- Heroku CLI: `https://devcenter.heroku.com/articles/heroku-cli`
- GitHub account with your repository

## Step 1: Login to Heroku

```bash
heroku login
```

## Step 2: Create Backend App

```bash
cd backend

# Create Heroku app
heroku create nest-rental-api

# Add MongoDB Atlas addon (or use external connection)
heroku addons:create mongolab:sandbox

# Add environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET="your-super-secret-key-change-this"
heroku config:set CORS_ORIGIN="https://nest-rental-web.herokuapp.com"
heroku config:set EMAIL_SERVICE=gmail
heroku config:set EMAIL_USER="your-email@gmail.com"
heroku config:set EMAIL_PASSWORD="your-app-password"

# View all config
heroku config
```

## Step 3: Configure Backend Procfile

The Procfile tells Heroku how to start your app. Create `Procfile` in backend directory:

```
web: npm run build && node dist/server.js
```

Or for development:

```
web: npm run dev
```

## Step 4: Deploy Backend to Heroku

```bash
# Deploy using Heroku Git
git push heroku main

# Or using GitHub (recommended for CI/CD)
heroku apps:info
# Note the app name, then link GitHub

# View logs
heroku logs --tail
```

## Step 5: Create Frontend App

```bash
cd ../frontend

# Create separate Heroku app for frontend
heroku create nest-rental-web

# Set build environment variable
heroku config:set REACT_APP_API_URL="https://nest-rental-api.herokuapp.com/api"

# If using GitHub deployment, link your repo
heroku git:remote -a nest-rental-web
```

## Step 6: Configure Frontend Buildpack

```bash
# Add Node.js and custom buildpack
heroku buildpacks:add heroku/nodejs
heroku buildpacks:add https://github.com/mars/create-react-app-buildpack.git
```

## Step 7: Deploy Frontend

```bash
git push heroku main
```

## Step 8: Connect Apps

```bash
# Update backend CORS to allow frontend
heroku config:set CORS_ORIGIN="https://nest-rental-web.herokuapp.com" -a nest-rental-api

# Backend health check
curl https://nest-rental-api.herokuapp.com/health
```

## Step 9: Use GitHub Integration (Recommended)

For automatic deployments on every push:

1. Go to Heroku Dashboard
2. Select your app
3. Go to "Deploy" tab
4. Connect to GitHub
5. Select your repository
6. Enable automatic deploys from `main` branch
7. Check "Wait for CI to pass"

## Step 10: Setup MongoDB Atlas Connection

Instead of Heroku addon (which is deprecated), use MongoDB Atlas:

```bash
# Get connection string from MongoDB Atlas (created earlier)
heroku config:set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/nest-rental?retryWrites=true&w=majority" -a nest-rental-api

# Verify connection
heroku logs -a nest-rental-api --tail
```

## Step 11: Enable Add-ons (Optional)

```bash
# Papertrail for log aggregation
heroku addons:create papertrail:choklad

# RedisToGo for caching
heroku addons:create redistogo:nano

# SendGrid for email
heroku addons:create sendgrid:starter
```

## Step 12: Configure Custom Domain

```bash
# Add custom domain
heroku domains:add api.yourdomain.com -a nest-rental-api
heroku domains:add yourdomain.com -a nest-rental-web

# Get DNS target
heroku domains -a nest-rental-api

# Update your DNS provider:
# CNAME: api.yourdomain.com -> nest-rental-api.herokuapp.com
# CNAME: yourdomain.com -> nest-rental-web.herokuapp.com
```

## Step 13: Setup SSL/TLS

```bash
# Heroku automatically provides SSL on *.herokuapp.com
# For custom domains:
heroku certs:auto:enable -a nest-rental-api
```

## Step 14: Monitor and Troubleshoot

```bash
# View logs
heroku logs -a nest-rental-api --tail

# Run one-off dyno (useful for migrations, backups)
heroku run npm test -a nest-rental-api

# Check app status
heroku apps:info -a nest-rental-api

# Scale dynos if needed
heroku ps:scale web=2 -a nest-rental-api  # 2 web workers
```

## Complete Deployment Script

Save as `deploy.sh`:

```bash
#!/bin/bash

set -e

echo "🚀 Deploying Nest Rental App to Heroku..."

# Backend
echo "📦 Deploying Backend..."
cd backend
heroku config:set NODE_ENV=production -a nest-rental-api
heroku config:set JWT_SECRET="$(openssl rand -hex 32)" -a nest-rental-api
git push heroku main -a nest-rental-api

# Frontend
echo "📦 Deploying Frontend..."
cd ../frontend
heroku config:set REACT_APP_API_URL="https://nest-rental-api.herokuapp.com/api" -a nest-rental-web
git push heroku main -a nest-rental-web

echo "✅ Deployment complete!"
echo "🔗 Backend: https://nest-rental-api.herokuapp.com"
echo "🔗 Frontend: https://nest-rental-web.herokuapp.com"

# Test endpoints
echo "🧪 Testing endpoints..."
curl https://nest-rental-api.herokuapp.com/health
```

Run with:
```bash
chmod +x deploy.sh
./deploy.sh
```

## Cost Estimation

### Free Tier (Beginner)
- Heroku: Free dyno ~$0/month (may sleep after 30 mins of inactivity)
- MongoDB Atlas: Free tier ~$0/month
- **Total: $0**

### Hobby Tier (Development)
- Heroku: 1 Hobby dyno: ~$7/month
- MongoDB Atlas: Free tier
- **Total: ~$7/month**

### Standard Tier (Production)
- Heroku: 2 Standard dynos: ~$50/month
- MongoDB Atlas: Shared tier: ~$57/month
- Papertrail: ~$10/month
- **Total: ~$117/month**

## Upgrading from Free Tier

When your app gets popular:

```bash
# Scale up dynos (more power)
heroku ps:type standard-1x -a nest-rental-api

# Scale out workers (more instances)
heroku ps:scale web=3 -a nest-rental-api

# Add database backups
heroku addons:create mongolab:professional
```

## Troubleshooting

### App won't start
```bash
heroku logs -a nest-rental-api --tail
# Check for env variable issues
```

### Slow startup
```bash
# Check build logs
heroku logs --source=build -a nest-rental-api
```

### Database connection failed
```bash
# Verify MongoDB URI is set
heroku config -a nest-rental-api
# Check MongoDB Atlas whitelist includes all IPs
```

### Dyno sleeping
- Free tier dynos sleep after 30 mins of inactivity
- Upgrade to Hobby tier ($7/month) to prevent sleeping
- Or use `https://newrelic.com/` to keep dyno awake

## GitHub Actions for Auto-Deployment

Create `.github/workflows/heroku-deploy.yml`:

```yaml
name: Deploy to Heroku

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Backend
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "nest-rental-api"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
          appdir: "backend"

      - name: Deploy Frontend
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "nest-rental-web"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
          appdir: "frontend"
```

Set GitHub secrets:
```bash
HEROKU_API_KEY=<your-api-key>
HEROKU_EMAIL=<your-email>
```

## Next Steps

1. ✅ Deploy to Heroku using this guide
2. ⏰ Test the app on Heroku (backend + frontend)
3. 🔐 Update security headers and JWT secrets
4. 📧 Configure email service (Gmail or SendGrid)
5. 🎨 Setup custom domain
6. 📊 Add monitoring (NewRelic free tier)
7. 💾 Configure database backups
8. 🚀 When ready, upgrade to production tier

## Useful Commands Reference

```bash
# App management
heroku create nest-rental-api          # Create app
heroku apps:rename newname -a old-app  # Rename app
heroku apps:destroy -a app             # Delete app

# Configuration
heroku config -a nest-rental-api       # View env vars
heroku config:set KEY=VALUE -a app     # Set env var
heroku config:unset KEY -a app         # Remove env var

# Deployment
git push heroku main                   # Deploy via Heroku Git
heroku releases -a app                 # View release history
heroku rollback -a app                 # Rollback to previous version

# Diagnostics
heroku logs -a app                     # View logs
heroku logs --tail -a app              # Stream logs
heroku dyno:restart -a app             # Restart app
heroku ps -a app                       # View running processes

# Database
heroku pg:info -a app                  # Database info
heroku run bash -a app                 # SSH into dyno
heroku addons:create -a app            # Add add-on
```

Good luck! 🚀

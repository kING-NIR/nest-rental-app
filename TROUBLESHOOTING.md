# Troubleshooting Guide

This guide helps resolve common issues when developing or deploying the Nest Rental application.

## Common Issues & Solutions

### 1. MongoDB Connection Failed

**Error**: `MongoDB connection failed: Error: querySrv ECONNREFUSED`

**Causes**:
- MongoDB is not running
- Connection string is incorrect
- Firewall is blocking the connection
- IP whitelist not configured (MongoDB Atlas)

**Solutions**:

```bash
# Check if local MongoDB is running
mongod --version

# Start MongoDB locally
mongod

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:7.0

# For MongoDB Atlas, verify:
# 1. Connection string is correct
# 2. IP whitelist includes your IP (192.168.x.x or 0.0.0.0/0)
# 3. Database user credentials are correct
# 4. Network access is enabled

# Test connection
mongo "mongodb+srv://user:pass@cluster.mongodb.net/nest-rental"
```

### 2. Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solutions**:

```bash
# Windows - Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001

# macOS/Linux
lsof -i :5000
kill -9 <PID>
```

### 3. JWT Token Expired

**Error**: `TokenExpiredError: jwt expired`

**Solutions**:

```bash
# Token expires in 7 days (configurable in .env)
JWT_EXPIRES_IN=7d

# To immediately clear token
# Frontend: localStorage.clear()
# Or manual logout

# Extend expiration time (development)
JWT_EXPIRES_IN=30d
```

### 4. CORS Error

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solutions**:

```bash
# Check CORS_ORIGIN in backend .env
CORS_ORIGIN=http://localhost:3000

# For production
CORS_ORIGIN=https://yourdomain.com

# Restart backend after changing
npm run dev
```

### 5. Environmental Variables Not Found

**Error**: `Missing required environment variables: X, Y, Z`

**Solutions**:

```bash
# 1. Create .env file from template
cp .env.example .env

# 2. Fill in all required variables
# 3. Restart application
npm run dev

# 4. Verify variables are loaded
node -e "console.log(process.env.MONGODB_URI)"
```

### 6. Node Modules Issue

**Error**: `Module not found` or dependency issues

**Solutions**:

```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or using npm ci (clean install)
npm ci

# Clear npm cache
npm cache clean --force
npm install
```

### 7. TypeScript Compilation Errors

**Error**: `TSError: ⨯ Unable to compile TypeScript`

**Solutions**:

```bash
# Check TypeScript version
npx tsc --version

# Compile without running
npx tsc --noEmit

# Check for type errors
npx tsc --listFiles

# Fix in tsconfig.json if needed
# Disable strict mode temporarily
"strict": false
```

### 8. Frontend Not Loading

**Error**: Blank page or infinite spinner

**Solutions**:

```bash
# 1. Check if backend is running
curl http://localhost:5000/health

# 2. Check browser console for errors
# Press F12 > Console tab

# 3. Check .env.example configuration
cat frontend/.env

# 4. Clear cache and reload
Ctrl+Shift+Delete (cache) then Ctrl+Shift+R (hard reload)

# 5. Check if React dev server is running
npm run dev
```

### 9. Docker Container Won't Start

**Error**: `Container exits with code 1` or `Error response from daemon`

**Solutions**:

```bash
# Check logs
docker logs <container-id>

# Rebuild container
docker-compose down
docker-compose build --no-cache
docker-compose up

# Check Docker resources
docker stats

# Ensure Docker is running
docker info
```

### 10. Email Service Not Working

**Error**: `Failed to send email` or `Error: connect ECONNREFUSED`

**Solutions**:

```bash
# For Gmail:
# 1. Enable 2-factor authentication
# 2. Create app-specific password
# 3. Use app password in EMAIL_PASSWORD

# For development (without email):
EMAIL_SERVICE=smtp
# Leave EMAIL_USER and EMAIL_PASSWORD empty

# Test connection
node -e "
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
transport.verify((err, success) => {
  console.log(err || success ? 'Connected' : 'Not connected');
});
"
```

## Performance Issues

### Slow API Requests

```bash
# Check database indexes
# Ensure indexes exist on frequently queried fields
# Run this in MongoDB:
db.properties.createIndex({ "ownerId": 1 })
db.properties.createIndex({ "city": 1 })
db.properties.createIndex({ "available": 1 })

# Monitor slow queries
# Enable profiling in MongoDB
db.setProfilingLevel(1)
db.system.profile.find().pretty()
```

### High Memory Usage

```bash
# Check Node process
node --max-old-space-size=2048 src/server.ts

# Monitor memory
process.memoryUsage()
```

### Slow Frontend Loading

```bash
# Analyze bundle size
npm run build
# Check public/build size

# Enable gzip compression
# Already in backend (via express.json())

# Optimize images
# Use smaller image sizes or compress
```

## Testing Issues

### Jest Tests Failing

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test
npm test -- --testNamePattern="test name"

# Reset Jest cache
npm test -- --clearCache

# Debug test
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Test Timeout

```bash
# Increase timeout in test
jest.setTimeout(10000);

// In test file
test('name', async () => {
  // test code
}, 10000); // 10 second timeout
```

## Deployment Issues

### Heroku Dyno Won't Start

```bash
# Check Procfile exists
cat Procfile

# View logs
heroku logs --tail

# Restart dyno
heroku restart

# Check config
heroku config
```

### Azure App Service 500 Error

```bash
# Check logs
az webapp log tail --resource-group rg --name app-name

# Verify environment variables
az webapp config appsettings list --resource-group rg --name app-name

# Restart app
az webapp restart --resource-group rg --name app-name
```

### AWS EC2 Connection Issues

```bash
# SSH into instance
ssh -i "key.pem" ec2-user@your-ec2-public-ip

# Check security group rules
aws ec2 describe-security-groups

# Check application logs
pm2 logs

# Restart application
pm2 restart all
```

## Database Issues

### Lost Connection to Database

```bash
# Check MongoDB status
systemctl status mongod

# Restart MongoDB
systemctl restart mongod

# Check connection string
echo $MONGODB_URI

# Test connection
mongo $MONGODB_URI
```

### Database Size Growing Too Large

```bash
# Check collection sizes
db.getCollectionStats("users").size

# Remove old records
db.logs.deleteMany({ createdAt: { $lt: new Date(Date.now() - 30*24*60*60*1000) } })

# Optimize database
db.runCommand( { compact: 'collection_name' } )
```

## Security Issues

### Suspicious Activity Detected

```bash
# Review logs
grep ERROR backend.log

# Check IP whitelist
# MongoDB Atlas > Network Access

# Reset JWT secret
JWT_SECRET=$(openssl rand -hex 32)

# Rotate API keys
# Update STRIPE_SECRET_KEY, etc.
```

### SSL/TLS Certificate Issues

```bash
# Check certificate validity
openssl s_client -connect yourdomain.com:443

# Heroku (automatic)
heroku certs:auto:enable

# Azure (automatic)
# App Service provides free SSL

# AWS
# Use AWS Certificate Manager
```

## Browser-Specific Issues

### Safari Not Working

```
Ensure:
- CORS headers are correct
- Date/time is accurate (JWT can fail with wrong time)
- Clear Safari cache: Preferences > Privacy > Manage Website Data
```

### Firefox Console Errors

```
Check:
- CSP (Content Security Policy) headers
- Mixed content (HTTP in HTTPS)
- localStorage permissions
```

### Chrome DevTools Tips

```
1. Open DevTools (F12)
2. Check Console for errors
3. Check Network tab for failed requests
4. Check Application tab for localStorage/cookies
5. Check Performance tab for slow rendering
```

## Getting Help

### Enable Debug Logging

```bash
# Backend
NODE_DEBUG=* npm run dev

# Frontend
REACT_APP_DEBUG=true npm run dev
```

### Collect Diagnostic Information

```bash
# System info
uname -a
node --version
npm --version
mongo --version

# Application logs
npm run dev 2>&1 | tee app.log

# Database info
mongosh
db.version()
db.stats()
```

### Contact Support

- GitHub Issues: github.com/username/nest-rental-app/issues
- Email: support@nest-rental.com
- Documentation: Check ARCHITECTURE.md

---

**Need More Help?**

1. Check the error message carefully - it usually indicates the root cause
2. Search GitHub Issues for similar problems
3. Review the ARCHITECTURE.md documentation
4. Enable debug logging to get more details
5. Check the deployment guides (DEPLOY_*.md) for platform-specific issues

Last Updated: May 23, 2024

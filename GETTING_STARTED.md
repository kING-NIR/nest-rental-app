# Getting Started with Nest Rental

## Quick Start (5 minutes)

### Using Docker (Recommended)

```bash
# Clone or navigate to project
cd nest-rental-app

# Start all services
docker-compose up -d

# Wait 30 seconds for MongoDB to initialize
sleep 30

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# MongoDB: mongodb://admin:admin@localhost:27017
```

### Manual Setup

#### Prerequisites
- Node.js v16+
- MongoDB running locally
- npm or yarn

#### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in new terminal)
cd frontend
npm install
```

#### Step 2: Configure Environment

Backend (.env):
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nest-rental
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

Frontend (.env):
```
REACT_APP_API_URL=http://localhost:5000/api
```

#### Step 3: Start Services

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start
```

## Demo Accounts

You can test with these accounts:

### Owner Account
- **Contact**: 9999999991
- **Password**: password123
- **Role**: Property Owner

### Tenant Account
- **Contact**: 9999999993
- **Password**: password123
- **Role**: Tenant

## Features to Explore

### Owner Features
1. **List Properties** - Add and manage rental properties
2. **Manage Requests** - Review viewing appointments and approve/decline
3. **Track Maintenance** - View and resolve tenant maintenance requests
4. **Monitor Payments** - Track rent payments from tenants
5. **Messaging** - Direct communication with tenants

### Tenant Features
1. **Browse Properties** - Search and filter available rentals
2. **Schedule Viewings** - Book property viewing appointments
3. **Report Issues** - Submit maintenance requests
4. **Pay Rent** - View and pay monthly rent
5. **Messaging** - Communicate with landlords

## API Testing with cURL

### Authentication
```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "contact": "john@demo.com",
    "password": "password123",
    "role": "owner"
  }'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "contact": "john@demo.com",
    "password": "password123"
  }'
```

### Get Properties
```bash
curl http://localhost:5000/api/properties
```

### Create Property (requires auth)
```bash
curl -X POST http://localhost:5000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Modern 2BHK",
    "description": "Luxurious apartment",
    "address": "123 Main St",
    "city": "Hyderabad",
    "type": "Apartment",
    "price": 42000,
    "bedrooms": 2,
    "bathrooms": 2,
    "area": 1200,
    "amenities": ["AC", "WiFi", "Parking"]
  }'
```

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Docker
docker run -d -p 27017:27017 mongo:7
```

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### CORS Error
Ensure `CORS_ORIGIN` in backend `.env` matches frontend URL

### Frontend Can't Connect to Backend
Check that:
1. Backend is running on port 5000
2. `REACT_APP_API_URL=http://localhost:5000/api` in frontend `.env`
3. Restart frontend after changing `.env`

## Development Tips

### Hot Reload
- **Frontend**: Automatically reloads on file changes
- **Backend**: Use `ts-node` for automatic reload (already configured)

### Database Inspection
```bash
# Connect to MongoDB
mongosh mongodb://admin:admin@localhost:27017/nest-rental --authenticationDatabase admin

# View collections
show collections

# Query properties
db.properties.find()

# Clear data (if needed)
db.users.deleteMany({})
db.properties.deleteMany({})
```

### API Testing
- Use Postman, Insomnia, or Thunder Client
- Import endpoints from API documentation
- Use Bearer token authentication

## Next Steps

1. **Customize Branding** - Update theme colors in `src/utils/theme.ts`
2. **Add Features** - Extend with real-time notifications, payments, etc.
3. **Deploy** - See README.md for deployment instructions
4. **Test** - Run `npm test` in backend and frontend directories

## Performance Optimization

### Frontend
- Code splitting enabled
- Image optimization ready
- CSS-in-JS with minimal bundles

### Backend
- Database indexes on frequently queried fields
- Pagination ready for large datasets
- Error handling and validation

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Set strong MongoDB credentials
- [ ] Use HTTPS in production
- [ ] Enable rate limiting
- [ ] Validate all user inputs
- [ ] Use environment variables for secrets
- [ ] Enable CORS restrictions in production

---

**Happy coding! 🚀**

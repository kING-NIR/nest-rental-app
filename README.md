# Nest Rental - Premium Property Management Platform

A production-ready, full-stack rental property management application with owner and tenant roles.

## Features

- 🏠 **Property Management** - List and manage properties with rich details
- 👥 **Dual Roles** - Separate interfaces for property owners and tenants
- 📅 **Appointments** - Schedule and manage property viewings
- 🔧 **Maintenance** - Report and track property issues
- 💰 **Payment Tracking** - Monitor rent payments and history
- 💬 **Messaging** - Direct communication between owners and tenants
- 🔐 **Authentication** - Secure JWT-based user authentication
- 🎨 **Premium UI** - Modern dark theme with luxurious design

## Tech Stack

### Frontend
- React 18 + TypeScript
- Lucide Icons
- Axios for API calls
- CSS-in-JS styling

### Backend
- Node.js + Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Input validation with express-validator

## Project Structure

```
nest-rental-app/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, error handling
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── utils/           # Database, helpers
│   │   └── server.ts        # Express app
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks (useAuth)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Formatters, theme
│   │   ├── App.tsx          # Main app component
│   │   └── index.tsx        # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
└── docker-compose.yml       # Docker orchestration

```

## Installation

### Prerequisites
- Node.js 16+
- MongoDB 5.0+
- npm or yarn

### Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev  # Development mode
# Production: npm run build && npm start
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm start  # Development mode on http://localhost:3000
# Production: npm run build
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/nest-rental
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Properties
- `GET /api/properties` - List all properties
- `GET /api/properties/my-properties` - User's properties
- `POST /api/properties` - Create property
- `PUT /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Operations
- `GET /api/operations/tasks` - Get tasks
- `POST /api/operations/tasks` - Create task
- `GET /api/operations/appointments` - Get appointments
- `POST /api/operations/appointments` - Create appointment
- `GET /api/operations/payments` - Get payments
- `GET /api/operations/messages` - Get messages
- `POST /api/operations/messages` - Send message

## Docker Setup

```bash
docker-compose up -d
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: mongodb://localhost:27017
```

## Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## Development Workflow

1. **Start Backend**: `cd backend && npm run dev`
2. **Start Frontend**: `cd frontend && npm start`
3. **Start MongoDB**: Use Docker or local installation
4. **Make changes** and they'll hot-reload

## Production Deployment

### Build
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### Deploy
- Use Docker containers
- Deploy backend to Cloud platforms (AWS, Azure, GCP)
- Deploy frontend to CDN (Vercel, Netlify, CloudFront)
- Use managed MongoDB (MongoDB Atlas)

## Security Best Practices

- ✅ Password hashing with bcryptjs
- ✅ JWT token-based authentication
- ✅ CORS enabled
- ✅ Input validation
- ✅ Error handling
- ✅ Database indexing for performance

## Future Enhancements

- [ ] Real-time notifications with Socket.io
- [ ] Advanced search and filters
- [ ] Document upload and management
- [ ] Payment integration (Stripe, Razorpay)
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Video walkthroughs of properties
- [ ] Lease agreement templates

## License

MIT License - feel free to use for commercial projects

## Support

For issues or questions, please create an issue in the repository.

---

**Built with ❤️ for property management excellence**

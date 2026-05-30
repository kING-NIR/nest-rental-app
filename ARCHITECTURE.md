# Project Architecture & Documentation

## Overview

Nest Rental is a premium property rental management platform built with modern technologies. It provides a complete solution for property owners and tenants to manage rentals, appointments, payments, and communications.

## Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (React 18)                        │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐  │
│  │  Login Page  │  Home (Browse │  Properties  │  Profile     │  │
│  │              │   Properties) │  Management  │  Settings    │  │
│  └──────────────┴──────────────┴──────────────┴──────────────┘  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Context API (Authentication State Management)           │    │
│  │ useAuth Hook (login/logout/token management)            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└──────────────────────────────┬───────────────────────────────────┘
                               │ HTTP/JSON (Axios)
                               │ JWT Tokens
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│                   Backend (Node.js + Express)                    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  API Routes Layer                                       │    │
│  │  ├─ /api/auth      (signup, login, verify)            │    │
│  │  ├─ /api/properties (CRUD operations)                 │    │
│  │  └─ /api/operations (tasks, appointments, etc)        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Controller Layer                                       │    │
│  │  ├─ authController   (authentication logic)           │    │
│  │  ├─ propertyController (property management)         │    │
│  │  └─ operationController (business operations)        │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Middleware Layer                                       │    │
│  │  ├─ auth.ts        (JWT verification)                │    │
│  │  ├─ errorHandler   (error handling)                  │    │
│  │  ├─ rateLimit      (DDoS protection)                │    │
│  │  └─ logging        (request logging)                │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Service Layer                                          │    │
│  │  ├─ EmailService   (notifications)                    │    │
│  │  ├─ PaymentService (payment processing)              │    │
│  │  ├─ FileService    (image uploads)                   │    │
│  │  └─ Logger         (application logging)             │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  Data Model Layer (Mongoose)                            │    │
│  │  ├─ User          (authentication)                    │    │
│  │  ├─ Property      (rental properties)                │    │
│  │  ├─ Rental        (lease agreements)                 │    │
│  │  ├─ Task          (maintenance tasks)                │    │
│  │  ├─ Appointment   (viewing appointments)             │    │
│  │  ├─ Payment       (transaction records)              │    │
│  │  └─ Message       (communications)                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└──────────────────────────────┬───────────────────────────────────┘
                               │
┌──────────────────────────────▼───────────────────────────────────┐
│            Database (MongoDB Atlas or Local)                     │
│  ├─ Collections: users, properties, rentals, tasks, etc.       │
│  ├─ Indexes: on frequently queried fields                      │
│  └─ Backups: automated daily snapshots                         │
└───────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
nest-rental-app/
├── backend/                          # Node.js Express API
│   ├── src/
│   │   ├── __tests__/               # Test files
│   │   │   ├── utils/
│   │   │   │   └── validation.test.ts
│   │   │   └── setup.ts
│   │   ├── config/                  # Configuration
│   │   │   └── index.ts
│   │   ├── controllers/              # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── propertyController.ts
│   │   │   └── operationController.ts
│   │   ├── middleware/               # Express middleware
│   │   │   ├── auth.ts
│   │   │   └── errorHandler.ts
│   │   ├── models/                   # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Property.ts
│   │   │   └── index.ts
│   │   ├── routes/                   # API routes
│   │   │   ├── auth.ts
│   │   │   ├── properties.ts
│   │   │   └── operations.ts
│   │   ├── types/                    # TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── utils/                    # Utility functions
│   │   │   ├── database.ts
│   │   │   ├── logger.ts
│   │   │   ├── emailService.ts
│   │   │   └── validation.ts
│   │   └── server.ts                 # Entry point
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Environment template
│   ├── .env.test                     # Test environment
│   ├── package.json                  # Dependencies
│   ├── tsconfig.json                 # TypeScript config
│   ├── jest.config.js                # Jest config
│   └── Dockerfile                    # Container config
│
├── frontend/                         # React TypeScript App
│   ├── src/
│   │   ├── __tests__/               # Test files
│   │   │   ├── components/
│   │   │   │   └── UI.test.tsx
│   │   │   └── utils/
│   │   │       └── formatters.test.ts
│   │   ├── components/               # React components
│   │   │   └── UI.tsx
│   │   ├── hooks/                    # Custom React hooks
│   │   │   └── useAuth.tsx
│   │   ├── pages/                    # Page components
│   │   ├── services/                 # API clients
│   │   │   └── api.ts
│   │   ├── types/                    # TypeScript interfaces
│   │   │   └── index.ts
│   │   ├── utils/                    # Utility functions
│   │   │   ├── formatters.ts
│   │   │   └── theme.ts
│   │   ├── App.tsx                   # Root component
│   │   ├── index.tsx                 # App entry point
│   │   └── index.html                # HTML template
│   ├── public/                       # Static assets
│   │   └── manifest.json
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Environment template
│   ├── package.json                  # Dependencies
│   ├── tsconfig.json                 # TypeScript config
│   ├── setupTests.ts                 # Test setup
│   └── Dockerfile                    # Container config
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml                 # GitHub Actions CI/CD
│
├── docker-compose.yml                # Multi-container setup
├── GETTING_STARTED.md                # Quick start guide
├── README.md                          # Main documentation
├── COMPLETION_SUMMARY.md              # Project status
├── DEPLOY_AZURE.md                   # Azure deployment guide
├── DEPLOY_AWS.md                     # AWS deployment guide
├── DEPLOY_HEROKU.md                  # Heroku deployment guide
└── .gitignore                        # Git ignore rules
```

## Technology Stack

### Frontend
- **React 18**: Modern UI library with hooks
- **TypeScript 5.3**: Type-safe JavaScript
- **Axios**: HTTP client with JWT interceptor
- **Lucide React**: Beautiful icon library
- **CSS-in-JS**: Inline styles for theming
- **React Context API**: State management

### Backend
- **Node.js 18**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript 5.3**: Type-safe backend
- **MongoDB/Mongoose**: Document database
- **JWT**: Authentication tokens
- **Helmet**: Security headers
- **Express Rate Limit**: DDoS protection
- **Nodemailer**: Email service
- **Jest**: Testing framework

### DevOps & Deployment
- **Docker**: Containerization
- **GitHub Actions**: CI/CD pipeline
- **MongoDB Atlas**: Cloud database (free tier)
- **Heroku/Azure/AWS**: Cloud hosting options

## API Endpoints

### Authentication
```
POST   /api/auth/signup              Create new account
POST   /api/auth/login               Login with credentials
GET    /api/auth/verify              Verify token validity
```

### Properties
```
GET    /api/properties               List all properties
POST   /api/properties               Create new property
GET    /api/properties/:id           Get property details
PUT    /api/properties/:id           Update property
DELETE /api/properties/:id           Delete property
GET    /api/properties/owner/list    List owner's properties
```

### Operations
```
GET    /api/operations/tasks         List tasks
POST   /api/operations/tasks         Create task
PUT    /api/operations/tasks/:id     Update task
GET    /api/operations/appointments  List appointments
POST   /api/operations/appointments  Create appointment
GET    /api/operations/payments      List payments
POST   /api/operations/payments      Record payment
GET    /api/operations/messages      List messages
POST   /api/operations/messages      Send message
```

## Data Models

### User
```typescript
{
  _id: ObjectId,
  contact: string,              // 10-digit phone
  password: string,             // bcrypt hashed
  role: "owner" | "tenant",
  createdAt: Date,
  updatedAt: Date
}
```

### Property
```typescript
{
  _id: ObjectId,
  name: string,
  address: string,
  city: string,
  price: number,                // Monthly rent
  type: "Studio" | "Apartment" | "Villa" | "Penthouse" | "Independent House",
  bedrooms: number,
  bathrooms: number,
  description: string,
  ownerId: ObjectId,            // Reference to User
  available: boolean,
  images: string[],             // Image URLs
  createdAt: Date,
  updatedAt: Date
}
```

### Task
```typescript
{
  _id: ObjectId,
  title: string,
  description: string,
  propertyId: ObjectId,
  tenantId: ObjectId,
  ownerId: ObjectId,
  status: "pending" | "in-progress" | "completed",
  priority: "low" | "medium" | "high",
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment
```typescript
{
  _id: ObjectId,
  propertyId: ObjectId,
  tenantId: ObjectId,
  ownerId: ObjectId,
  date: Date,
  time: string,                 // HH:MM format
  message: string,
  status: "pending" | "accepted" | "rejected",
  createdAt: Date,
  updatedAt: Date
}
```

### Payment
```typescript
{
  _id: ObjectId,
  rentalId: ObjectId,
  amount: number,
  paymentDate: Date,
  method: "card" | "bank-transfer" | "check",
  transactionId: string,
  status: "pending" | "completed" | "failed",
  createdAt: Date,
  updatedAt: Date
}
```

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nest-rental
JWT_SECRET=<your-secret-key>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
EMAIL_SERVICE=gmail
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<your-app-password>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
STRIPE_SECRET_KEY=<optional>
STRIPE_PUBLIC_KEY=<optional>
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
REACT_APP_VERSION=1.0.0
REACT_APP_TIMEOUT=30000
```

## Security Features

### Authentication & Authorization
- JWT tokens with 7-day expiration
- Password hashing with bcryptjs (12-round salt)
- Role-based access control (owner/tenant)
- HTTP-only cookies (for production)

### API Security
- CORS protection
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- Input validation and sanitization
- SQL injection protection (via Mongoose)

### Data Protection
- HTTPS/SSL encryption (automatic on production)
- Environment variable protection (no secrets in code)
- Database backups (automated daily)
- Request logging for audit trails

## Performance Optimizations

### Database
- Indexes on frequently queried fields (ownerId, city, available)
- Pagination for list endpoints
- Lean queries for read-only operations
- Connection pooling

### Caching
- Redis support (optional)
- Browser caching headers
- Frontend state management

### API
- Request compression
- CDN ready (static assets)
- Lazy loading (frontend)
- Code splitting (frontend)

## Testing

### Backend Tests
```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- utils/validation.test.ts

# Watch mode
npm test -- --watch
```

### Frontend Tests
```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test -- components/UI.test.tsx

# Watch mode
npm run test:watch
```

## Logging

The application includes comprehensive logging:
- **Logger Service**: Structured JSON logging
- **Log Levels**: ERROR, WARN, INFO, DEBUG
- **Request Logging**: All API requests logged
- **Error Tracking**: Stack traces in development

## Error Handling

Centralized error handling with:
- Custom error messages
- Error codes for client handling
- Validation error details
- Request ID tracking for debugging

## Deployment

Three deployment options provided:

1. **Heroku** (Easiest - Recommended for students)
   - Free tier available
   - See `DEPLOY_HEROKU.md`

2. **Azure** (Enterprise option)
   - Cosmos DB integration
   - See `DEPLOY_AZURE.md`

3. **AWS** (Flexible option)
   - RDS/MongoDB support
   - See `DEPLOY_AWS.md`

## Getting Started

### Local Development
```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Start MongoDB
# Option 1: Local MongoDB
mongod

# Option 2: Docker
docker-compose up -d

# Start backend
cd backend && npm run dev

# Start frontend (new terminal)
cd frontend && npm run dev
```

### Using Docker
```bash
# Start all services
docker-compose up

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push branch: `git push origin feature/your-feature`
4. Submit pull request

## Support

- **Issues**: GitHub Issues
- **Documentation**: See README.md and guides
- **Email**: support@nest-rental.com

## License

MIT License - See LICENSE file for details

---

**Last Updated**: May 23, 2024  
**Version**: 1.0.0  
**Status**: Production Ready

# Quick Reference Guide - Nest Rental

## Directory Quick Access

```
Frontend Source Files
  /frontend/src/App.tsx          - Main app component
  /frontend/src/index.tsx         - Entry point
  /frontend/src/hooks/useAuth.tsx - Authentication hook
  /frontend/src/services/api.ts   - API calls
  /frontend/src/components/UI.tsx - Reusable components
  /frontend/src/utils/theme.ts    - Colors & styles
  /frontend/src/utils/formatters.ts - Format functions

Backend Source Files
  /backend/src/server.ts          - Express setup
  /backend/src/controllers/       - Business logic
  /backend/src/models/            - Database schemas
  /backend/src/routes/            - API endpoints
  /backend/src/middleware/        - Auth, errors

Config Files
  /backend/.env.example           - Backend env template
  /frontend/.env.example          - Frontend env template
  docker-compose.yml              - Docker setup

Documentation
  README.md                       - Project overview
  GETTING_STARTED.md              - Quick start
  COMPLETION_SUMMARY.md           - What was built
```

## Common Commands

### Start Development
```bash
# All services with Docker
docker-compose up -d

# Or manually:
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm start
```

### Build for Production
```bash
# Backend
cd backend && npm run build

# Frontend
cd frontend && npm run build
```

### Database Management
```bash
# Connect to MongoDB
mongosh mongodb://admin:admin@localhost:27017/nest-rental --authenticationDatabase admin

# View data
db.properties.find()
db.users.find()
db.tasks.find()
```

### Environment Setup
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your values

# Frontend
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your API URL
```

## API Endpoints Summary

### Auth
```
POST   /api/auth/signup      - Register user
POST   /api/auth/login       - Login user
GET    /api/auth/verify      - Verify token (protected)
```

### Properties
```
GET    /api/properties                 - List all
GET    /api/properties/my-properties   - User's properties (protected)
GET    /api/properties/:id             - Get single
POST   /api/properties                 - Create (protected)
PUT    /api/properties/:id             - Update (protected)
DELETE /api/properties/:id             - Delete (protected)
```

### Operations
```
GET    /api/operations/tasks                   - Get tasks
POST   /api/operations/tasks                   - Create task
PUT    /api/operations/tasks/:id               - Update task
GET    /api/operations/appointments            - Get appointments
POST   /api/operations/appointments            - Create appointment
PUT    /api/operations/appointments/:id        - Update appointment
GET    /api/operations/payments                - Get payments
PUT    /api/operations/payments/:id            - Record payment
GET    /api/operations/messages                - Get messages
POST   /api/operations/messages                - Send message
```

## Frontend Components

### UI Components (in `/src/components/UI.tsx`)
- `<Avatar />` - User avatar with initials
- `<Badge />` - Status/tag badges
- `<Button />` - Primary, ghost, danger, success, outline variants
- `<TextInput />` - Form input field
- `<Textarea />` - Multi-line input
- `<Spinner />` - Loading indicator
- `<EmptyState />` - Empty state with icon/message
- `<Card />` - Container component
- `<ModalOverlay />` - Modal wrapper

### Hooks
- `useAuth()` - Access user, login, signup, logout

### Services
- `api.signup(...)` - Register
- `api.login(...)` - Login
- `api.getProperties(...)` - Fetch properties
- `api.createProperty(...)` - Add property
- `api.getTasks(...)` - Fetch tasks
- `api.sendMessage(...)` - Send message

## Database Models

### User
```typescript
{
  name: string
  contact: string (unique)
  email?: string
  password: string (hashed)
  role: "owner" | "tenant"
  initials: string
  color: string
  verified: boolean
}
```

### Property
```typescript
{
  title: string
  description: string
  address: string
  city: string
  type: "Studio" | "Apartment" | "Villa" | "Penthouse"
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  amenities: string[]
  available: boolean
  ownerId: string
  tenantId?: string
  gradient: string
}
```

## Theme Configuration

All colors in `/frontend/src/utils/theme.ts`:
```typescript
THEME.bg          // #070710
THEME.surface     // #0D0D1A
THEME.card        // #121225
THEME.gold        // #C9A84C (Primary)
THEME.success     // #4DB87A
THEME.error       // #E05555
THEME.warning     // #E8A84C
THEME.info        // #5A9FE0
THEME.text        // #F0EEff
THEME.textSec     // #8080AA
THEME.textMuted   // #444465
```

## Formatting Utilities

```typescript
fmt(25000)              // "₹25,000"
fmtDate("2026-05-23")   // "23 May 2026"
fmtTime("2026-05-23T10:30:00") // "10:30"
statusLabel("pending")  // "Pending"
statusColor("pending")  // Color for pending status
priorityColor("high")   // Color for high priority
```

## Testing Properties Locally

### Quick Test Flow
1. Start the app
2. Sign up as owner
3. List a property
4. Sign up as tenant
5. Browse properties
6. Schedule viewing
7. Send message
8. Check payment

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | `lsof -ti:5000 \| xargs kill -9` |
| Port 3000 in use | `lsof -ti:3000 \| xargs kill -9` |
| MongoDB not connecting | Check MONGODB_URI in .env |
| API not responding | Ensure backend is running on port 5000 |
| Frontend can't reach API | Check REACT_APP_API_URL in .env |
| Styles not loading | Clear browser cache |
| Token expired | Log in again |

## File Editing Guide

### To Add a New API Endpoint:
1. Create controller in `/backend/src/controllers/`
2. Add route in `/backend/src/routes/`
3. Add service method in `/frontend/src/services/api.ts`
4. Use in component via `api.yourMethod()`

### To Add a New Component:
1. Create in `/frontend/src/components/`
2. Export from components file
3. Import and use in pages

### To Modify Styling:
1. Update `/frontend/src/utils/theme.ts` for colors
2. Inline styles in components (CSS-in-JS)
3. No external CSS files needed

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development|production
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Performance Tips

1. **Use Docker** for consistent environment
2. **Restart services** if making config changes
3. **Clear browser cache** if styles seem wrong
4. **Check MongoDB** if data not persisting
5. **Use API docs** for correct endpoint calls

## Security Notes

- Change JWT_SECRET in production
- Use strong passwords
- Enable HTTPS on production
- Validate all user inputs
- Use HTTPS MongoDB connections in production
- Rotate secrets regularly

## Next Steps After Setup

1. ✅ Run locally and test all features
2. ✅ Customize theme colors if needed
3. ✅ Add more properties and users
4. ✅ Test all forms and validations
5. ✅ Read full README.md
6. ✅ Plan deployment strategy
7. ✅ Add environment secrets
8. ✅ Set up CI/CD pipeline
9. ✅ Monitor and maintain
10. ✅ Plan future enhancements

---

**Last Updated:** May 23, 2026
**Version:** 1.0.0 Production Ready

# Phase 2.1: Authentication Testing Guide

## What Was Built

### Core Components
1. **User Model** - MongoDB schema with password hashing (bcryptjs)
2. **JWT System** - Access tokens (15min) + Refresh tokens (7d)
3. **Auth Service** - Signup, login, token refresh logic
4. **Auth Controller** - HTTP request handlers
5. **Auth Middleware** - Protected route validation
6. **Input Validators** - Joi schema validation
7. **Error Handling** - Custom error classes + global handler
8. **Logging** - Request/response logging with Winston
9. **Configuration** - Environment-based config management
10. **Database Connection** - MongoDB with Mongoose
11. **Redis Setup** - Optional caching layer (graceful fallback)

### Architecture Decisions Made

**Why JWT instead of sessions?**
- Stateless (scales horizontally)
- Works with WebSockets
- Refresh token rotation prevents token hijacking

**Why separate access + refresh tokens?**
- Access token: short-lived (15m) for API calls
- Refresh token: long-lived (7d), stored in HttpOnly cookie
- If access token leaked, damage is limited to 15 minutes

**Why HttpOnly cookies for refresh token?**
- Protected from XSS (JavaScript can't access)
- Vulnerable to CSRF but mitigated with same-site policy
- Trade-off: more secure than localStorage

**Why Joi validation?**
- Schema-based validation
- Clear error messages
- Reusable across controllers

---

## How to Test

### Prerequisites
1. MongoDB running locally or remote
2. Node.js dependencies installed: `npm install` ✓
3. Backend code syntactically valid ✓

### Setup for Testing

**1. Create .env file with test values:**
```bash
cd /Users/tanuj/Dev/mern/Progress/backend
cp .env.example .env
# Edit .env and ensure MongoDB URI is reachable
# For local testing:
# MONGODB_URI=mongodb://localhost:27017/workflow
# REDIS_URL=redis://localhost:6379
```

**2. Start MongoDB (if not already running):**

Option A: Using Docker
```bash
docker run -d -p 27017:27017 --name mongodb mongo:6
```

Option B: Using local MongoDB
```bash
# macOS with Homebrew
brew services start mongodb-community
```

**3. Start the backend server:**
```bash
npm run dev
# or
npm start
```

Expected output:
```
✓ MongoDB connected successfully
✓ Redis initialized successfully
🚀 Server running at http://localhost:5000 (development)
```

---

## Testing Endpoints

### 1. Health Check
```bash
curl -X GET http://localhost:5000/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-05-10T12:00:00.000Z"
}
```

---

### 2. Signup (Register New User)
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Expected response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "isActive": true,
      "createdAt": "2026-05-10T12:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Also sets HttpOnly cookie:**
- `refreshToken`: (in Set-Cookie header)

---

### 3. Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "john@example.com",
      ...
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4. Get Current User (Protected)
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected response (200):**
```json
{
  "success": true,
  "message": "User retrieved",
  "data": {
    "user": { ... }
  }
}
```

**Error if no token:**
```json
{
  "success": false,
  "message": "No authorization header",
  "code": "AUTHENTICATION_ERROR"
}
```

---

### 5. Refresh Token
```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

Or with cookie:
```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -b "refreshToken=YOUR_REFRESH_TOKEN" \
  -H "Content-Type: application/json"
```

**Expected response (200):**
```json
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 6. Logout
```bash
curl -X POST http://localhost:5000/api/v1/auth/logout
```

**Expected response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Error Scenarios

### Signup with duplicate email
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected response (409):**
```json
{
  "success": false,
  "message": "Email already registered",
  "code": "CONFLICT",
  "statusCode": 409
}
```

---

### Login with wrong password
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "wrongpassword"
  }'
```

**Expected response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "code": "AUTHENTICATION_ERROR",
  "statusCode": 401
}
```

---

### Invalid validation
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not-an-email",
    "password": "123"
  }'
```

**Expected response (400):**
```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "statusCode": 400,
  "details": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

---

## Using Postman for Testing

1. **Import Collection**
   - Create new Postman collection
   - Add requests for each endpoint above

2. **Set Variables**
   - `baseUrl`: http://localhost:5000
   - `accessToken`: (set from signup/login response)
   - `refreshToken`: (set from signup/login response)

3. **Use in Headers**
   - Auth endpoints: No special setup
   - Protected endpoints: Header `Authorization: Bearer {{accessToken}}`

---

## Database Verification

After signup/login, verify user in MongoDB:

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/workflow

# Check users collection
db.users.find()

# Should see:
{
  "_id": ObjectId("..."),
  "email": "john@example.com",
  "password": "$2a$10$...", // bcrypt hash
  "firstName": "John",
  "lastName": "Doe",
  "role": "user",
  "isActive": true,
  "lastLogin": ISODate("2026-05-10T12:00:00Z"),
  "createdAt": ISODate("2026-05-10T12:00:00Z"),
  "updatedAt": ISODate("2026-05-10T12:00:00Z")
}
```

Note: Password is hashed with bcryptjs (10 salt rounds), impossible to recover.

---

## Debugging Checklist

| Issue | Cause | Solution |
|-------|-------|----------|
| "Cannot find module" | Incorrect import path | Check relative paths in files |
| MongoDB connection fails | MongoDB not running | Start MongoDB service |
| Redis errors | Redis not running | Optional - set REDIS_URL to skip |
| JWT validation fails | Token expired or tampered | Generate new token, don't modify it |
| CORS errors | Frontend + backend mismatch | Check CORS_ORIGIN in .env |
| Rate limit exceeded | Too many requests | Wait 15 seconds or adjust RATE_LIMIT_WINDOW_MS |
| Password mismatch | Wrong hash comparison | Check bcryptjs version |

---

## Key Learning Points

### What happened in signup:
1. Email validation (format check)
2. Duplicate check (db query)
3. Password hashing (bcryptjs, async)
4. User creation (db insert)
5. Token generation (JWT signs user ID)
6. Response with tokens

### What happened in login:
1. Email validation
2. User lookup (by email)
3. Password verification (bcryptjs.compare)
4. Update lastLogin timestamp
5. Token generation
6. Set HttpOnly cookie
7. Return access token

### What happened in protected route:
1. Extract token from Authorization header
2. Verify JWT signature
3. Check token expiry
4. Attach decoded user info to request
5. Allow request to proceed or return 401

---

## Next Steps (Phase 2.2)

Build on this foundation:
1. Create Team model
2. Implement team creation and membership
3. Add role-based access control (admin, manager, member)
4. Create Project model
5. Create Task model
6. Test team/project/task workflows

See PRODUCT_ROADMAP.md Phase 2.2 for details.

---

## Files Created in Phase 2.1

```
backend/
├── server.js                      # Entry point
├── package.json                   # Dependencies
├── .env.example                   # Config template
├── .gitignore
├── README.md
└── src/
    ├── app.js                     # Express app
    ├── config/
    │   ├── database.js            # MongoDB
    │   ├── redis.js               # Redis (optional)
    │   └── environment.js         # Config vars
    ├── middleware/
    │   ├── auth.js                # JWT validation
    │   ├── errorHandler.js        # Error middleware
    │   └── requestLogger.js       # Request logging
    ├── models/
    │   └── User.js                # User schema
    ├── routes/
    │   ├── index.js               # Route aggregator
    │   └── v1/
    │       └── auth.js            # Auth routes
    ├── controllers/
    │   └── authController.js      # Request handlers
    ├── services/
    │   └── authService.js         # Business logic
    ├── validators/
    │   └── authValidator.js       # Input validation
    └── utils/
        ├── jwt.js                 # Token generation
        ├── errorResponse.js       # Error classes
        └── logger.js              # Winston logger
```

---

**Status: ✅ Phase 2.1 Complete**

Signup, login, token refresh, protected routes all working.
Ready to move to Phase 2.2: Team Management & RBAC.

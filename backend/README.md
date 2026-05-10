# WorkFlow Backend

Production-grade MERN backend for team collaboration platform.

## Setup

### Prerequisites

- Node.js 18+
- MongoDB local or remote instance
- Redis (optional, for caching)

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Create .env file**

```bash
cp .env.example .env
```

3. **Update .env with your configuration**

```
MONGODB_URI=mongodb://localhost:27017/workflow
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_super_secret_key
```

4. **Start the server**

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files (DB, Redis, env)
│   ├── middleware/      # Express middleware (auth, logging, errors)
│   ├── models/          # MongoDB models (User, Team, Project, Task)
│   ├── routes/          # API route definitions
│   │   └── v1/         # API v1 endpoints
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── validators/      # Input validation (Joi)
│   ├── utils/           # Utilities (JWT, errors, logger)
│   └── app.js          # Express app setup
├── server.js            # Server entry point
├── package.json
└── .env.example
```

## Architecture

### Authentication Flow

1. **Signup** → Hash password → Create user → Generate tokens
2. **Login** → Verify password → Generate tokens → Return access + refresh
3. **Protected Routes** → Verify access token → Attach user to request
4. **Token Refresh** → Verify refresh token → Generate new access token

### Token Storage

- **Access Token**: Short-lived (15m), sent in Authorization header
- **Refresh Token**: Long-lived (7d), stored in HttpOnly cookie

### Error Handling

- Global error handler middleware
- Custom error classes (ValidationError, AuthenticationError, etc)
- Detailed error responses with status codes

## API Endpoints

### Authentication

- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Authenticate user
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout user
- `GET /api/v1/auth/me` - Get current user (protected)

### Coming Soon

- Team management
- Project management
- Task management
- Activity logging
- File uploads

## Development

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Database

**MongoDB Indexes:**

- `users`: index on `email`

More indices will be added as we scale.

## Scaling Considerations

### Phase 1 (Current)

- Single Node instance
- Single MongoDB instance
- Redis for sessions

### Phase 2 (When needed)

- Horizontal scaling with load balancer
- MongoDB replica set
- Redis cluster for caching

### Phase 3 (At scale)

- Microservices architecture
- Database sharding
- Event streaming

## Security

- ✓ Password hashing with bcryptjs (10 salt rounds)
- ✓ JWT token validation on protected routes
- ✓ CORS configured
- ✓ Rate limiting on auth endpoints
- ✓ Input validation with Joi
- ✓ Error messages don't leak sensitive info
- ✓ HttpOnly cookies for refresh tokens
- Todo: HTTPS in production
- Todo: API key for service-to-service auth

## Monitoring

- Request logging with Winston
- Error tracking
- Performance metrics (latency, error rate)

## Troubleshooting

### MongoDB Connection Fails

- Check MONGODB_URI is correct
- Ensure MongoDB service is running
- Check firewall if using remote instance

### Redis Connection Fails

- Redis is optional, app will work without it
- Check REDIS_URL is correct
- Sessions will be in-memory (not shared across instances)

### JWT Errors

- Ensure JWT_SECRET is set
- Check token expiry
- Verify token format in Authorization header

## Next Phases

See [PRODUCT_ROADMAP.md](../PRODUCT_ROADMAP.md) for detailed roadmap.

## License

MIT

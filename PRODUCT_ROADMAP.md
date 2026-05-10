# MERN Production Roadmap: Team Collaboration & Project Management

## Executive Summary

This is a **real product for real teams**. Not a todo app. Not a tutorial project.

We're building **WorkFlow** — a team project management platform that:

- Scales from 3-5 initial users to 1000+ users
- Teaches production MERN architecture through implementation
- Forces you to learn DevOps, database design, caching, real-time systems, and scaling
- Results in a portfolio project that stands out in interviews

**Why this product?**

- Multi-user system (forces authentication, authorization, RBAC)
- Real-time features (WebSockets, Redis)
- Complex state (projects, teams, tasks, activity feeds)
- Natural scaling challenges (indexing, caching, load balancing)
- Portfolio-worthy (shows you understand system design)

---

## PART 1: PRODUCT DESIGN & ARCHITECTURE

### 1.1 Product Idea Options

#### Option A: **WorkFlow** (RECOMMENDED)

Team project management with real-time collaboration, analytics, and audit logs.

**Why learn with this:**

- Forces RBAC (admin, manager, member)
- Requires WebSockets (live task updates, notifications)
- Natural pagination, search, filtering (scaling)
- Teaches caching strategies
- Background jobs (notifications, reports)
- Audit logs (security, compliance)

**Real-world use case:** Small teams replacing Jira for agile sprints.

---

#### Option B: Live Collaboration Docs

Google Docs-like editor for team docs.

**Why avoid (for your first):**

- Requires operational transformation (complex)
- Harder to scale incrementally
- Too much focus on frontend complexity

---

#### Option C: SaaS Analytics Dashboard

Track metrics for multiple clients, real-time dashboards.

**Why avoid:**

- Less teaching of MERN fundamentals
- More data visualization focus

---

**Decision: BUILD WORKFLOW**

---

### 1.2 Problem Statement

**Current State:**

- Teams waste time in meetings confirming project status
- No single source of truth for task ownership
- No audit trail for what changed and when
- Can't see team velocity trends
- Notifications go to email (slow, loses urgency)
- Permission management is manual

**WorkFlow solves:**

- Real-time project dashboards (everyone sees updates instantly)
- Clear task ownership and status
- Complete audit trail (who changed what, when)
- Team analytics (velocity, burndown, productivity)
- In-app notifications (instant, actionable)
- Role-based access (admin, manager, member, viewer)

**Market fit:**

- 10-100 person companies (sweet spot)
- Scaleup teams that outgrew basic tools
- Companies needing audit trails (compliance)

---

### 1.3 User Personas

**1. Alex (Team Lead)**

- Manages 5-15 engineers
- Needs team velocity metrics, task completion rate
- Wants to see who's blocked and why
- Cares about burndown charts

**2. Priya (Individual Contributor)**

- Works on assigned tasks
- Wants notifications when task changes
- Cares about personal productivity stats
- Uses mobile for quick status checks

**3. Marcus (Engineering Manager)**

- Oversees multiple teams (50+ engineers)
- Needs cross-team analytics
- Audits task completion
- Manages resource allocation

**4. Sam (Admin)**

- Creates teams, invites users
- Sets up projects and sprints
- Manages user roles and permissions
- Views audit logs for compliance

---

### 1.4 Core Features (MVP + V2)

#### Phase 1 MVP Features

- User authentication (signup, login, JWT)
- Teams (create, invite members)
- Projects (per team)
- Tasks (create, assign, status updates)
- Real-time task updates (WebSockets)
- Basic role-based access (admin, member, viewer)
- Activity feed (who did what)
- Search tasks

#### Phase 2 Features (After V1 stable)

- Team analytics (velocity, burndown)
- Advanced permissions (custom roles)
- Notifications (in-app + email)
- File attachments on tasks
- Comments on tasks
- Task templates
- Sprint management
- Admin dashboard
- Audit logs

---

### 1.5 Database Design (MongoDB Schema)

```
Collections:
1. users
2. teams
3. projects
4. tasks
5. activity_logs
6. notifications
7. roles
8. audit_logs
9. sprint_data
10. attachments

Key Design Decisions:
- Denormalize common queries (tasks include projectId, teamId, ownerId names)
- Use indexes on frequently queried fields (teamId, status, assignedTo)
- Store activity as immutable documents (audit trail)
- Use TTL index on notifications (auto-expire after 30 days)
```

**Schema Details (will show during Phase 2)**

---

### 1.6 API Structure

**RESTful API (v1)**

```
Authentication:
  POST   /api/v1/auth/signup
  POST   /api/v1/auth/login
  POST   /api/v1/auth/refresh
  POST   /api/v1/auth/logout

Teams:
  GET    /api/v1/teams                    (list user's teams)
  POST   /api/v1/teams                    (create team)
  GET    /api/v1/teams/:id                (get team details)
  PUT    /api/v1/teams/:id                (update)
  DELETE /api/v1/teams/:id                (delete)
  POST   /api/v1/teams/:id/members        (invite)
  DELETE /api/v1/teams/:id/members/:uid   (remove)

Projects:
  GET    /api/v1/teams/:id/projects
  POST   /api/v1/teams/:id/projects
  GET    /api/v1/projects/:id
  PUT    /api/v1/projects/:id
  DELETE /api/v1/projects/:id

Tasks:
  GET    /api/v1/projects/:id/tasks       (with filters, pagination)
  POST   /api/v1/projects/:id/tasks       (create)
  GET    /api/v1/tasks/:id                (single task)
  PUT    /api/v1/tasks/:id                (update status, assignee)
  DELETE /api/v1/tasks/:id
  POST   /api/v1/tasks/:id/comments
  GET    /api/v1/tasks/:id/comments

Activity:
  GET    /api/v1/teams/:id/activity       (team activity feed)
  GET    /api/v1/projects/:id/activity

Users:
  GET    /api/v1/users/me                 (current user)
  GET    /api/v1/users/:id
  PUT    /api/v1/users/me                 (update profile)

Admin:
  GET    /api/v1/admin/audit-logs
  GET    /api/v1/admin/users
  PUT    /api/v1/admin/users/:id/role
```

**WebSocket Events (Real-time)**

```
Client → Server:
  join:project        { projectId }
  leave:project       { projectId }
  update:task         { taskId, updates }
  create:task         { task data }

Server → Client:
  task:created        { task object }
  task:updated        { taskId, updates, changedBy, timestamp }
  task:deleted        { taskId }
  user:online         { userId, projectId }
  user:offline        { userId }
```

---

### 1.7 Folder Architecture

```
workflow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js
│   │   │   ├── redis.js
│   │   │   ├── environment.js
│   │   │   └── constants.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── rateLimiter.js
│   │   │   ├── errorHandler.js
│   │   │   └── requestLogger.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Team.js
│   │   │   ├── Project.js
│   │   │   ├── Task.js
│   │   │   ├── ActivityLog.js
│   │   │   ├── Notification.js
│   │   │   └── AuditLog.js
│   │   ├── routes/
│   │   │   ├── v1/
│   │   │   │   ├── auth.js
│   │   │   │   ├── teams.js
│   │   │   │   ├── projects.js
│   │   │   │   ├── tasks.js
│   │   │   │   ├── activity.js
│   │   │   │   └── admin.js
│   │   │   └── index.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── teamController.js
│   │   │   ├── projectController.js
│   │   │   ├── taskController.js
│   │   │   └── adminController.js
│   │   ├── services/
│   │   │   ├── authService.js
│   │   │   ├── teamService.js
│   │   │   ├── projectService.js
│   │   │   ├── taskService.js
│   │   │   ├── notificationService.js
│   │   │   ├── cacheService.js
│   │   │   └── auditService.js
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   ├── teamValidator.js
│   │   │   ├── taskValidator.js
│   │   │   └── common.js
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   ├── crypto.js
│   │   │   ├── logger.js
│   │   │   └── errorResponse.js
│   │   ├── jobs/
│   │   │   ├── notificationQueue.js
│   │   │   ├── reportGeneration.js
│   │   │   └── emailWorker.js
│   │   ├── websocket/
│   │   │   ├── handlers.js
│   │   │   ├── middleware.js
│   │   │   └── events.js
│   │   └── app.js
│   ├── .env.example
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── NotificationBell.jsx
│   │   │   │   └── UserMenu.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── SignupForm.jsx
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   ├── teams/
│   │   │   │   ├── TeamList.jsx
│   │   │   │   ├── TeamCard.jsx
│   │   │   │   ├── CreateTeamModal.jsx
│   │   │   │   └── TeamMembers.jsx
│   │   │   ├── projects/
│   │   │   │   ├── ProjectList.jsx
│   │   │   │   ├── ProjectBoard.jsx
│   │   │   │   └── CreateProjectModal.jsx
│   │   │   └── tasks/
│   │   │       ├── TaskList.jsx
│   │   │       ├── TaskCard.jsx
│   │   │       ├── TaskDetail.jsx
│   │   │       ├── TaskForm.jsx
│   │   │       └── TaskFilters.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TeamsPage.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   ├── TasksPage.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useTeams.js
│   │   │   ├── useTasks.js
│   │   │   ├── useWebSocket.js
│   │   │   └── useNotifications.js
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── TeamContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── websocket.js
│   │   │   └── storage.js
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   ├── variables.css
│   │   │   └── components/
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   ├── .env.example
│   ├── package.json
│   └── Dockerfile
│
├── infra/
│   ├── docker-compose.yml
│   ├── nginx.conf
│   ├── .env.production
│   └── deploy.sh
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API_REFERENCE.md
│   ├── DEPLOYMENT.md
│   ├── SCALING.md
│   └── TROUBLESHOOTING.md
│
└── README.md
```

---

### 1.8 Tech Decisions (and Why)

| Component       | Choice                  | Why                                                                      | Tradeoff                               |
| --------------- | ----------------------- | ------------------------------------------------------------------------ | -------------------------------------- |
| **Database**    | MongoDB                 | Document model fits projects/tasks; flexible schema for evolution        | Need to manage relationships carefully |
| **Cache**       | Redis                   | Fast in-memory; perfect for activity feeds, user sessions, rate limiting | Adds infrastructure complexity         |
| **Real-time**   | Socket.io               | Abstraction over WebSockets; easy fallback; auto-reconnect               | Small overhead vs raw WS               |
| **Auth**        | JWT                     | Stateless, scalable; works with WebSockets                               | Need secure storage for refresh tokens |
| **Jobs**        | Bull (Redis-backed)     | Simple, reliable queue; built on Redis                                   | Adds dependency                        |
| **File Upload** | MinIO (or S3)           | S3-compatible; can self-host or use AWS                                  | Costs scale with storage               |
| **Logging**     | Winston + ELK           | Structured logs; searchable; scales                                      | Adds infrastructure                    |
| **Monitoring**  | Prometheus + Grafana    | Metrics-first; open source                                               | Learning curve steep                   |
| **Container**   | Docker + Docker Compose | Single environment; reproducible; industry standard                      | Adds container complexity              |
| **API Gateway** | Nginx                   | Reverse proxy; load balancing; simple                                    | Adds another moving part               |

---

### 1.9 Scaling Considerations (Upfront Thinking)

**V1 (3-5 teams, <100 users):**

- Single Node.js instance
- Embedded Redis (localhost)
- Single MongoDB instance
- Direct API calls (no API Gateway)
- Basic caching (user sessions, team list)

**V1.5 (Scaling to ~500 users):**

- Add Redis cluster (session, cache, queues separated)
- MongoDB replica set (backup, failover)
- Horizontal Node.js with load balancer (Nginx)
- Separate read replicas for analytics

**V2 (1000+ users):**

- Microservices (auth, tasks, notifications separate)
- Database sharding (by teamId)
- CDN for frontend
- Dedicated WebSocket servers
- Event streaming (Kafka) for notifications
- Data warehouse for analytics (ClickHouse)

---

## PART 2: BACKEND ENGINEERING (PHASES)

### Phase 2.1: Authentication & Authorization (Week 1-2)

**Learning Goals:**

- JWT token generation and validation
- Password hashing (bcrypt)
- Role-based access control (RBAC)
- Middleware for protected routes
- Refresh token rotation

**Architecture Decisions:**

- JWT stored in localStorage (vulnerable but standard; teach CSRF separately)
- Refresh tokens in HttpOnly cookie (better for XSS)
- Short-lived access tokens (15 min), long-lived refresh (7 days)
- Token validation in middleware (every request)

**Tasks:**

1. **Setup Express + MongoDB connection**
   - Why: Every system needs a baseline
   - Debug Task: MongoDB won't connect — what are the DNS issues?

2. **User model + schema**
   - Password hashing in pre-save hook
   - Email uniqueness with sparse index
   - Role field (admin, user)
   - Why indices? Because you'll search by email 1000x/day

3. **Auth routes: signup, login, refresh, logout**
   - Implement from scratch (no copy-paste)
   - How do you prevent token replay?
   - How do you handle concurrent logins (multiple devices)?

4. **Auth middleware + protected routes**
   - Validate JWT on every request
   - Attach user to req.user
   - Handle expired tokens (refresh flow)

5. **Error handling for auth failures**
   - 401 vs 403 vs 400
   - Never leak whether email exists
   - Rate limit login attempts (prevent brute force)

**Debugging Challenge #1:**
"Why can I login but authorization fails on protected routes?"

- Trace the token generation
- Check middleware order
- Inspect JWT payload

---

### Phase 2.2: Team Management & RBAC (Week 3-4)

**Learning Goals:**

- Resource-level permissions
- Nested resource authorization
- Designing scalable permission models

**Architecture Decisions:**

- Roles per team (admin, manager, member, viewer)
- Store membership in teams collection
- Check authorization in middleware (not controllers)
- Audit every permission change

**Tasks:**

1. **Team model + membership**
   - teams: { name, creator, members: [{ userId, role }] }
   - Why: Makes permission checks O(1) lookup

2. **Create & list teams (with auth)**
   - Only admins can create teams
   - Users only see teams they're in

3. **Invite members to team**
   - Send invite (not auto-join)
   - Handle invite expiry (7 days)
   - Prevent duplicate invites

4. **Role-based actions**
   - Admin: manage members, delete team
   - Manager: create projects, assign tasks
   - Member: create tasks, update own
   - Viewer: read-only

5. **Permission middleware**
   ```
   requireTeamRole(['admin', 'manager'])
   → checks user.role in team
   → 403 if not authorized
   ```

**Refactoring Checkpoint #1:**
"Your permission code is scattered across routes. Extract to service layer."

- Moves business logic out of routes
- Enables reuse in WebSocket handlers
- Easier to test

---

### Phase 2.3: Projects & Tasks (Week 5-6)

**Learning Goals:**

- Nested resource design (team → project → task)
- Query optimization (N+1 problems)
- Pagination and filtering at scale

**Architecture Decisions:**

- Each task includes: projectId, teamId, ownerId (denormalized)
- Index on (teamId, status) for fast queries
- Pagination: cursor-based or offset? (cursor is better at scale)
- Filters: status, assignee, dueDate, priority

**Tasks:**

1. **Project model + creation**
   - Belongs to team
   - Creator becomes admin
   - Track creation date

2. **Task model + CRUD**
   - title, description, status, assignee, dueDate, priority
   - Created by whom, assigned to whom
   - Last updated timestamp

3. **List tasks with filters**

   ```
   GET /api/v1/projects/:id/tasks?status=in_progress&assignee=userId&limit=20&offset=0
   ```

   - What happens when someone filters by 5 fields?
   - Index strategy?

4. **Pagination implementation**
   - Why offset pagination fails at scale
   - Implement cursor-based pagination
   - Return: items, nextCursor, hasMore

5. **Task update logic**
   - Only assignee or manager can change status
   - Only manager can reassign
   - Track every change (for audit log)

**Debugging Challenge #2:**
"Why is this task list query slow? It was fast yesterday."

- Run explain() on MongoDB query
- Are indexes being used?
- Is the query scanning millions of docs?

---

### Phase 2.4: Activity Logs & Audit Trail (Week 7)

**Learning Goals:**

- Immutable event logs
- Compliance audit trails
- Eventually consistent systems

**Architecture Decisions:**

- Activity logs never updated or deleted
- Timestamps in UTC
- Structured format (actor, action, resource, changes)
- TTL index (keep 1 year, then delete)

**Tasks:**

1. **ActivityLog model**

   ```
   {
     teamId, projectId, taskId,
     actor: userId,
     action: 'task.created' | 'task.updated' | 'task.deleted',
     resourceId, resourceType,
     changes: { from: {}, to: {} },
     timestamp,
     metadata: {}
   }
   ```

2. **Hook into every change**
   - Whenever task updates, log it
   - Whenever team member added, log it
   - Whenever permission changes, log it

3. **Activity feed endpoint**

   ```
   GET /api/v1/teams/:id/activity?limit=50
   ```

   - Most recent first
   - Paginated
   - Can filter by action type

4. **Audit log access control**
   - Only team admins can view audit logs
   - Implement audit log download (CSV)

**Refactoring Checkpoint #2:**
"You're calling logActivity() in 10 different places. That's fragile."

- Use model hooks (pre/post save)
- Or event emitters
- Makes logging automatic

---

### Phase 2.5: Redis Caching (Week 8)

**Learning Goals:**

- Cache-aside pattern
- Cache invalidation strategies
- Session storage

**Architecture Decisions:**

- Cache user sessions in Redis
- Cache team membership (expensive join operation)
- Invalidate on write (not TTL)
- Use JSON serialization

**Tasks:**

1. **Setup Redis client**
   - Connection pooling
   - Error handling (Redis down = fallback to DB)
   - Key naming convention

2. **Cache user session**
   - After login, store token in Redis
   - Check against Redis on request
   - Logout = delete from Redis (instant logout)

3. **Cache team membership**
   - Query: get all teams for user
   - Cache miss: query MongoDB, store in Redis
   - On member add/remove: invalidate cache

4. **Cache invalidation strategy**
   - Task updates? Clear project cache
   - Member joins? Clear team cache
   - What if you forget to invalidate?

**Debugging Challenge #3:**
"Why does my edit not appear for 5 minutes?"

- You didn't invalidate cache
- User is getting stale data
- Trace the cache keys
- Verify invalidation logic

---

### Phase 2.6: WebSockets & Real-time (Week 9)

**Learning Goals:**

- Real-time architecture
- Event-driven systems
- Handling concurrent updates

**Architecture Decisions:**

- Socket.io for WebSocket abstraction
- Redis adapter (later, for scaling)
- Rooms per project (join on access)
- Emit events on database changes

**Tasks:**

1. **Socket.io integration**
   - Server setup with express integration
   - Client library ready (for frontend)
   - Authentication (verify JWT on WS connect)

2. **Join/leave project rooms**

   ```
   Client: socket.emit('join:project', { projectId })
   Server: socket.join(`project:${projectId}`)
   ```

3. **Broadcast task updates**

   ```
   Task updated in DB
   → Emit to project room
   → All clients see live update
   ```

4. **Presence (who's online)**
   - Track connected users
   - Emit user:online / user:offline
   - Show avatars in UI

5. **Handling race conditions**
   - Two users edit task simultaneously
   - Last write wins (simple) vs operational transform (complex)
   - Start with last write wins

**Refactoring Checkpoint #3:**
"Your WebSocket handlers are 200 lines of spaghetti. Extract to events module."

- Separate concerns
- Easier to test
- Easier to debug

---

### Phase 2.7: File Uploads & Storage (Week 10)

**Learning Goals:**

- Multipart form handling
- Storage abstraction
- File security

**Architecture Decisions:**

- Use MinIO (S3-compatible) or AWS S3
- Presigned URLs (don't expose bucket directly)
- Virus scanning (ClamAV)
- Storage key: ${teamId}/${projectId}/${filename}

**Tasks:**

1. **File upload endpoint**

   ```
   POST /api/v1/tasks/:id/attachments
   multipart/form-data with file
   ```

2. **Validate file**
   - Max size (10MB)
   - Allowed types (pdf, doc, image)
   - Scan for virus

3. **Store in S3/MinIO**
   - Generate unique filename
   - Store metadata in MongoDB
   - Return presigned download URL

4. **Delete file**
   - Remove from S3
   - Remove metadata from DB
   - Only task owner or admin

**Debugging Challenge #4:**
"File upload works locally but fails in Docker. Why?"

- MinIO container networking
- Volume mounts
- Docker Compose service discovery

---

### Phase 2.8: Background Jobs & Queues (Week 11)

**Learning Goals:**

- Async processing
- Reliable job execution
- Preventing job loss

**Architecture Decisions:**

- Bull queue (Redis-backed)
- Job types: sendNotification, generateReport, emailDigest
- Retries (3x with exponential backoff)
- Failed job tracking

**Tasks:**

1. **Setup Bull queue**
   - Queue per job type
   - Connection to Redis

2. **Notification job**
   - New task assigned → queue notification
   - Process job: create in-app notification + email
   - Retry on email failure (but not forever)

3. **Background report generation**
   - Scheduled: daily/weekly velocity report
   - Long-running (query all tasks, aggregate)
   - Store result in DB
   - Email to team

4. **Handle job failures**
   - Log to error tracking
   - Alert admin if critical job fails
   - Implement DLQ (Dead Letter Queue)

**Refactoring Checkpoint #4:**
"Jobs are too tightly coupled to business logic. Extract services."

- Separate "generate report" logic from job execution
- Makes it testable without queue

---

### Phase 2.9: Rate Limiting & Security (Week 12)

**Learning Goals:**

- API protection
- DOS prevention
- Security headers

**Architecture Decisions:**

- Rate limit by user ID (authenticated requests)
- Rate limit by IP (anonymous)
- Different limits for different endpoints
- Sliding window algorithm

**Tasks:**

1. **Implement rate limiter**

   ```
   - Login: 5 requests/min per IP
   - API: 100 requests/min per user
   - File upload: 10 requests/min per user
   ```

2. **Return 429 when exceeded**
   - Include Retry-After header
   - Helpful error message

3. **Security headers**
   - CORS (restrict origins)
   - CSP (prevent XSS)
   - HSTS (force HTTPS)
   - X-Frame-Options (prevent clickjacking)

4. **Input validation & sanitization**
   - Schema validation (joi or zod)
   - Never trust user input
   - SQL injection not applicable but NoSQL injection is

**Debugging Challenge #5:**
"My rate limiter isn't working. Requests bypass it."

- Check middleware order (must be early)
- Is Redis connection working?
- Test with curl

---

### Phase 2.10: Logging & Monitoring (Week 13)

**Learning Goals:**

- Structured logging
- Tracing requests
- Metrics collection

**Architecture Decisions:**

- Winston for logging (JSON format)
- Request ID for tracing
- Log levels: error, warn, info, debug
- Correlation IDs across services (later)

**Tasks:**

1. **Request logger middleware**
   - Log: method, path, status, duration
   - Unique request ID
   - Attach to all logs

2. **Structured logs**

   ```
   {
     timestamp,
     level: 'error',
     requestId: 'xyz',
     message: 'Task update failed',
     error: { stack, code },
     context: { userId, taskId }
   }
   ```

3. **Log levels**
   - Debug: development, verbose
   - Info: state changes, logins
   - Warn: unusual but handled
   - Error: system failure

4. **Error logging**
   - Always log unhandled errors
   - Include stack trace
   - Alert if critical errors spike

5. **Metrics**
   - Track: requests/sec, error rate, latency
   - Export to monitoring system

---

## PART 3: FRONTEND ENGINEERING (PHASES)

### Phase 3.1: React Architecture & Setup (Week 14)

**Learning Goals:**

- Component composition
- State management strategy
- Code splitting

**Architecture Decisions:**

- CRA (Create React App) or Vite for fast dev
- Context API + custom hooks (not Redux yet)
- Folder-by-feature structure
- Lazy load pages

**Tasks:**

1. **Project setup**
   - Vite + React
   - TypeScript
   - ESLint + Prettier

2. **Folder structure**
   - /components (reusable UI)
   - /pages (route components)
   - /hooks (custom hooks)
   - /context (global state)
   - /services (API calls)

3. **Component hierarchy**

   ```
   App
   ├─ Navbar
   ├─ Sidebar
   └─ Router
      ├─ Dashboard
      ├─ Projects
      │  ├─ ProjectBoard
      │  └─ TaskDetail
      └─ Settings
   ```

4. **Authentication context**
   - Store: user, token, isLoading
   - Provide: login, logout, refresh
   - Auto-refresh token on app start

---

### Phase 3.2: Protected Routes & Auth (Week 15)

**Learning Goals:**

- Route protection
- Token management
- Auto-logout on expiry

**Tasks:**

1. **ProtectedRoute component**
   - Check if user is authenticated
   - Redirect to login if not
   - Show loading while checking

2. **Token refresh logic**
   - Check token expiry on app load
   - If expired, refresh automatically
   - If refresh fails, logout user

3. **Logout on 401**
   - Intercept 401 responses
   - Clear token and user
   - Redirect to login

---

### Phase 3.3: Forms & Validation (Week 16)

**Learning Goals:**

- Form state management
- Client-side validation
- Server error handling

**Architecture Decisions:**

- Use react-hook-form (lightweight)
- Zod for validation schema (TypeScript support)
- Form state: values, errors, touched, isSubmitting

**Tasks:**

1. **Login form**
   - Email + password fields
   - Real-time validation
   - Show error messages
   - Loading state while submitting

2. **Task creation form**
   - Title, description, assignee, dueDate, priority
   - Assignee dropdown (fetch team members)
   - Rich text editor for description (optional Phase 2)

3. **Error handling**
   - Display server validation errors
   - Handle network errors
   - Retry logic

---

### Phase 3.4: State Management (Week 17)

**Learning Goals:**

- Global state without Redux
- Context + useReducer pattern
- Performance (avoiding unnecessary re-renders)

**Tasks:**

1. **TeamContext**
   - State: currentTeam, teams, members
   - Actions: selectTeam, updateTeam, addMember

2. **ProjectContext**
   - State: projects, currentProject, tasks
   - Actions: selectProject, createTask, updateTask

3. **Optimization**
   - Split context (don't put everything in one)
   - useMemo for computed values
   - useCallback for callbacks

---

### Phase 3.5: API Integration (Week 18)

**Learning Goals:**

- Data fetching
- Error handling
- Loading states

**Tasks:**

1. **API service class**
   - Axios instance with base URL
   - Auto-attach Authorization header
   - Interceptors for refresh token

2. **Custom hooks for data**

   ```
   useTeams() → {teams, loading, error}
   useProjects(teamId) → {projects, loading}
   useTasks(projectId) → {tasks, loading}
   ```

3. **Mutation hooks**

   ```
   useCreateTask() → {mutate, loading, error}
   useUpdateTask() → {mutate, loading}
   ```

4. **Cache management**
   - Invalidate when data changes
   - Manual refresh option

---

### Phase 3.6: Dashboard & Analytics (Week 19)

**Learning Goals:**

- Data visualization
- Real-time updates
- Charts and graphs

**Tasks:**

1. **Dashboard layout**
   - Summary: teams, projects, tasks
   - Quick stats: overdue tasks, team members
   - Recent activity

2. **Analytics charts**
   - Velocity chart (tasks per week)
   - Status breakdown (pie chart)
   - Team activity (bar chart)
   - Use: Recharts or Chart.js

3. **Real-time dashboard**
   - Listen to WebSocket events
   - Update charts live
   - Smooth animations

---

### Phase 3.7: WebSocket Integration (Week 20)

**Learning Goals:**

- Real-time updates on frontend
- Optimistic UI updates
- Handling conflicts

**Tasks:**

1. **WebSocket service**
   - Connect on app load
   - Auto-reconnect on disconnect
   - Queue messages while offline

2. **Real-time task updates**
   - Listen: task:updated event
   - Update local state immediately
   - Show "live" indicator

3. **Presence system**
   - See who's online in project
   - Presence avatars
   - "typing" indicators (Phase 2)

---

### Phase 3.8: Performance Optimization (Week 21)

**Learning Goals:**

- Code splitting
- Lazy loading
- Memoization

**Tasks:**

1. **Code splitting**
   - Lazy load pages
   - Dynamic imports for heavy components

2. **Image optimization**
   - WebP format
   - Lazy load images

3. **Component memoization**
   - React.memo for expensive renders
   - useMemo for computed state

---

## PART 4: PRODUCTION FEATURES (PHASE 4 - WEEKS 22-26)

### Phase 4.1: Notifications System

- In-app notification center
- Email notifications (async)
- User preferences (notification settings)
- Notification history

### Phase 4.2: Advanced Search

- Full-text search on tasks
- Filters: status, assignee, dueDate, priority, tags
- Saved search filters
- Search history

### Phase 4.3: Admin Dashboard

- User management (enable/disable)
- Team management
- View system health
- Audit log viewer

### Phase 4.4: Team Analytics

- Velocity chart (sprint velocity)
- Burndown chart (tasks completed vs. planned)
- Team member productivity
- Export reports

### Phase 4.5: File Management

- Task attachments
- File versioning
- File preview (PDFs, images)
- Download/share links

---

## PART 5: SCALING & SYSTEM DESIGN (PHASE 5 - WEEKS 27-32)

### 5.1 Horizontal Scaling

**V1 Architecture:**

```
┌─────────────┐
│   Client    │
└──────┬──────┘
       │
  ┌────▼────┐
  │  Nginx   │  (reverse proxy)
  └────┬────┘
       │
  ┌────▼──────────┐
  │  Node.js App  │  (single instance)
  └────┬──────────┘
       │
  ┌────▼──────────┐
  │  MongoDB      │
  │  Redis        │
  └───────────────┘
```

**V2 Architecture:**

```
┌──────────────────────┐
│      Clients         │
└──────────┬───────────┘
           │
      ┌────▼────┐
      │  Nginx   │  (load balancer + reverse proxy)
      └─┬──────┬─┘
        │      │
    ┌───▼─┐ ┌──▼────┐
    │ App1│ │ App2  │  (Node.js instances)
    └─┬───┘ └───┬───┘
      │         │
      └────┬────┘
           │
    ┌──────▼────────────────┐
    │   Redis Cluster       │  (session, cache, queue)
    └──────┬────────────────┘
           │
    ┌──────▼────────────────┐
    │ MongoDB Replica Set   │  (primary + replicas)
    └───────────────────────┘
```

**Scaling Challenges & Solutions:**

1. **Session State**
   - Problem: User logs in on App1, request goes to App2 (session lost)
   - Solution: Store sessions in Redis (shared)

2. **WebSocket Persistence**
   - Problem: Task updated by user on App1, user on App2 doesn't see it
   - Solution: Socket.io Redis adapter (broadcast across instances)

3. **Job Queue**
   - Problem: Job queued on App1 but App1 crashes before processing
   - Solution: Redis-backed queue with acknowledgment

---

### 5.2 Database Scaling

**Read Replicas:**

- Primary: handle writes
- Replicas: handle reads (reports, analytics)
- Replication lag: eventual consistency

**Indexing Strategy:**

```
teams:
  - index on: (created_at) for list
  - index on: (creatorId) for user's teams

tasks:
  - index on: (projectId, status) for filtering
  - index on: (assignedTo, status) for user's tasks
  - index on: (teamId, createdAt) for activity feed
  - compound index: (projectId, status, dueDate)
```

**Query Optimization:**

- Run explain() on slow queries
- Check index usage
- Monitor slow query log
- Profile with MongoDB profiler

---

### 5.3 Caching Strategy

**Cache Layers:**

1. **Browser Cache**
   - Static assets: max-age=1 year
   - API responses: max-age=5 min
   - Cache-Control headers

2. **Redis Cache**
   - User sessions (20 min TTL)
   - Team membership (1 hour, invalidate on write)
   - Project list (10 min, invalidate on project create)
   - Top analytics (5 min)

3. **CDN**
   - Static JS/CSS bundles
   - Images
   - API responses (if safe)

**Cache Invalidation:**

```
Task updated:
  1. Update in MongoDB
  2. Delete project cache (miss next time)
  3. Delete activity feed cache
  4. Emit WebSocket event (frontend re-fetches)
```

---

### 5.4 WebSocket Scaling

**Problem:** Socket.io by default broadcasts only on one server.

**Solution: Socket.io Redis Adapter**

```
App1 emits: 'task:updated'
  → Published to Redis channel: 'tasks'
  → All App instances subscribe
  → All connected clients receive update
```

**Challenges:**

- Connection affinity (which app instance handles your connection?)
- Sticky sessions in Nginx (route same user to same instance)
- Handling instance failures (users get disconnected)

---

### 5.5 Monitoring & Observability

**Metrics to Track:**

- Request latency (p50, p95, p99)
- Error rate (5xx, 4xx)
- Database query time
- Cache hit rate
- Queue depth
- Memory usage
- CPU usage

**Tools:**

- Prometheus: collect metrics
- Grafana: visualize
- ELK Stack: logs
- Jaeger: distributed tracing

**Alerting Rules:**

- Error rate > 5% → alert
- Latency p99 > 1s → investigate
- Queue depth > 10k → alert
- Memory > 80% → scale up

---

### 5.6 Database Sharding (V3)

**Why:** Single MongoDB instance can't handle 100k+ projects.

**Strategy: Shard by teamId**

```
TeamId hash % 4 = shard number
- Team 1, 5, 9 → Shard 1
- Team 2, 6, 10 → Shard 2
- Team 3, 7, 11 → Shard 3
- Team 4, 8, 12 → Shard 4

All tasks for team X go to same shard
```

**Challenges:**

- Cross-shard queries (slow)
- Rebalancing when shards are uneven
- Aggregate queries become complex

**When to shard:**

- Single DB can't handle write throughput
- Data size exceeds available RAM

---

## PART 6: DEVOPS & DEPLOYMENT (WEEKS 33-36)

### 6.1 Docker & Docker Compose

**Dockerfile for Node.js backend:**

```
- Multi-stage build
- Alpine Linux (small)
- Non-root user
- Health check
```

**docker-compose.yml:**

```
- Backend service
- MongoDB service
- Redis service
- Nginx service
Network them together
```

**Local development:**

```
docker-compose up
→ Everything runs locally
→ Same environment as production
```

---

### 6.2 Nginx Reverse Proxy

**Why:**

- Route requests to backend
- Static file serving
- Gzip compression
- Rate limiting
- HTTPS termination
- Load balancing

**nginx.conf:**

```
upstream app {
  least_conn;
  server app1:3000;
  server app2:3000;
}

server {
  listen 80;
  server_name api.workflow.com;

  location / {
    proxy_pass http://app;
  }
}
```

---

### 6.3 HTTPS & TLS

**Setup:**

- Certificate from Let's Encrypt (free)
- Auto-renewal (Certbot)
- Force HTTPS redirect

---

### 6.4 Environment Management

**Three environments:**

1. Development (.env.local)
2. Staging (.env.staging)
3. Production (.env.production)

**What varies:**

- Database URLs
- Redis URLs
- JWT secret
- Log level
- Feature flags
- Email service

**Never commit secrets:**

- .env files in .gitignore
- Use environment variables in production
- Use GitHub Secrets for CI/CD

---

### 6.5 Deployment Process

**Option A: VPS (DigitalOcean, Linode)**

1. SSH into server
2. Pull code from GitHub
3. docker-compose up
4. Verify health
5. Point DNS

**Option B: PaaS (Render, Railway)**

1. Connect GitHub repo
2. Auto-deploy on push
3. Built-in CI/CD
4. Database hosting

**Option C: Kubernetes (later)**

1. Package as container
2. Deploy to cluster
3. Auto-scaling
4. Self-healing

**My recommendation for now:** PaaS (Render or Railway)

- No ops overhead
- Auto-deploys
- Great for learning

---

### 6.6 CI/CD Pipeline

**GitHub Actions workflow:**

```
On: push to main
1. Checkout code
2. Run tests
3. Build Docker image
4. Push to registry
5. Deploy to production
6. Smoke tests
7. Alert on failure
```

**Stages:**

- Lint & format
- Unit tests
- Integration tests
- Build
- Deploy
- Monitor

---

### 6.7 Database Backups

**Strategy:**

- Daily automated backups
- Store on S3 (separate region)
- Test restore process monthly
- Retention: 30 days

**MongoDB backup:**

```
mongodump → tar.gz → upload to S3
```

---

### 6.8 Monitoring & Alerts

**What to monitor:**

- Server health (uptime, CPU, memory)
- Application metrics (requests/sec, errors)
- Database metrics (query time, connections)
- Business metrics (active users, revenue)

**Alert when:**

- Server down
- Error rate spikes
- Database slow
- Disk space low

---

## PART 7: ENGINEERING THINKING (ONGOING)

### 7.1 Debugging Methodology

**When something breaks:**

1. **Understand the symptom**
   - What happened? When? For how many users?
   - Reproducible? Intermittent?

2. **Check the logs**
   - Frontend console
   - Backend logs
   - Database logs
   - Request logs

3. **Form hypothesis**
   - What changed?
   - What could cause this symptom?

4. **Test hypothesis**
   - Add logging
   - Check state at each step
   - Use debugger

5. **Trace root cause**
   - Not just the symptom
   - Why did the bug exist?
   - How to prevent next time?

6. **Write test**
   - Test case for the bug
   - Ensure fix works
   - Prevent regression

---

### 7.2 Performance Optimization

**Start with measurement:**

- What's slow? (profiling)
- How slow? (latency distribution)
- Who's affected? (user impact)

**Example: Task list queries slow**

1. Measure: queries take 500ms
2. Trace: MongoDB scanning 1M+ documents
3. Find: missing index on (projectId, status)
4. Add: compound index
5. Verify: 50ms (10x faster)
6. Monitor: track latency over time

---

### 7.3 Refactoring Checkpoints

**Every 3-4 weeks:**

1. Code review your own code
2. Identify code smell:
   - Duplication
   - Long functions (>50 lines)
   - Complex conditionals
   - Tight coupling
3. Refactor:
   - Extract functions
   - Extract classes/services
   - Improve naming
4. Verify tests still pass

---

### 7.4 Architecture Evolution

**Don't gold-plate initially:**

- Start simple (monolith)
- Add complexity when needed (pain points)
- Measure before optimizing

**Evolution path:**

```
V1: Single Node + MongoDB + Redis
    ↓ (when: can't handle traffic)
V2: Horizontal scaling + replicas
    ↓ (when: cross-shard queries too slow)
V3: Microservices (auth, tasks, notifications)
    ↓ (when: need independent scaling)
V4: Event streaming (Kafka)
    ↓ (when: need reliable async processing)
V5: Data warehouse (analytical queries)
```

---

### 7.5 Security Mindset

**Threat model:**

- What's the value of your data?
- Who wants to attack it?
- What can go wrong?

**Defense layers:**

1. Authentication (who are you?)
2. Authorization (what can you do?)
3. Encryption in transit (TLS)
4. Encryption at rest (disk)
5. Input validation (no injection)
6. Rate limiting (prevent abuse)
7. Audit logs (track access)

**Regular security checks:**

- Dependency vulnerabilities (npm audit)
- Secrets in code (git-secrets)
- Weak permissions
- Unencrypted data

---

### 7.6 Testing Strategy

**Layers:**

1. **Unit tests** (individual functions)
   - Fast, reliable
   - Focus on business logic
   - Tools: Jest, Mocha

2. **Integration tests** (component with dependencies)
   - Test API routes with real DB
   - Slower than unit tests
   - Catch integration issues

3. **E2E tests** (full user flow)
   - Browser automation
   - Slow but catch real issues
   - Tools: Cypress, Playwright

**Coverage goals:**

- 70%+ overall
- 100% of critical paths

---

## PART 8: PRODUCTION-READINESS CHECKLIST

Before going live, verify:

### Code Quality

- [ ] No console.log statements
- [ ] No hardcoded secrets
- [ ] ESLint clean
- [ ] Prettier formatted
- [ ] TypeScript strict mode
- [ ] Error handling comprehensive

### Testing

- [ ] Unit tests (70%+ coverage)
- [ ] Integration tests for APIs
- [ ] E2E tests for critical flows
- [ ] Manual smoke test

### Database

- [ ] Backups automated
- [ ] Indexes optimized
- [ ] Migrations scripted
- [ ] Replication tested

### Security

- [ ] HTTPS enforced
- [ ] JWT validated
- [ ] Secrets in env vars
- [ ] Rate limiting enabled
- [ ] SQL/NoSQL injection prevented
- [ ] CORS configured

### Performance

- [ ] Frontend <3s load
- [ ] API <200ms latency (p95)
- [ ] Bundle size <200KB (gzipped)
- [ ] Database queries <100ms
- [ ] WebSocket messages <50ms latency

### Monitoring

- [ ] Logging configured
- [ ] Metrics exporting
- [ ] Alerts configured
- [ ] Error tracking (Sentry)
- [ ] Performance tracking

### Deployment

- [ ] Docker builds reproducible
- [ ] CI/CD pipeline automated
- [ ] Staging environment mirrors prod
- [ ] Rollback procedure documented
- [ ] Feature flags ready

### Documentation

- [ ] README with setup instructions
- [ ] API documentation
- [ ] Architecture decisions (ADRs)
- [ ] Runbook for common issues
- [ ] On-call procedures

---

## PART 9: RESUME-WORTHY FEATURES

After completing this roadmap, you can say:

✅ **Architected and built a production-grade MERN application** supporting real-time collaboration for distributed teams.

✅ **Designed scalable system architecture:** from monolith → horizontal scaling → microservices-ready.

✅ **Implemented production-level features:**

- JWT authentication with refresh token rotation
- Role-based access control across resources
- Real-time updates via WebSockets
- Background job processing with retries
- Redis caching and session management
- File upload to cloud storage
- Comprehensive audit logging

✅ **Optimized performance:**

- Reduced query latency by 10x through indexing
- Implemented cursor-based pagination for scale
- Added caching layer reducing database load by 40%
- Optimized WebSocket broadcasts with Redis adapter

✅ **Security & Compliance:**

- Implemented OAuth-ready auth system
- All endpoints validated and rate-limited
- Complete audit trail for compliance
- Encrypted sensitive data at rest

✅ **DevOps & Infrastructure:**

- Containerized application with Docker
- Set up CI/CD pipelines with GitHub Actions
- Reverse proxy with Nginx and load balancing
- Database replication and backup strategy
- Monitoring with Prometheus + Grafana

✅ **Demonstrated system design thinking:**

- Identified scaling bottlenecks before they happen
- Made data-driven optimization decisions
- Designed database schemas for scale
- Planned for failure and recovery

---

## PART 10: INTERVIEW-WORTHY ENGINEERING DECISIONS

Be ready to explain why you made these choices:

### 1. Why Redis instead of in-memory cache?

**Answer:**
"I started with in-memory cache in the Node.js process. But when I horizontal-scaled to 2 instances, users experienced cache inconsistency—user's session stored in App1, request routed to App2, session miss. Redis solved this by providing a shared cache layer. Also, it's better for session replication in a clustered setup. Later, Redis became critical for the task queue and WebSocket broadcasting."

---

### 2. Why MongoDB instead of PostgreSQL?

**Answer:**
"I chose MongoDB because of schema flexibility—tasks evolve with requirements (adding fields like tags, custom metadata). Also, document model maps directly to domain objects (teams contain members, projects contain tasks). However, this choice forced me to design carefully: manual indexing, denormalization for performance, no transactions initially. If building again, I'd use PostgreSQL for its constraints and ACID properties, but MongoDB taught me about trade-offs."

---

### 3. Why Socket.io instead of raw WebSockets?

**Answer:**
"Socket.io abstracts WebSocket issues: fallback to polling on restricted networks, automatic reconnection, binary support. Raw WebSockets are simpler but require more plumbing. Socket.io's Redis adapter solved my scaling problem—when I added a second instance, WebSocket broadcasts went to both apps automatically."

---

### 4. Why cursor-based pagination instead of offset?

**Answer:**
"Offset pagination fails at scale: if page 1 is 20 items/page, getting page 1000 requires scanning 20k items. Cursor-based avoids this—we bookmark where we left off and fetch next 20 from there. Tradeoff: cursor-based is harder to implement and doesn't support 'jump to page 50', but it's more efficient at scale."

---

### 5. Why decouple notifications into a queue?

**Answer:**
"Initially, task updates triggered email immediately. This failed: if email service is slow (2s), user action felt slow. Solution: task update queues notification job, returns immediately. Queue worker processes async. If email fails, job retries. This taught me about eventual consistency—notification might arrive 1 minute later, not immediately. Worth the trade-off."

---

## PHASE TIMELINE SUMMARY

| Week  | Phase               | Focus                           |
| ----- | ------------------- | ------------------------------- |
| 1-2   | Auth                | JWT, RBAC, secure sessions      |
| 3-4   | Teams               | Permissions, nested resources   |
| 5-6   | Core Features       | Projects, tasks, CRUD           |
| 7     | Audit Trail         | Activity logs, compliance       |
| 8     | Caching             | Redis sessions, cache patterns  |
| 9     | Real-time           | WebSockets, live updates        |
| 10    | Files               | Upload, storage, security       |
| 11    | Jobs                | Queues, background processing   |
| 12    | Security            | Rate limiting, validation       |
| 13    | Logging             | Structured logs, tracing        |
| 14-15 | Frontend Setup      | React, routes, auth context     |
| 16-17 | Forms & State       | Validation, global state        |
| 18-20 | API Integration     | Data fetching, real-time        |
| 21    | Performance         | Optimization, monitoring        |
| 22-26 | Production Features | Notifications, analytics, admin |
| 27-32 | Scaling             | Horizontal, caching, databases  |
| 33-36 | DevOps              | Docker, CI/CD, deployment       |

---

## How to Use This Roadmap

1. **Read the entire document** to understand the product and architecture
2. **Start with Phase 2.1** (Auth) — it's the foundation
3. **Build feature-by-feature** — don't skip ahead
4. **For each phase:**
   - Review tasks
   - Implement (don't copy-paste)
   - Test manually
   - Note what you learned
   - Move to next
5. **When stuck:**
   - Check error logs
   - Debug with console.log
   - Read error messages carefully
   - Search for the error (don't guess)
6. **Every 4 weeks:**
   - Review your code
   - Refactor bad patterns
   - Write tests
   - Update documentation

---

## Next Steps

1. Create GitHub repo: `workflow-app`
2. Initialize Node.js + Express project
3. Start Phase 2.1 (Authentication)
4. Commit working code after each phase
5. Document architecture decisions (ADR files)
6. Build in public (GitHub discussions for questions)

**You've got this. Let's build something real.** 🚀

---

**Document Version:** 1.0
**Last Updated:** May 10, 2026
**Status:** Ready for Phase 2.1

# Todo Full-Stack Web Application - Setup Guide

## Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL database (we recommend Neon PostgreSQL)
- Git

## Getting Started

### 1. Clone and Navigate to Project

```bash
cd h:\Projects\hackathon_II\todo-phase2-full_stack
```

### 2. Backend Setup

#### 2.1 Create Python Virtual Environment

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Linux/Mac
```

#### 2.2 Install Dependencies

```bash
pip install -r requirements.txt
```

#### 2.3 Configure Environment Variables

Create `.env` file in `backend/` directory:

```env
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET=your_secure_random_secret_min_32_chars
CORS_ORIGIN=http://localhost:3000
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=1
```

**For Neon PostgreSQL:**
1. Create account at https://neon.tech
2. Create new project
3. Copy connection string
4. Use it as `DATABASE_URL`

#### 2.4 Run Backend Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: http://localhost:8000
API docs at: http://localhost:8000/docs

### 3. Frontend Setup

#### 3.1 Install Dependencies

```bash
cd ../frontend
npm install
```

#### 3.2 Configure Environment Variables

Create `.env.local` file in `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=same_as_backend_JWT_SECRET
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=same_as_backend_DATABASE_URL
```

**Important:** `BETTER_AUTH_SECRET` must match `JWT_SECRET` from backend!

#### 3.3 Run Frontend Server

```bash
npm run dev
```

Frontend will be available at: http://localhost:3000

### 4. Database Initialization

The database tables will be created automatically when you start the backend server for the first time.

### 5. Testing the Application

1. Open http://localhost:3000
2. Click "Sign Up" and create a new account
3. Sign in with your credentials
4. Create, view, update, and delete tasks

## Project Structure

```
todo-phase2-full_stack/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── main.py         # Entry point
│   │   ├── config.py       # Configuration
│   │   ├── database.py     # Database connection
│   │   ├── dependencies.py # Auth dependency
│   │   ├── models/         # SQLModel models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── routes/         # API endpoints
│   │   └── middleware/     # JWT verification
│   └── requirements.txt
│
├── frontend/                # Next.js frontend
│   ├── app/                # App router pages
│   ├── components/         # React components
│   ├── lib/                # API client & auth
│   └── types/              # TypeScript types
│
└── specs/                   # Documentation
    ├── speckit.constitution
    ├── speckit.specify
    ├── speckit.plan
    └── speckit.tasks
```

## API Endpoints

All endpoints require JWT authentication (except health check).

### Health Check
- `GET /health` - Check if API is running

### Tasks
- `GET /api/{user_id}/tasks` - List all tasks for user
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{task_id}` - Get single task
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle completion

## Security Features

- JWT-based authentication
- User isolation (users can only access their own tasks)
- Password hashing with bcrypt
- CORS protection
- SQL injection prevention via ORM

## Troubleshooting

### Backend won't start
- Check DATABASE_URL is correct
- Ensure PostgreSQL is running
- Verify all dependencies are installed

### Frontend can't connect to backend
- Ensure backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in .env.local
- Verify CORS_ORIGIN in backend .env matches frontend URL

### Authentication fails
- Ensure JWT_SECRET matches between frontend and backend
- Check token hasn't expired
- Clear localStorage and try signing in again

## Development Workflow

1. Start backend server
2. Start frontend server
3. Make code changes
4. Both servers will auto-reload
5. Test changes in browser

## Production Deployment

See `specs/DEPLOYMENT.md` for production deployment instructions.

## Support

For issues, refer to:
- `specs/speckit.plan` - Architecture details
- `specs/speckit.specify` - Feature specifications
- `specs/speckit.tasks` - Implementation tasks
- FastAPI docs at http://localhost:8000/docs

# Backend CLAUDE.md

## Technology Stack
- Python 3.13+
- FastAPI
- SQLModel (ORM)
- PyJWT (JWT verification)
- Neon Serverless PostgreSQL

## Directory Structure
```
backend/
├── app/
│   ├── main.py           # FastAPI app entry point
│   ├── config.py         # Configuration settings
│   ├── database.py       # Database connection
│   ├── dependencies.py   # FastAPI dependencies
│   ├── models/          # SQLModel database models
│   │   └── task.py
│   ├── routes/          # API route handlers
│   │   └── tasks.py
│   ├── middleware/      # JWT verification
│   │   └── auth.py
│   └── schemas/         # Pydantic schemas
│       └── task.py
└── requirements.txt
```

## Key Files
- **main.py**: FastAPI app with CORS, route registration
- **config.py**: Environment variables via pydantic-settings
- **database.py**: SQLModel engine and session management
- **middleware/auth.py**: JWT verification functions
- **dependencies.py**: `get_current_user` dependency
- **routes/tasks.py**: All 6 task endpoints
- **models/task.py**: SQLModel Task model
- **schemas/task.py**: Pydantic request/response schemas

## Environment Variables (.env)
```
DATABASE_URL=<neon-postgresql-url>
JWT_SECRET=<shared-secret-with-frontend>
CORS_ORIGIN=http://localhost:3000
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=1
```

## API Endpoints
All endpoints require JWT in Authorization header (except health):

- `GET /health` - Health check (no auth)
- `GET /api/{user_id}/tasks` - List user's tasks
- `POST /api/{user_id}/tasks` - Create task
- `GET /api/{user_id}/tasks/{id}` - Get single task
- `PUT /api/{user_id}/tasks/{id}` - Update task
- `DELETE /api/{user_id}/tasks/{id}` - Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion

## Security
- JWT verification via `get_current_user` dependency
- user_id extracted from JWT payload (`sub` claim)
- URL user_id must match JWT user_id (403 if mismatch)
- All DB queries filtered by user_id
- 401 if token missing/invalid
- 403 if user tries to access other user's data
- 404 if task not found

## Development Commands
```bash
# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --port 8000

# Database migrations (automatic on startup)
# Tables created via create_db_and_tables() on app startup
```

## Database Schema
**Tasks Table** (auto-created by SQLModel):
- id: UUID (PK)
- user_id: String (indexed)
- title: String(200)
- description: String(1000), nullable
- completed: Boolean (default False)
- created_at: DateTime
- updated_at: DateTime

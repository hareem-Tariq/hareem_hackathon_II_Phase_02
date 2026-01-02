# CLAUDE.md - Spec-Driven Development Guide

## Project Overview
This is a Full-Stack Todo Web Application built for Hackathon II Phase II.

## Requirements (SOURCE OF TRUTH)
- Full-Stack Todo Web Application
- 5 Basic Level features: Create, View, Update, Delete, Mark complete/incomplete
- Multi-user support with strict user isolation
- RESTful API endpoints
- Frontend: Next.js 16+ (App Router, TypeScript, Tailwind CSS)
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (signup/signin)
- JWT-based auth between frontend and backend

## Architecture
**Monorepo Structure:**
- `/frontend` - Next.js application
- `/backend` - FastAPI application
- `/specs` - Specification documents
- `/.spec-kit` - Spec-Kit Plus configuration

**Authentication Flow:**
1. User signs up via Better Auth (frontend)
2. Better Auth stores hashed password in Neon PostgreSQL
3. User signs in, frontend issues JWT token
4. JWT token sent in Authorization header for all API requests
5. Backend verifies JWT and extracts user_id
6. All database queries filtered by user_id

**API Endpoints:**
- `GET /api/{user_id}/tasks` - List all tasks
- `POST /api/{user_id}/tasks` - Create task
- `GET /api/{user_id}/tasks/{id}` - Get single task
- `PUT /api/{user_id}/tasks/{id}` - Update task
- `DELETE /api/{user_id}/tasks/{id}` - Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion

## Development Principles
1. **Spec-First**: All specs in `/specs` directory must be complete before coding
2. **User Isolation**: Users can ONLY access their own data
3. **Security**: JWT verification on every protected endpoint
4. **Type Safety**: TypeScript on frontend, Python type hints on backend
5. **Clean Code**: Professional, readable, maintainable code

## Database Schema
**Tasks Table:**
- id (UUID, Primary Key)
- user_id (String, Foreign Key to users)
- title (String, max 200)
- description (String, max 1000, nullable)
- completed (Boolean, default False)
- created_at (DateTime)
- updated_at (DateTime)

**Users Table:** (Managed by Better Auth)
- Better Auth automatically creates and manages user table

## Testing Requirements
All 5 CRUD operations must work:
1. Create task ✓
2. View tasks ✓
3. Update task ✓
4. Delete task ✓
5. Mark complete/incomplete ✓

## Security Checklist
- [x] Passwords hashed (Better Auth)
- [x] JWT verification on all endpoints
- [x] user_id from JWT, not URL
- [x] URL user_id must match JWT user_id
- [x] Database queries filtered by user_id
- [x] CORS properly configured
- [x] Environment variables for secrets

## Deployment
- Frontend: Vercel or similar
- Backend: Railway, Render, or similar
- Database: Neon Serverless PostgreSQL (already configured)

## Status
✅ Project is 100% requirement-compliant and submission-ready

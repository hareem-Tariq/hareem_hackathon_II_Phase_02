# Frontend CLAUDE.md

## Technology Stack
- Next.js 16+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Better Auth
- Axios for API calls

## Directory Structure
```
frontend/
├── app/               # Next.js App Router
│   ├── page.tsx      # Home (redirects to /tasks or /signin)
│   ├── layout.tsx    # Root layout
│   ├── globals.css   # Global styles
│   ├── signin/       # Sign in page
│   ├── signup/       # Sign up page
│   ├── tasks/        # Task list page
│   │   └── [id]/    # Task detail page
│   └── api/auth/    # Better Auth API routes
├── components/       # React components
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   ├── ProtectedRoute.tsx
│   ├── SigninForm.tsx
│   ├── SignupForm.tsx
│   ├── TaskForm.tsx
│   ├── TaskItem.tsx
│   └── TaskList.tsx
├── lib/
│   ├── auth/        # Better Auth configuration
│   └── api/         # API client and services
└── types/           # TypeScript type definitions
```

## Key Files
- **lib/api/client.ts**: Axios client with JWT interceptor
- **lib/api/tasks.ts**: Task CRUD API methods
- **lib/auth/better-auth.ts**: Better Auth configuration
- **components/ProtectedRoute.tsx**: Route protection wrapper
- **app/api/auth/signin/route.ts**: Custom signin with JWT generation
- **app/api/auth/signup/route.ts**: Custom signup with Better Auth

## Environment Variables (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
BETTER_AUTH_SECRET=<shared-secret-with-backend>
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=<neon-postgresql-url>
```

## Authentication Flow
1. User submits email/password to /api/auth/signup
2. Better Auth creates user with hashed password
3. User signs in via /api/auth/signin
4. JWT token generated with user_id in payload
5. Token stored in localStorage
6. Token sent in Authorization header for all API calls

## Development Commands
```bash
npm run dev    # Start dev server (port 3000)
npm run build  # Build for production
npm start      # Start production server
```

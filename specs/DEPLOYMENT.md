# Deployment Guide - Todo Full-Stack Application

## Production Deployment with Neon PostgreSQL

### Step 1: Set up Neon PostgreSQL Database

1. **Create Neon Account**
   - Visit https://neon.tech
   - Sign up for a free account
   - Create a new project

2. **Get Connection String**
   - In Neon dashboard, navigate to your project
   - Copy the connection string
   - It will look like: `postgresql://neondb_owner:PASSWORD@HOST.neon.tech/neondb?sslmode=require`

### Step 2: Update Backend Environment

Edit `backend/.env`:

```env
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST.neon.tech/neondb?sslmode=require
JWT_SECRET=FmvM6kr9YEGcgVfPA1vfbHvegFXtMeUzMYeDy89N1PM
CORS_ORIGIN=https://your-frontend-domain.com
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=1
```

### Step 3: Update Frontend Environment

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
BETTER_AUTH_SECRET=FmvM6kr9YEGcgVfPA1vfbHvegFXtMeUzMYeDy89N1PM
BETTER_AUTH_URL=https://your-frontend-domain.com
DATABASE_URL=postgresql://neondb_owner:YOUR_PASSWORD@YOUR_HOST.neon.tech/neondb?sslmode=require
```

### Step 4: Deploy Backend (Railway/Render)

#### Option A: Railway

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `cd backend && railway init`
4. Add environment variables in Railway dashboard
5. Deploy: `railway up`

#### Option B: Render

1. Create account at https://render.com
2. New > Web Service
3. Connect your GitHub repository
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add environment variables in Render dashboard

### Step 5: Deploy Frontend (Vercel)

1. Install Vercel CLI: `npm install -g vercel`
2. Navigate to frontend: `cd frontend`
3. Deploy: `vercel --prod`
4. Add environment variables in Vercel dashboard

### Step 6: Database Migration

The database tables will be created automatically on first backend startup.

### Step 7: Test Production Deployment

1. Visit your frontend URL
2. Create a new account
3. Sign in
4. Create, view, update, and delete tasks
5. Verify user isolation by creating multiple accounts

## Security Checklist

- [ ] JWT_SECRET is strong and random (32+ characters)
- [ ] CORS_ORIGIN is set to exact frontend URL (no wildcards)
- [ ] Database password is secure
- [ ] Environment variables are never committed to git
- [ ] HTTPS is enabled for both frontend and backend
- [ ] Rate limiting is considered for auth endpoints

## Local Development

For local development, the application is configured to use SQLite:

```env
# backend/.env
DATABASE_URL=sqlite:///./todo.db

# frontend/.env.local
DATABASE_URL=sqlite:///./auth.db
```

This allows testing without setting up PostgreSQL locally.

## Monitoring

- Check backend health: `GET https://your-backend-domain.com/health`
- View API docs: `https://your-backend-domain.com/docs`
- Monitor Neon dashboard for database metrics
- Check Railway/Render logs for backend errors
- Check Vercel logs for frontend errors

## Troubleshooting

### Database Connection Issues
- Verify connection string format
- Ensure `?sslmode=require` is included
- Check Neon project status in dashboard

### CORS Errors
- Verify CORS_ORIGIN matches frontend URL exactly
- Include protocol (https://)
- No trailing slash

### Authentication Failures
- Ensure JWT_SECRET matches between frontend and backend
- Check token expiration settings
- Verify Better Auth database connection

## Support

For issues:
- Backend API docs: https://your-backend-domain.com/docs
- Check server logs in hosting platform
- Verify environment variables are set correctly
- Test API endpoints with curl or Postman

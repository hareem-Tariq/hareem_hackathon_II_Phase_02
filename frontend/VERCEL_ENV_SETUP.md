# Vercel Environment Variables Setup

## Required Environment Variables for Production

Set these in your Vercel project settings:

### 1. NEXT_PUBLIC_API_URL
```
https://hareem-todo-backend-44bccfcec24d.herokuapp.com
```

### 2. BETTER_AUTH_SECRET
```
better-auth-secret-2026-hareem-hackathon-phase2-secure
```

### 3. BETTER_AUTH_URL
```
https://hareem-hackathon-ii-phase-02.vercel.app
```

### 4. DATABASE_URL
```
postgresql://neondb_owner:npg_OQIW8qZ6PEsR@ep-calm-snow-ahza583h-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## How to Set in Vercel Dashboard

1. Go to: https://vercel.com/hamzas-projects-04482650/hareem-hackathon-ii-phase-02/settings/environment-variables

2. Add each variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://hareem-todo-backend-44bccfcec24d.herokuapp.com`
   - Environment: Production, Preview, Development

3. Repeat for all variables above

4. Redeploy your application after setting all variables

## Verify Setup

After deployment, check:
- Frontend can call backend API
- JWT authentication works
- CORS allows requests from Vercel domain

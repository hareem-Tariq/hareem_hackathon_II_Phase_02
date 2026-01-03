# AUTH FIX VERIFICATION CHECKLIST

## ROOT CAUSE
Your frontend was signing JWTs with `BETTER_AUTH_SECRET` but your backend was verifying with a different secret value. This secret mismatch caused all authenticated API requests to fail with "invalid authentication" errors after successful login.

**Before:**
- Frontend: Signs JWT with `BETTER_AUTH_SECRET` 
- Backend: Verifies JWT with `BETTER_AUTH_SECRET` (different value in different env)
- Result: Token verification fails ❌

**After:**
- Frontend: Signs JWT with `JWT_SECRET` 
- Backend: Verifies JWT with `JWT_SECRET` (same value shared across both)
- Result: Token verification succeeds ✅

## CHOSEN AUTH PATTERN
**Pattern C: Backend-Compatible JWT (HS256)**

1. User signs in → Better Auth validates credentials
2. Frontend generates JWT signed with `JWT_SECRET` (HS256)
3. JWT contains: `{ sub: userId, email: userEmail, user_id: userId }`
4. Frontend stores JWT in `localStorage` as `auth_token`
5. All API requests include: `Authorization: Bearer <JWT>`
6. Backend verifies JWT using same `JWT_SECRET`

---

## CODE CHANGES SUMMARY

### Frontend Change
**File:** `frontend/app/api/auth/signin/route.ts`
**Line:** 6
```typescript
// BEFORE
const JWT_SECRET = process.env.BETTER_AUTH_SECRET || ''

// AFTER
const JWT_SECRET = process.env.JWT_SECRET || ''
```

### Backend Change
**File:** `backend/app/middleware/auth.py`
**Line:** 23
```python
# BEFORE
payload = jwt.decode(
    token,
    settings.BETTER_AUTH_SECRET,
    algorithms=[settings.JWT_ALGORITHM]
)

# AFTER
payload = jwt.decode(
    token,
    settings.JWT_SECRET,
    algorithms=[settings.JWT_ALGORITHM]
)
```

---

## 5-STEP VERIFICATION CHECKLIST

### ✅ Step 1: Verify Environment Variables
**Frontend (Vercel):**
```bash
# Check these env vars exist in Vercel dashboard
JWT_SECRET=hackathon-ii-jwt-secret-2026-super-secure-key-hareem-project
BETTER_AUTH_SECRET=better-auth-secret-2026-hareem-hackathon-phase2-secure
NEXT_PUBLIC_API_URL=https://hareem-todo-backend-44bccfcec24d.herokuapp.com
```

**Backend (Heroku):**
```bash
heroku config -a hareem-todo-backend
# Verify output includes:
# JWT_SECRET=hackathon-ii-jwt-secret-2026-super-secure-key-hareem-project
```

**Action:** Confirm both JWT_SECRET values are IDENTICAL

---

### ✅ Step 2: Redeploy Both Services
```bash
# Frontend (from frontend/)
vercel --prod

# Backend (from backend/)
git add .
git commit -m "Fix: Use JWT_SECRET for token verification"
git push heroku main
```

**Wait for:** Deployment success messages

---

### ✅ Step 3: Test Signin & Token Storage
1. Navigate to: `https://your-app.vercel.app/signin`
2. Sign in with test credentials
3. Open Chrome DevTools → Application → Local Storage
4. Verify key exists: `auth_token`
5. Copy token value

**Expected:** Token stored in localStorage after successful signin

---

### ✅ Step 4: Decode & Validate JWT
Visit: https://jwt.io

1. Paste your `auth_token` into the "Encoded" field
2. In "Verify Signature" section, paste:
   ```
   hackathon-ii-jwt-secret-2026-super-secure-key-hareem-project
   ```
3. Verify:
   - Algorithm shows: `HS256` 
   - "Signature Verified" shows ✅
   - Payload contains: `sub`, `email`, `user_id`

**Expected:** Valid JWT with correct claims and signature

---

### ✅ Step 5: Test API Request with Authorization Header
Open Chrome DevTools → Network tab

1. Navigate to: `/tasks`
2. Find request to: `https://hareem-todo-backend-44bccfcec24d.herokuapp.com/api/{userId}/tasks`
3. Click request → Headers tab
4. Verify under "Request Headers":
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. Check "Response" tab → Should show 200 OK with task array

**Expected:** 
- ✅ Authorization header present with "Bearer " prefix
- ✅ Response status 200 (not 401)
- ✅ Tasks data returned

---

## TROUBLESHOOTING

### Issue: Still getting 401 errors
**Check:**
1. Clear localStorage: `localStorage.clear()` in console
2. Sign out and sign in again
3. Verify JWT_SECRET matches on both frontend and backend
4. Check Heroku logs: `heroku logs --tail -a hareem-todo-backend`

### Issue: Token not in localStorage
**Check:**
- Signin response returns `token` field
- No browser console errors during signin
- localStorage is accessible (not in incognito without permission)

### Issue: Token signature invalid at jwt.io
**Fix:**
- Ensure secret has no extra quotes or whitespace
- Copy exact secret from Vercel/Heroku dashboards
- Redeploy both services after secret change

---

## SECURITY NOTES
- ✅ JWT uses HS256 (symmetric signing)
- ✅ Token expires in 1 hour (`expiresIn: '1h'`)
- ✅ Secrets are environment variables (not hardcoded)
- ✅ Authorization header follows RFC 6750 format
- ✅ Backend validates token expiration

---

## SUCCESS CRITERIA
Your auth is working correctly when:
1. ✅ User can sign up
2. ✅ User can sign in → sees `/tasks` page
3. ✅ Tasks load without 401 errors
4. ✅ Create/Update/Delete task operations succeed
5. ✅ Network tab shows `Authorization: Bearer ...` on all API requests
6. ✅ Token decoded at jwt.io shows valid signature

---

## ADDITIONAL COMMANDS

### View Heroku Config
```bash
heroku config -a hareem-todo-backend
```

### View Heroku Logs (Real-time)
```bash
heroku logs --tail -a hareem-todo-backend
```

### Test Backend Auth Directly (PowerShell)
```powershell
# 1. Get a token by signing in
$response = Invoke-RestMethod -Uri "https://your-app.vercel.app/api/auth/signin" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"password123"}'

$token = $response.token

# 2. Test authenticated endpoint
$headers = @{
    Authorization = "Bearer $token"
}

Invoke-RestMethod -Uri "https://hareem-todo-backend-44bccfcec24d.herokuapp.com/api/{userId}/tasks" `
  -Headers $headers
```

Replace `{userId}` with actual user ID from token payload.

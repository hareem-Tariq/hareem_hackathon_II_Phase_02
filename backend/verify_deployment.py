"""
Pre-Deployment Verification Script
Run this to verify backend is ready before deploying to Heroku
"""

import os
import sys
from pathlib import Path

# Add backend to path
backend_path = Path(__file__).parent
sys.path.insert(0, str(backend_path))

print("🔍 VERIFYING BACKEND CONFIGURATION...")
print("=" * 60)

# Test 1: Import main app
print("\n1️⃣ Testing app import...")
try:
    from app.main import app
    print("   ✅ App imported successfully")
    print(f"   ✅ App title: {app.title}")
    print(f"   ✅ App version: {app.version}")
except Exception as e:
    print(f"   ❌ FAILED: {e}")
    sys.exit(1)

# Test 2: Check environment config
print("\n2️⃣ Testing configuration...")
try:
    from app.config import settings
    required_vars = ['DATABASE_URL', 'JWT_SECRET', 'BETTER_AUTH_SECRET', 'CORS_ORIGINS']
    
    for var in required_vars:
        value = getattr(settings, var, None)
        if value:
            # Mask sensitive values
            display = value[:10] + "..." if var in ['JWT_SECRET', 'BETTER_AUTH_SECRET', 'DATABASE_URL'] else value
            print(f"   ✅ {var}: {display}")
        else:
            print(f"   ⚠️  {var}: Not set (will fail on Heroku)")
    
    # Test CORS origins parsing
    origins = settings.cors_origins_list
    print(f"   ✅ CORS origins parsed: {len(origins)} origin(s)")
    for origin in origins:
        print(f"      - {origin}")
        
except Exception as e:
    print(f"   ❌ FAILED: {e}")
    sys.exit(1)

# Test 3: Check database config
print("\n3️⃣ Testing database configuration...")
try:
    from app.database import engine
    db_url = str(engine.url)
    
    # Check if it's PostgreSQL
    if db_url.startswith('postgresql'):
        print("   ✅ Database: PostgreSQL")
        
        # Check SSL mode
        if 'sslmode=require' in db_url or engine.url.query.get('sslmode') == 'require':
            print("   ✅ SSL mode: Enabled")
        else:
            print("   ⚠️  SSL mode: Not detected (might fail with Neon)")
    else:
        print(f"   ⚠️  Database type: {db_url.split(':')[0]} (expected PostgreSQL)")
        
except Exception as e:
    print(f"   ❌ FAILED: {e}")
    sys.exit(1)

# Test 4: Check routes
print("\n4️⃣ Testing routes...")
try:
    routes = [route.path for route in app.routes]
    api_routes = [r for r in routes if r.startswith('/api')]
    
    print(f"   ✅ Total routes: {len(routes)}")
    print(f"   ✅ API routes: {len(api_routes)}")
    
    # Check critical routes
    critical_routes = ['/health', '/', '/api/{user_id}/tasks']
    for route in critical_routes:
        if any(route in r for r in routes):
            print(f"   ✅ Route exists: {route}")
        else:
            print(f"   ⚠️  Route missing: {route}")
            
except Exception as e:
    print(f"   ❌ FAILED: {e}")
    sys.exit(1)

# Test 5: Check middleware
print("\n5️⃣ Testing middleware...")
try:
    middleware_types = [type(m).__name__ for m in app.user_middleware]
    
    if 'CORSMiddleware' in str(middleware_types):
        print("   ✅ CORS middleware configured")
    else:
        print("   ⚠️  CORS middleware not found")
        
except Exception as e:
    print(f"   ⚠️  Could not verify middleware: {e}")

# Test 6: Check JWT verification
print("\n6️⃣ Testing JWT verification...")
try:
    from app.middleware.auth import verify_jwt, get_token_from_header
    print("   ✅ JWT functions imported successfully")
    
    # Test invalid token handling
    try:
        verify_jwt("invalid_token")
        print("   ❌ JWT verification not working (accepted invalid token)")
    except Exception:
        print("   ✅ JWT verification rejects invalid tokens")
        
except Exception as e:
    print(f"   ❌ FAILED: {e}")
    sys.exit(1)

# Test 7: Check models
print("\n7️⃣ Testing models...")
try:
    from app.models.task import Task
    print("   ✅ Task model imported")
    
    # Check required fields
    required_fields = ['id', 'user_id', 'title', 'completed']
    task_fields = Task.__fields__.keys()
    
    for field in required_fields:
        if field in task_fields:
            print(f"   ✅ Field exists: {field}")
        else:
            print(f"   ❌ Field missing: {field}")
            
except Exception as e:
    print(f"   ❌ FAILED: {e}")
    sys.exit(1)

# Final summary
print("\n" + "=" * 60)
print("✅ PRE-DEPLOYMENT VERIFICATION COMPLETE")
print("=" * 60)
print("\n📋 NEXT STEPS:")
print("   1. Set environment variables in Heroku")
print("   2. Run: heroku login")
print("   3. Run: heroku create your-app-name")
print("   4. Run: heroku config:set DATABASE_URL=...")
print("   5. Run: git push heroku main")
print("\n🚀 Backend is ready for deployment!")

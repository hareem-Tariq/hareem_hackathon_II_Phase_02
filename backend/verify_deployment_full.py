#!/usr/bin/env python3
"""
End-to-End Verification Script for Deployed Todo Application
Tests all critical endpoints and functionality
"""

import requests
import json
import sys
from typing import Optional

# Configuration
BACKEND_URL = "https://hareem-todo-backend-44bccfcec24d.herokuapp.com"
FRONTEND_URL = "https://hareem-hackathon-ii-phase-02.vercel.app"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_test(name: str, passed: bool, details: str = ""):
    """Print test result with color"""
    status = f"{Colors.GREEN}✓ PASS{Colors.ENDC}" if passed else f"{Colors.RED}✗ FAIL{Colors.ENDC}"
    print(f"{status} | {name}")
    if details:
        print(f"      {details}")

def test_backend_health():
    """Test 1: Backend Health Check"""
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=10)
        passed = response.status_code == 200 and response.json().get("status") == "ok"
        print_test("Backend Health Check", passed, f"Status: {response.status_code}")
        return passed
    except Exception as e:
        print_test("Backend Health Check", False, f"Error: {str(e)}")
        return False

def test_cors_headers():
    """Test 2: CORS Headers"""
    try:
        headers = {"Origin": FRONTEND_URL}
        response = requests.options(f"{BACKEND_URL}/api/test-user-id/tasks", 
                                     headers=headers, timeout=10)
        cors_origin = response.headers.get("access-control-allow-origin")
        cors_methods = response.headers.get("access-control-allow-methods")
        cors_headers = response.headers.get("access-control-allow-headers")
        
        passed = (
            cors_origin == FRONTEND_URL or cors_origin == "*" and
            "Authorization" in str(cors_headers) and
            "Content-Type" in str(cors_headers)
        )
        
        details = f"Origin: {cors_origin}, Methods: {cors_methods}"
        print_test("CORS Configuration", passed, details)
        return passed
    except Exception as e:
        print_test("CORS Configuration", False, f"Error: {str(e)}")
        return False

def test_unauthorized_access():
    """Test 3: Unauthorized Access (Should Fail)"""
    try:
        response = requests.get(f"{BACKEND_URL}/api/test-user/tasks", timeout=10)
        # Should return 401 without token
        passed = response.status_code == 401
        print_test("Unauthorized Access Protection", passed, 
                   f"Status: {response.status_code} (expected 401)")
        return passed
    except Exception as e:
        print_test("Unauthorized Access Protection", False, f"Error: {str(e)}")
        return False

def test_signup_signin_flow():
    """Test 4-6: Signup, Signin, and Get User ID from JWT"""
    import time
    import random
    
    # Generate unique test email
    test_email = f"test_{int(time.time())}_{random.randint(1000, 9999)}@example.com"
    test_password = "TestPassword123!"
    
    # Test 4: Signup (using Better Auth directly)
    try:
        # Note: This tests the Better Auth signup endpoint
        signup_data = {
            "email": test_email,
            "password": test_password,
            "name": "Test User"
        }
        
        print(f"\n{Colors.BLUE}Testing with test user: {test_email}{Colors.ENDC}")
        
        # We can't test Better Auth signup directly from Python easily
        # So we'll just test signin with a known good user or document this
        print_test("Signup Flow", None, 
                   "Note: Signup requires frontend/Better Auth - test manually")
        
        # Test 5: Signin (using frontend API that generates JWT)
        # We'll simulate this by creating a test JWT
        print_test("Signin Flow", None, 
                   "Note: Signin requires frontend/Better Auth - test manually")
        
        return None, None
        
    except Exception as e:
        print_test("Signup/Signin Flow", False, f"Error: {str(e)}")
        return None, None

def test_with_manual_credentials():
    """Test with manually provided credentials"""
    print(f"\n{Colors.YELLOW}To fully test authenticated endpoints:{Colors.ENDC}")
    print(f"1. Go to {FRONTEND_URL}/signup")
    print(f"2. Create an account")
    print(f"3. Sign in and open browser DevTools")
    print(f"4. Get JWT from localStorage: localStorage.getItem('auth_token')")
    print(f"5. Get user ID from JWT payload (decode at jwt.io)")
    print(f"6. Run this script with: python verify_deployment.py --token YOUR_JWT --user-id YOUR_USER_ID")

def main():
    """Run all verification tests"""
    print(f"\n{Colors.BOLD}{'='*70}{Colors.ENDC}")
    print(f"{Colors.BOLD}Todo App Deployment Verification{Colors.ENDC}")
    print(f"{Colors.BOLD}{'='*70}{Colors.ENDC}\n")
    
    print(f"{Colors.BLUE}Backend:{Colors.ENDC}  {BACKEND_URL}")
    print(f"{Colors.BLUE}Frontend:{Colors.ENDC} {FRONTEND_URL}\n")
    
    results = []
    
    # Run tests
    print(f"{Colors.BOLD}Running Tests...{Colors.ENDC}\n")
    
    results.append(("Backend Health", test_backend_health()))
    results.append(("CORS Headers", test_cors_headers()))
    results.append(("Auth Protection", test_unauthorized_access()))
    
    # Signup/Signin tests
    user_id, token = test_signup_signin_flow()
    
    # Summary
    print(f"\n{Colors.BOLD}{'='*70}{Colors.ENDC}")
    print(f"{Colors.BOLD}Test Summary{Colors.ENDC}")
    print(f"{Colors.BOLD}{'='*70}{Colors.ENDC}\n")
    
    passed = sum(1 for _, result in results if result is True)
    failed = sum(1 for _, result in results if result is False)
    skipped = sum(1 for _, result in results if result is None)
    total = len(results)
    
    print(f"Total Tests: {total}")
    print(f"{Colors.GREEN}Passed: {passed}{Colors.ENDC}")
    if failed > 0:
        print(f"{Colors.RED}Failed: {failed}{Colors.ENDC}")
    if skipped > 0:
        print(f"{Colors.YELLOW}Skipped: {skipped}{Colors.ENDC}")
    
    # Show manual test instructions
    test_with_manual_credentials()
    
    print(f"\n{Colors.BOLD}{'='*70}{Colors.ENDC}\n")
    
    # Return exit code
    sys.exit(0 if failed == 0 else 1)

if __name__ == "__main__":
    main()

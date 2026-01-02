# =============================================================================
# HEROKU DEPLOYMENT SCRIPT - FastAPI Backend
# =============================================================================
# Run this script to deploy your backend to Heroku
# Make sure to replace placeholders with your actual values
# =============================================================================

Write-Host "🚀 Starting Heroku Deployment Process..." -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location "H:\Projects\hackathon_II\todo-phase2-full_stack\backend"

# Step 1: Login to Heroku
Write-Host "Step 1: Login to Heroku" -ForegroundColor Yellow
heroku login

# Step 2: Create Heroku app (skip if already created)
Write-Host ""
Write-Host "Step 2: Create Heroku App" -ForegroundColor Yellow
$appName = Read-Host "Enter your Heroku app name (or press Enter to skip if already created)"
if ($appName) {
    heroku create $appName
}

# Step 3: Set environment variables
Write-Host ""
Write-Host "Step 3: Configure Environment Variables" -ForegroundColor Yellow
Write-Host "Please provide the following environment variables:" -ForegroundColor White

$databaseUrl = Read-Host "DATABASE_URL (from Neon PostgreSQL)"
$jwtSecret = Read-Host "JWT_SECRET (min 32 characters)"
$betterAuthSecret = Read-Host "BETTER_AUTH_SECRET (min 32 characters)"
$corsOrigins = Read-Host "CORS_ORIGINS (comma-separated, e.g., https://yourapp.vercel.app)"

Write-Host ""
Write-Host "Setting environment variables..." -ForegroundColor Green
heroku config:set DATABASE_URL="$databaseUrl"
heroku config:set JWT_SECRET="$jwtSecret"
heroku config:set BETTER_AUTH_SECRET="$betterAuthSecret"
heroku config:set CORS_ORIGINS="$corsOrigins"

# Step 4: Verify configuration
Write-Host ""
Write-Host "Step 4: Verify Configuration" -ForegroundColor Yellow
heroku config

# Step 5: Deploy
Write-Host ""
Write-Host "Step 5: Deploy to Heroku" -ForegroundColor Yellow
$deploy = Read-Host "Ready to deploy? (y/n)"
if ($deploy -eq "y") {
    # Check if git is initialized
    if (-not (Test-Path ".git")) {
        Write-Host "Initializing git repository..." -ForegroundColor Green
        git init
        git add .
        git commit -m "Initial deployment to Heroku"
    }
    
    # Add Heroku remote if needed
    Write-Host "Adding Heroku remote..." -ForegroundColor Green
    heroku git:remote -a $appName
    
    # Deploy
    Write-Host "Deploying to Heroku..." -ForegroundColor Green
    git push heroku main
}

# Step 6: Verify deployment
Write-Host ""
Write-Host "Step 6: Verify Deployment" -ForegroundColor Yellow
Start-Sleep -Seconds 5
heroku logs --tail --num 50

Write-Host ""
Write-Host "✅ Deployment script completed!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Test health endpoint: curl https://$appName.herokuapp.com/health" -ForegroundColor Gray
Write-Host "2. View API docs: https://$appName.herokuapp.com/api/docs" -ForegroundColor Gray
Write-Host "3. Update frontend with backend URL" -ForegroundColor Gray
Write-Host ""

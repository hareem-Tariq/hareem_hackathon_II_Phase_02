#!/usr/bin/env pwsh
# Vercel Environment Variable Setup Script
# Run this from the frontend directory

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Vercel Environment Variables Setup" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$projectName = "hareem-hackathon-ii-phase-02"

Write-Host "Setting up environment variables for: $projectName`n" -ForegroundColor Yellow

# Environment variables to set
$envVars = @{
    "NEXT_PUBLIC_API_URL" = "https://hareem-todo-backend-44bccfcec24d.herokuapp.com"
    "BETTER_AUTH_SECRET" = "better-auth-secret-2026-hareem-hackathon-phase2-secure"
    "BETTER_AUTH_URL" = "https://hareem-hackathon-ii-phase-02.vercel.app"
    "DATABASE_URL" = "postgresql://neondb_owner:npg_OQIW8qZ6PEsR@ep-calm-snow-ahza583h-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"
}

Write-Host "The following environment variables need to be set in Vercel:`n" -ForegroundColor Green

foreach ($key in $envVars.Keys) {
    $value = $envVars[$key]
    if ($value.Length -gt 50) {
        $displayValue = $value.Substring(0, 47) + "..."
    } else {
        $displayValue = $value
    }
    Write-Host "  $key" -ForegroundColor Cyan -NoNewline
    Write-Host " = " -NoNewline
    Write-Host "$displayValue" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "OPTION 1: Manual Setup (Recommended)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "1. Go to Vercel Dashboard:" -ForegroundColor White
Write-Host "   https://vercel.com/dashboard`n" -ForegroundColor Yellow

Write-Host "2. Navigate to your project:" -ForegroundColor White
Write-Host "   $projectName`n" -ForegroundColor Yellow

Write-Host "3. Go to Settings > Environment Variables`n" -ForegroundColor White

Write-Host "4. For each variable above, click 'Add New':" -ForegroundColor White
Write-Host "   - Enter the variable name" -ForegroundColor Gray
Write-Host "   - Enter the value" -ForegroundColor Gray
Write-Host "   - Select: Production, Preview, Development" -ForegroundColor Gray
Write-Host "   - Click Save`n" -ForegroundColor Gray

Write-Host "5. After adding all variables, trigger a redeploy:" -ForegroundColor White
Write-Host "   - Go to Deployments tab" -ForegroundColor Gray
Write-Host "   - Click '...' on latest deployment" -ForegroundColor Gray
Write-Host "   - Click 'Redeploy'`n" -ForegroundColor Gray

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "OPTION 2: CLI Setup (If linked)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "If your project is linked to Vercel CLI, you can run:`n" -ForegroundColor White

Write-Host "  vercel env add NEXT_PUBLIC_API_URL production" -ForegroundColor Yellow
Write-Host "  # Enter: https://hareem-todo-backend-44bccfcec24d.herokuapp.com`n" -ForegroundColor Gray

Write-Host "  vercel env add BETTER_AUTH_SECRET production" -ForegroundColor Yellow
Write-Host "  # Enter: better-auth-secret-2026-hareem-hackathon-phase2-secure`n" -ForegroundColor Gray

Write-Host "  vercel env add BETTER_AUTH_URL production" -ForegroundColor Yellow
Write-Host "  # Enter: https://hareem-hackathon-ii-phase-02.vercel.app`n" -ForegroundColor Gray

Write-Host "  vercel env add DATABASE_URL production" -ForegroundColor Yellow
Write-Host "  # Enter: postgresql://neondb_owner:...`n" -ForegroundColor Gray

Write-Host "  Then redeploy:" -ForegroundColor White
Write-Host "  vercel --prod`n" -ForegroundColor Yellow

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Verification" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "After setting variables and redeploying, test:" -ForegroundColor White
Write-Host "  1. Open: https://hareem-hackathon-ii-phase-02.vercel.app" -ForegroundColor Yellow
Write-Host "  2. Sign up with a test account" -ForegroundColor Gray
Write-Host "  3. Sign in" -ForegroundColor Gray
Write-Host "  4. Create a task" -ForegroundColor Gray
Write-Host "  5. Refresh the page (data should persist)`n" -ForegroundColor Gray

Write-Host "========================================`n" -ForegroundColor Cyan

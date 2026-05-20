# Identity Hub Connection Test Script (PowerShell)
# This script tests connectivity and configuration for the Identity Hub

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Identity Hub Connection Test" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$AUTHORITY = "https://id.demo.operlity.com"
$CLIENT_ID = "ee772e0e-4f95-48a5-8bbb-f2adb0696109"
$ORIGIN = "http://localhost:4500"

Write-Host "Testing with configuration:"
Write-Host "  Authority: $AUTHORITY"
Write-Host "  Client ID: $CLIENT_ID"
Write-Host "  Origin: $ORIGIN"
Write-Host ""

# Test 1: Discovery endpoint
Write-Host "Test 1: Checking OIDC Discovery Endpoint..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $discoveryUrl = "$AUTHORITY/.well-known/openid-configuration"
    $response = Invoke-WebRequest -Uri $discoveryUrl -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ PASS - Discovery endpoint is accessible (HTTP $($response.StatusCode))" -ForegroundColor Green
        $json = $response.Content | ConvertFrom-Json
        Write-Host "Endpoints found:" -ForegroundColor Gray
        Write-Host "  - Authorization: $($json.authorization_endpoint)" -ForegroundColor Gray
        Write-Host "  - Token: $($json.token_endpoint)" -ForegroundColor Gray
        Write-Host "  - UserInfo: $($json.userinfo_endpoint)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ FAIL - Discovery endpoint is not accessible" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   This means Identity Hub is not accessible or misconfigured"
}
Write-Host ""

# Test 2: CORS preflight
Write-Host "Test 2: Checking CORS Configuration..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $headers = @{
        "Origin" = $ORIGIN
        "Access-Control-Request-Method" = "GET"
        "Access-Control-Request-Headers" = "Content-Type"
    }
    $response = Invoke-WebRequest -Uri $discoveryUrl -Method Options -Headers $headers -UseBasicParsing -ErrorAction SilentlyContinue

    if ($response.Headers["Access-Control-Allow-Origin"]) {
        Write-Host "✅ PASS - CORS headers present" -ForegroundColor Green
        Write-Host "  Access-Control-Allow-Origin: $($response.Headers['Access-Control-Allow-Origin'])" -ForegroundColor Gray
        Write-Host "  Access-Control-Allow-Methods: $($response.Headers['Access-Control-Allow-Methods'])" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  WARNING - Could not verify CORS headers" -ForegroundColor Yellow
        Write-Host "   This might cause 'failed to fetch' error" -ForegroundColor Yellow
        Write-Host "   Ensure Identity Hub allows origin: $ORIGIN" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  WARNING - CORS preflight check failed" -ForegroundColor Yellow
    Write-Host "   Identity Hub may not allow requests from: $ORIGIN" -ForegroundColor Yellow
}
Write-Host ""

# Test 3: Check .env file
Write-Host "Test 3: Checking Local Configuration..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
if (Test-Path ".env") {
    Write-Host "✅ PASS - .env file exists" -ForegroundColor Green
    Write-Host "Content:" -ForegroundColor Gray
    Get-Content ".env" | Where-Object { $_ -notmatch "^#" -and $_ -ne "" } | ForEach-Object {
        Write-Host "  $_" -ForegroundColor Gray
    }
} else {
    Write-Host "❌ FAIL - .env file not found" -ForegroundColor Red
    Write-Host "   Run: Copy-Item .env.example .env" -ForegroundColor Red
}
Write-Host ""

# Test 4: Authorization endpoint
Write-Host "Test 4: Checking Authorization Endpoint..." -ForegroundColor Yellow
Write-Host "----------------------------------------"
try {
    $authUrl = "$AUTHORITY/connect/authorize"
    $response = Invoke-WebRequest -Uri $authUrl -UseBasicParsing -ErrorAction SilentlyContinue
    Write-Host "✅ PASS - Authorization endpoint is accessible" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "✅ PASS - Authorization endpoint is accessible (400 expected without parameters)" -ForegroundColor Green
    } else {
        Write-Host "❌ FAIL - Authorization endpoint returned error" -ForegroundColor Red
        Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
}
Write-Host ""

# Summary
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "If any tests failed, see TROUBLESHOOTING-FETCH-ERROR.md"
Write-Host "for detailed solutions."
Write-Host ""
Write-Host "Most common issue: CORS not configured for $ORIGIN" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. If .env missing: Copy-Item .env.example .env"
Write-Host "2. Restart the app: npm start"
Write-Host "3. Check browser console for specific errors"
Write-Host ""

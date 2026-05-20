#!/bin/bash

# Identity Hub Connection Test Script
# This script tests connectivity and configuration for the Identity Hub

echo "=================================="
echo "Identity Hub Connection Test"
echo "=================================="
echo ""

# Configuration
AUTHORITY="https://id.demo.operlity.com"
CLIENT_ID="ee772e0e-4f95-48a5-8bbb-f2adb0696109"
ORIGIN="http://localhost:4500"

echo "Testing with configuration:"
echo "  Authority: $AUTHORITY"
echo "  Client ID: $CLIENT_ID"
echo "  Origin: $ORIGIN"
echo ""

# Test 1: Discovery endpoint
echo "Test 1: Checking OIDC Discovery Endpoint..."
echo "----------------------------------------"
response=$(curl -s -o /dev/null -w "%{http_code}" "$AUTHORITY/.well-known/openid-configuration")
if [ "$response" -eq 200 ]; then
    echo "✅ PASS - Discovery endpoint is accessible (HTTP $response)"
    curl -s "$AUTHORITY/.well-known/openid-configuration" | python -m json.tool 2>/dev/null || echo "Response received but not JSON formatted"
else
    echo "❌ FAIL - Discovery endpoint returned HTTP $response"
    echo "   This means Identity Hub is not accessible or misconfigured"
fi
echo ""

# Test 2: CORS preflight
echo "Test 2: Checking CORS Configuration..."
echo "----------------------------------------"
cors_response=$(curl -s -I -X OPTIONS \
  -H "Origin: $ORIGIN" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  "$AUTHORITY/.well-known/openid-configuration")

if echo "$cors_response" | grep -q "Access-Control-Allow-Origin"; then
    echo "✅ PASS - CORS headers present"
    echo "$cors_response" | grep -i "access-control"
else
    echo "❌ FAIL - CORS headers missing"
    echo "   Identity Hub needs to allow origin: $ORIGIN"
    echo "   This is likely the cause of 'failed to fetch' error"
fi
echo ""

# Test 3: Check .env file
echo "Test 3: Checking Local Configuration..."
echo "----------------------------------------"
if [ -f ".env" ]; then
    echo "✅ PASS - .env file exists"
    echo "Content:"
    cat .env | grep -v "^#" | grep -v "^$"
else
    echo "❌ FAIL - .env file not found"
    echo "   Run: cp .env.example .env"
fi
echo ""

# Test 4: Authorization endpoint
echo "Test 4: Checking Authorization Endpoint..."
echo "----------------------------------------"
auth_response=$(curl -s -o /dev/null -w "%{http_code}" "$AUTHORITY/connect/authorize")
if [ "$auth_response" -eq 200 ] || [ "$auth_response" -eq 400 ]; then
    echo "✅ PASS - Authorization endpoint is accessible (HTTP $auth_response)"
    echo "   (400 is expected without parameters)"
else
    echo "❌ FAIL - Authorization endpoint returned HTTP $auth_response"
fi
echo ""

# Summary
echo "=================================="
echo "Summary"
echo "=================================="
echo "If any tests failed, see TROUBLESHOOTING-FETCH-ERROR.md"
echo "for detailed solutions."
echo ""
echo "Most common issue: CORS not configured for $ORIGIN"
echo ""

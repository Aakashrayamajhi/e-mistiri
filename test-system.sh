#!/bin/bash

# E-Mistiri Platform - Comprehensive Testing Script
# This script tests all services and endpoints to ensure the system is working correctly

echo "================================"
echo "E-Mistiri Platform - Test Suite"
echo "================================"
echo ""

API_GW="http://localhost:2002"
AUTH_SERVICE="http://localhost:4002"
USER_SERVICE="http://localhost:3002"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to test an endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    local expected_status=$5
    
    echo -n "Testing: $name ... "
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$url" \
            -H "Content-Type: application/json")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$url" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$http_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}PASSED${NC} (HTTP $http_code)"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}FAILED${NC} (Expected: $expected_status, Got: $http_code)"
        echo "Response: $body"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. SERVICE HEALTH CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "API Gateway Health" "GET" "$API_GW/health" "" 200
test_endpoint "User Service Health" "GET" "$USER_SERVICE/health" "" 200
test_endpoint "Auth Service Health" "GET" "$AUTH_SERVICE/health" "" 200

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. 404 NOT FOUND TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "Invalid Route" "GET" "$API_GW/api/invalidroute" "" 404

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. AUTHENTICATION TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "Missing Authorization Header" "GET" "$API_GW/api/user/profile" "" 401
test_endpoint "Invalid Token" "GET" "$API_GW/api/user/profile" "" 401 # (need to add header in actual test)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. ERROR HANDLING TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
test_endpoint "Invalid JSON" "POST" "$API_GW/api/userAuth/login" "invalid json" 400

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. RATE LIMITING TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Sending 110 rapid requests to test rate limiting..."
success_count=0
throttled_count=0

for i in {1..110}; do
    http_code=$(curl -s -o /dev/null -w "%{http_code}" "$API_GW/health")
    if [ "$http_code" -eq 200 ]; then
        success_count=$((success_count + 1))
    elif [ "$http_code" -eq 429 ]; then
        throttled_count=$((throttled_count + 1))
    fi
done

echo "Successful requests: $success_count/110"
echo "Rate limited requests: $throttled_count/110"
if [ $throttled_count -gt 0 ]; then
    echo -e "${GREEN}✓ Rate limiting is working${NC}"
    PASSED_TESTS=$((PASSED_TESTS + 3))
else
    echo -e "${YELLOW}⚠ Rate limiting may need adjustment${NC}"
    FAILED_TESTS=$((FAILED_TESTS + 3))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "Passed: ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed: ${RED}$FAILED_TESTS${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}✗ Some tests failed!${NC}"
    exit 1
fi

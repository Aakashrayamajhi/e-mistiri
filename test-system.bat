@echo off
REM E-Mistiri Platform - Windows Testing Script

setlocal enabledelayedexpansion

echo ================================
echo E-Mistiri Platform - Test Suite
echo ================================
echo.

set API_GW=http://localhost:2002
set AUTH_SERVICE=http://localhost:4002
set USER_SERVICE=http://localhost:3002

set TOTAL_TESTS=0
set PASSED_TESTS=0
set FAILED_TESTS=0

REM Test function
:test_endpoint
set "name=%~1"
set "method=%~2"
set "url=%~3"
set "expected_status=%~4"

echo Testing: %name%...
set /a TOTAL_TESTS+=1

for /f %%A in ('powershell -Command "(Invoke-WebRequest -Uri %url% -Method %method% -PassThru -ErrorAction SilentlyContinue).StatusCode"') do (
    set "http_code=%%A"
)

if "!http_code!"=="!expected_status!" (
    echo [PASS] HTTP !http_code!
    set /a PASSED_TESTS+=1
) else (
    echo [FAIL] Expected: !expected_status!, Got: !http_code!
    set /a FAILED_TESTS+=1
)
exit /b

:main
cls
echo ================================================
echo 1. SERVICE HEALTH CHECKS
echo ================================================
echo.
powershell -Command "Write-Host 'Testing API Gateway Health...' -ForegroundColor Cyan; (Invoke-WebRequest -Uri 'http://localhost:2002/health' -Method GET).StatusCode"
powershell -Command "Write-Host 'Testing User Service Health...' -ForegroundColor Cyan; (Invoke-WebRequest -Uri 'http://localhost:3002/health' -Method GET).StatusCode"
powershell -Command "Write-Host 'Testing Auth Service Health...' -ForegroundColor Cyan; (Invoke-WebRequest -Uri 'http://localhost:4002/health' -Method GET).StatusCode"

echo.
echo ================================================
echo 2. AUTHENTICATION TESTS
echo ================================================
echo.
powershell -Command "Write-Host 'Testing Missing Token (should be 401)...' -ForegroundColor Cyan; try { (Invoke-WebRequest -Uri 'http://localhost:2002/api/user/profile' -Method GET).StatusCode } catch { $_.Exception.Response.StatusCode }"

echo.
echo ================================================
echo 3. 404 NOT FOUND TEST
echo ================================================
echo.
powershell -Command "Write-Host 'Testing Invalid Route (should be 404)...' -ForegroundColor Cyan; try { (Invoke-WebRequest -Uri 'http://localhost:2002/api/invalidroute' -Method GET).StatusCode } catch { $_.Exception.Response.StatusCode }"

echo.
echo ================================================
echo 4. RATE LIMITING TEST
echo ================================================
echo.
powershell -Command "Write-Host 'Sending 110 rapid requests to test rate limiting...' -ForegroundColor Cyan; $success=0; $limited=0; 1..110 | ForEach-Object { try { if ((Invoke-WebRequest -Uri 'http://localhost:2002/health' -Method GET -UseBasicParsing).StatusCode -eq 200) { $success++ } } catch { if ($_.Exception.Response.StatusCode -eq 429) { $limited++ } } }; Write-Host \"Successful: $success/110\" -ForegroundColor Green; Write-Host \"Rate Limited: $limited/110\" -ForegroundColor Yellow"

echo.
echo ================================================
echo TEST COMPLETE
echo ================================================
echo.
echo Note: Ensure all services are running on their ports:
echo   - API Gateway: localhost:2002
echo   - Auth Service: localhost:4002
echo   - User Service: localhost:3002
echo.
echo Services can be started with: npm run dev

pause

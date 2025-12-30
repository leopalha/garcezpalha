@echo off
REM P2 Automation - Local Testing Script (Windows)
REM Tests all P2 endpoints before deploy

echo ================================
echo P2 AUTOMATION - LOCAL TESTS
echo ================================
echo.

set BASE_URL=http://localhost:3000
set TESTS_PASSED=0
set TESTS_FAILED=0

REM Check if CRON_SECRET is set
if "%CRON_SECRET%"=="" (
  echo WARNING: CRON_SECRET not set. Using placeholder.
  set CRON_SECRET=your_cron_secret
)

echo 1. CORE API TESTS
echo -------------------
echo.

REM Test 1: Health check
echo Testing Health Check...
curl -s -o nul -w "HTTP %%{http_code}\n" %BASE_URL%/api/health
if %ERRORLEVEL% EQU 0 (
  echo [32m PASS[0m - Health Check
  set /a TESTS_PASSED+=1
) else (
  echo [31m FAIL[0m - Health Check
  set /a TESTS_FAILED+=1
)
echo.

echo 2. P2-001: EMAIL SEQUENCES
echo ----------------------------
echo.

REM Test 2: Email sequences cron
echo Testing Email Sequences Cron...
curl -s -o nul -w "HTTP %%{http_code}\n" -H "Authorization: Bearer %CRON_SECRET%" %BASE_URL%/api/email/sequences/cron
if %ERRORLEVEL% EQU 0 (
  echo [32m PASS[0m - Email Sequences Cron
  set /a TESTS_PASSED+=1
) else (
  echo [31m FAIL[0m - Email Sequences Cron
  set /a TESTS_FAILED+=1
)
echo.

echo 3. P2-003: LEGAL DOCUMENTS
echo ----------------------------
echo.

REM Test 3: Legal documents types
echo Testing Legal Documents Types...
curl -s -o nul -w "HTTP %%{http_code}\n" "%BASE_URL%/api/documents/legal?types=true"
if %ERRORLEVEL% EQU 0 (
  echo [32m PASS[0m - Legal Documents
  set /a TESTS_PASSED+=1
) else (
  echo [31m FAIL[0m - Legal Documents
  set /a TESTS_FAILED+=1
)
echo.

echo 4. P2-004: PROCESS MONITOR
echo ----------------------------
echo.

REM Test 4: Process monitor cron
echo Testing Process Monitor Cron...
curl -s -o nul -w "HTTP %%{http_code}\n" -H "Authorization: Bearer %CRON_SECRET%" %BASE_URL%/api/process-monitor/cron
if %ERRORLEVEL% EQU 0 (
  echo [32m PASS[0m - Process Monitor Cron
  set /a TESTS_PASSED+=1
) else (
  echo [31m FAIL[0m - Process Monitor Cron
  set /a TESTS_FAILED+=1
)
echo.

REM Test 5: Process monitor API
echo Testing Process Monitor API...
curl -s -o nul -w "HTTP %%{http_code}\n" %BASE_URL%/api/process-monitor
if %ERRORLEVEL% EQU 0 (
  echo [32m PASS[0m - Process Monitor API
  set /a TESTS_PASSED+=1
) else (
  echo [31m FAIL[0m - Process Monitor API
  set /a TESTS_FAILED+=1
)
echo.

echo 5. P2-005: REPORTS
echo --------------------
echo.

REM Test 6: Reports types
echo Testing Reports Types...
curl -s -o nul -w "HTTP %%{http_code}\n" "%BASE_URL%/api/reports/generate?types=true"
if %ERRORLEVEL% EQU 0 (
  echo [32m PASS[0m - Reports API
  set /a TESTS_PASSED+=1
) else (
  echo [31m FAIL[0m - Reports API
  set /a TESTS_FAILED+=1
)
echo.

echo ================================
echo TEST RESULTS
echo ================================
echo Passed: %TESTS_PASSED%
echo Failed: %TESTS_FAILED%
echo.

if %TESTS_FAILED% EQU 0 (
  echo [32mALL TESTS PASSED![0m
  echo You are ready to deploy to production.
  exit /b 0
) else (
  echo [31mSOME TESTS FAILED[0m
  echo Please fix the errors before deploying.
  exit /b 1
)

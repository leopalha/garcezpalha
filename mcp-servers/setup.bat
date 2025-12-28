@echo off
REM MCP Servers Setup Script (Windows)
REM Installs and builds all implemented MCP servers

echo.
echo ===================================
echo   Garcez Palha MCP Servers Setup
echo ===================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found. Please install Node.js 18+ first.
    exit /b 1
)

echo [OK] Node.js detected
echo.

REM Setup GA4
if exist "ga4" (
    echo Setting up Google Analytics 4...
    cd ga4
    call npm install
    call npm run build
    cd ..
    echo [OK] GA4 ready
    echo.
)

REM Setup Sentry
if exist "sentry" (
    echo Setting up Sentry Auto-Debug...
    cd sentry
    call npm install
    call npm run build
    cd ..
    echo [OK] Sentry ready
    echo.
)

REM Setup WhatsApp
if exist "whatsapp" (
    echo Setting up WhatsApp Business...
    cd whatsapp
    call npm install
    call npm run build
    cd ..
    echo [OK] WhatsApp ready
    echo.
)

REM Check for config
set CONFIG_DIR=%APPDATA%\Claude
set CONFIG_FILE=%CONFIG_DIR%\claude_desktop_config.json

echo =============================
echo   Configuration Check
echo =============================
echo.

if exist "%CONFIG_FILE%" (
    echo [OK] Claude config found at:
    echo     %CONFIG_FILE%
) else (
    echo [WARNING] Claude config not found
    echo     Expected location: %CONFIG_FILE%
    echo.
    echo     Use the example config to create yours:
    echo     copy claude_desktop_config.example.json "%CONFIG_FILE%"
)

echo.
echo =============================
echo   Setup Complete!
echo =============================
echo.
echo Next Steps:
echo   1. Configure API credentials in claude_desktop_config.json
echo   2. Restart Claude Code
echo   3. Verify servers loaded in Claude startup logs
echo.
echo For detailed setup instructions, see:
echo   - mcp-servers\ga4\README.md
echo   - mcp-servers\sentry\README.md
echo   - mcp-servers\whatsapp\README.md
echo.

pause

@echo off
echo ========================================
echo Starting Next.js Dev Server (Low Memory Mode)
echo ========================================
echo.
echo Memory optimizations:
echo - Cache reduced to 256MB
echo - Turbopack with limited workers
echo - No source maps
echo.

REM Set Node.js memory limits
set NODE_OPTIONS=--max-old-space-size=4096

REM Clean previous build
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo Cleaned .next and cache directories
echo.
echo Starting dev server...
echo Press Ctrl+C to stop
echo.

npm run dev

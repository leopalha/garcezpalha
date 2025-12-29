@echo off
echo ========================================
echo   MANUS Agent - Iniciando em Background
echo ========================================
echo.

cd /d "%~dp0"

echo Iniciando agente em background...
start /B node manus-agent.js continuous > manus-logs.txt 2>&1

echo.
echo Agente iniciado!
echo.
echo Para ver logs: type manus-logs.txt
echo Para parar: taskkill /F /IM node.exe
echo.

pause

@echo off
echo ========================================
echo   Reiniciando MANUS Agent
echo ========================================
echo.
echo Modelo: Claude 3.7 Sonnet (Economico)
echo Custo estimado: $10-30/dia
echo.
echo Parando processos antigos...
taskkill /F /IM node.exe 2>nul

timeout /t 3

echo Limpando logs antigos...
cd /d "%~dp0"
del /Q manus.pid 2>nul
echo. > manus-logs.txt

echo.
echo Iniciando agente em background...
start /B node manus-agent.js > manus-logs.txt 2>&1

timeout /t 3

echo.
echo ========================================
echo   MANUS Agent Iniciado!
echo ========================================
echo.
echo Ver logs: type agente-autonomo\manus-logs.txt
echo Parar: taskkill /F /IM node.exe
echo.
pause

@echo off
echo ========================================
echo   MANUS Autonomous Agent - Iniciando
echo ========================================
echo.
echo Modo: Trabalho Continuo
echo Arquivo: tasks.md
echo Protocolo: Claude Code (Manus)
echo.
echo Pressione Ctrl+C para parar
echo.

cd /d "%~dp0"
node manus-agent.js continuous

pause

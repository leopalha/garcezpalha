@echo off
title MANUS Agent Monitor
color 0A

:loop
cls
echo ========================================
echo   MANUS AGENT - MONITOR EM TEMPO REAL
echo ========================================
echo.
echo Ultima atualizacao: %time%
echo.
echo === ULTIMAS 30 LINHAS DO LOG ===
echo.
type manus-logs.txt 2>nul | findstr /N "^" | findstr /R ".*:.*" | more +1000000 | tail -30
echo.
echo ========================================
echo Atualizando a cada 10 segundos...
echo Pressione Ctrl+C para parar
echo ========================================
timeout /t 10 /nobreak >nul
goto loop

@echo off
echo ========================================
echo  TESTE DAS GOOGLE APIS (Calendar + Gmail)
echo ========================================
echo.

REM Verificar se o servidor está rodando
echo [1/4] Verificando servidor...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo ERRO: Servidor nao esta rodando!
    echo Execute 'npm run dev' em outro terminal primeiro.
    pause
    exit /b 1
)
echo OK - Servidor rodando
echo.

REM Testar Google Calendar API
echo [2/4] Testando Google Calendar API...
echo.
curl -X POST http://localhost:3000/api/cron/sync-calendar ^
  -H "Authorization: Bearer garcezpalha-cron-secret-2025" ^
  -H "Content-Type: application/json" ^
  -w "\n\nStatus Code: %%{http_code}\n"
echo.
echo.

REM Testar Gmail API
echo [3/4] Testando Gmail API...
echo.
curl -X POST http://localhost:3000/api/cron/gmail-monitor ^
  -H "Authorization: Bearer garcezpalha-cron-secret-2025" ^
  -H "Content-Type: application/json" ^
  -w "\n\nStatus Code: %%{http_code}\n"
echo.
echo.

echo [4/4] Testes completos!
echo.
echo ========================================
echo  RESULTADOS ESPERADOS:
echo ========================================
echo.
echo Se configurado corretamente:
echo - Status Code: 200
echo - "success": true
echo - "synced": 0 (ou numero de eventos)
echo - "errors": 0
echo.
echo Se REFRESH TOKEN estiver invalido:
echo - "error": "Google Calendar not configured"
echo   OU
echo - Erro de autenticacao do Google
echo.
echo ========================================
pause

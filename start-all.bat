@echo off
echo Iniciando servidores...

echo.
echo ===========================================
echo  INICIANDO SERVIDOR BACKEND (Porta 5000)
echo ===========================================
start "Backend" cmd /k "node test-server.js"

echo.
echo Aguardando 3 segundos...
timeout /t 3 /nobreak > nul

echo.
echo ===========================================
echo  INICIANDO SERVIDOR FRONTEND (Porta 3000)
echo ===========================================
start "Frontend" cmd /k "node no-cache-server.js"

echo.
echo ===========================================
echo  SERVIDORES INICIADOS!
echo ===========================================
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:3000
echo  Admin:    http://localhost:3000/admin
echo ===========================================

pause
@echo off
echo ============================================
echo       INICIANDO CAPOEIRA PRO - COMPLETO
echo ============================================
echo.

REM Finalizar processos Node anteriores
echo Finalizando processos Node anteriores...
taskkill /F /IM node.exe 2>NUL

REM Aguardar um momento
timeout /t 2 /nobreak >NUL

echo.
echo Iniciando Backend Completo...
cd server
start "Backend Capoeira Pro" cmd /k "node server.js"

REM Aguardar o backend inicializar
echo Aguardando backend inicializar...
timeout /t 5 /nobreak >NUL

echo.
echo Iniciando Frontend...
cd ..
start "Frontend Capoeira Pro" cmd /k "node no-cache-server.js"

echo.
echo ============================================
echo    SERVIDORES INICIADOS COM SUCESSO!
echo ============================================
echo Backend:  http://localhost:5000/api
echo Frontend: http://localhost:3000
echo Admin:    http://localhost:3000/admin
echo ============================================
echo.
echo Pressione qualquer tecla para fechar...
pause >NUL
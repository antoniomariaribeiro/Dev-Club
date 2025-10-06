@echo off
echo 🚀 Iniciando Servidores Capoeira Pro...
echo ======================================

echo 🔧 Limpando processos Node.js existentes...
taskkill /F /IM node.exe >nul 2>&1

echo 🔥 Aguardando 3 segundos...
timeout /t 3 /nobreak >nul

echo 🔥 Iniciando Backend (Porta 5000)...
start "Backend Server" /D "C:\Users\anton\OneDrive\Documentos\Dev Club\Projetos\Capoeira-pro\server" node server.js

echo 🔥 Aguardando backend inicializar...
timeout /t 8 /nobreak >nul

echo 🎨 Iniciando Frontend (Porta 3000)...
start "Frontend Server" /D "C:\Users\anton\OneDrive\Documentos\Dev Club\Projetos\Capoeira-pro\client" npm start

echo ✅ Servidores iniciando em janelas separadas!
echo 🌐 Backend: http://localhost:5000
echo 🎯 Frontend: http://localhost:3000
echo 🥋 Admin: http://localhost:3000/painel
echo.
echo 📝 Pressione qualquer tecla para continuar...
pause >nul
@echo off
echo ========================================
echo    CAPOEIRA NACIONAL - INICIANDO SISTEMA
echo ========================================
echo.

echo 🔄 Parando processos Node existentes...
taskkill /F /IM node.exe 2>nul || echo ✅ Nenhum processo Node encontrado

echo.
echo 🚀 Iniciando servidor backend completo (porta 5000)...
echo    - APIs: Usuários, Eventos, Pagamentos, Galeria, Chat
cd /d "C:\Users\anton\OneDrive\Documentos\Dev Club\Projetos\Capoeira-pro\server"
start "🔧 Backend - Capoeira Nacional" cmd /k "node server-complete.js"

timeout /t 5 /nobreak >nul

echo.
echo ⚛️  Iniciando cliente React (porta 3000)...
echo    - Dashboard completo com chat integrado
cd /d "C:\Users\anton\OneDrive\Documentos\Dev Club\Projetos\Capoeira-pro\client"
start "⚛️  Frontend - Capoeira Nacional" cmd /k "npm start"

echo.
echo ✅ SERVIDORES INICIADOS COM SUCESSO!
echo.
echo 🌐 URLs de acesso:
echo    Backend API: http://localhost:5000
echo    Frontend:    http://localhost:3000
echo.
echo � Sistemas implementados:
echo    ✅ Inscrições de Eventos + Pagamentos Stripe
echo    ✅ Dashboard Administrativo + Gráficos
echo    ✅ Galeria de Fotos Avançada
echo    ✅ Sistema de Chat em Tempo Real
echo.
echo 👤 Login admin: admin@admin.com / admin123
echo.
echo Pressione qualquer tecla para sair...
pause >nul
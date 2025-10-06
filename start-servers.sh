#!/bin/bash

echo "🚀 Iniciando Servidores Capoeira Pro..."
echo "======================================"

# Matar processos existentes nas portas
echo "🔧 Limpando portas 3000 e 5000..."
taskkill //F //IM node.exe 2>/dev/null || true

# Aguardar um momento
sleep 2

# Iniciar servidor backend
echo "🔥 Iniciando Backend (Porta 5000)..."
cd "c:/Users/anton/OneDrive/Documentos/Dev Club/Projetos/Capoeira-pro/server"
start "Backend Server" bash -c "node server.js; read -p 'Press enter to close...'"

# Aguardar servidor inicializar
sleep 5

# Iniciar servidor frontend
echo "🎨 Iniciando Frontend (Porta 3000)..."
cd "c:/Users/anton/OneDrive/Documentos/Dev Club/Projetos/Capoeira-pro/client"
start "Frontend Server" bash -c "npm start; read -p 'Press enter to close...'"

echo "✅ Servidores iniciados!"
echo "🌐 Backend: http://localhost:5000"
echo "🎯 Frontend: http://localhost:3000"
echo "🥋 Admin: http://localhost:3000/painel"
#!/bin/bash
# Script para iniciar o sistema Capoeira Pro

echo "============================================"
echo "       INICIANDO CAPOEIRA PRO - COMPLETO"
echo "============================================"
echo

# Finalizar processos Node anteriores
echo "Finalizando processos Node anteriores..."
taskkill //F //IM node.exe 2>/dev/null || true

# Aguardar um momento
sleep 2

echo
echo "Iniciando Backend Completo..."
cd server
node server.js &
BACKEND_PID=$!

# Aguardar o backend inicializar
echo "Aguardando backend inicializar..."
sleep 5

echo
echo "Iniciando Frontend..."
cd ..
node no-cache-server.js &
FRONTEND_PID=$!

echo
echo "============================================"
echo "    SERVIDORES INICIADOS COM SUCESSO!"
echo "============================================"
echo "Backend PID:  $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo "Backend:  http://localhost:5000/api"
echo "Frontend: http://localhost:3000"
echo "Admin:    http://localhost:3000/admin"
echo "============================================"
echo

# Aguardar input do usuário para finalizar
read -p "Pressione Enter para finalizar os servidores..."

# Finalizar processos
kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true
echo "Servidores finalizados."
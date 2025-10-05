Write-Host "Iniciando servidores do projeto Capoeira Pro..." -ForegroundColor Green

# Finalizar processos Node.js existentes
Write-Host "Finalizando processos Node.js existentes..." -ForegroundColor Yellow
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# Iniciar servidor backend
Write-Host "Iniciando servidor backend (porta 5000)..." -ForegroundColor Cyan
Start-Process -FilePath "node" -ArgumentList "test-server.js" -WindowStyle Minimized
Start-Sleep -Seconds 3

# Iniciar servidor frontend
Write-Host "Iniciando servidor frontend (porta 3000)..." -ForegroundColor Cyan
Start-Process -FilePath "node" -ArgumentList "simple-frontend-server.js" -WindowStyle Minimized
Start-Sleep -Seconds 3

# Verificar se os servidores estão rodando
Write-Host "Verificando servidores..." -ForegroundColor Yellow
$backend = Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet
$frontend = Test-NetConnection -ComputerName localhost -Port 3000 -InformationLevel Quiet

if ($backend) {
    Write-Host "✅ Backend rodando na porta 5000" -ForegroundColor Green
} else {
    Write-Host "❌ Backend não está respondendo na porta 5000" -ForegroundColor Red
}

if ($frontend) {
    Write-Host "✅ Frontend rodando na porta 3000" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend não está respondendo na porta 3000" -ForegroundColor Red
}

Write-Host "`nServidores iniciados! Acesse:" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend Health Check: http://localhost:5000/health" -ForegroundColor White

Write-Host "`nPressione qualquer tecla para continuar..." -ForegroundColor Gray
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown") | Out-Null
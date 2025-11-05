# Script para configurar dominio local para Waiter Now
# Ejecutar como administrador

Write-Host "Configurando dominio local para Waiter Now..." -ForegroundColor Green

# Obtener la IP local actual
$localIP = "192.168.0.19"

Write-Host "IP local detectada: $localIP" -ForegroundColor Yellow

# Ruta del archivo hosts
$hostsPath = "C:\Windows\System32\drivers\etc\hosts"

# Verificar si ya existe la entrada
$hostsContent = Get-Content $hostsPath
$domainExists = $hostsContent | Select-String "waiter-now.local"

if (-not $domainExists) {
    Write-Host "Agregando waiter-now.local al archivo hosts..." -ForegroundColor Blue
    
    # Agregar entrada al archivo hosts
    $newEntry = "`n# Waiter Now local domain`n$localIP waiter-now.local"
    Add-Content -Path $hostsPath -Value $newEntry
    
    Write-Host "Dominio local configurado exitosamente!" -ForegroundColor Green
} else {
    Write-Host "El dominio waiter-now.local ya existe en hosts" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Ahora puedes acceder a tu aplicacion en:" -ForegroundColor Cyan
Write-Host "   http://waiter-now.local:3000" -ForegroundColor White
Write-Host ""
Write-Host "Para acceso desde moviles, tambien puedes usar:" -ForegroundColor Cyan
Write-Host "   http://$localIP:3000" -ForegroundColor White
Write-Host ""
Write-Host "Recuerda configurar Google OAuth con:" -ForegroundColor Yellow
Write-Host "   http://waiter-now.local:3000" -ForegroundColor White
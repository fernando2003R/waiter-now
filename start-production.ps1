# Script de Inicio en Producción para Waiter Now
# Este script inicia la aplicación en modo producción

param(
    [int]$BackendPort = 3001,
    [int]$FrontendPort = 8080,
    [switch]$SkipFrontend,
    [switch]$SkipBackend,
    [switch]$Background
)

Write-Host "🚀 Iniciando Waiter Now en modo producción..." -ForegroundColor Green

# Función para mostrar mensajes con colores
function Write-Step {
    param($Message, $Color = "Cyan")
    Write-Host "📋 $Message" -ForegroundColor $Color
}

function Write-Success {
    param($Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param($Message)
    Write-Host "❌ $Message" -ForegroundColor Red
}

function Write-Info {
    param($Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Yellow
}

# Verificar que estamos en el directorio correcto
if (!(Test-Path "package.json")) {
    Write-Error "Este script debe ejecutarse desde el directorio raíz del proyecto"
    exit 1
}

# Verificar que los builds existen
if (!$SkipBackend -and !(Test-Path "apps/backend/dist")) {
    Write-Error "Build del backend no encontrado. Ejecuta .\build.ps1 primero"
    exit 1
}

if (!$SkipFrontend -and !(Test-Path "apps/web/dist")) {
    Write-Error "Build del frontend no encontrado. Ejecuta .\build.ps1 primero"
    exit 1
}

try {
    # Configurar variables de entorno para producción
    Write-Step "Configurando variables de entorno para producción..."
    $env:NODE_ENV = "production"
    $env:PORT = $BackendPort
    $env:HOST = "0.0.0.0"
    Write-Success "Variables de entorno configuradas"

    # Array para almacenar los procesos iniciados
    $processes = @()

    # Iniciar backend
    if (!$SkipBackend) {
        Write-Step "Iniciando servidor backend en puerto $BackendPort..."
        Set-Location "apps/backend"
        
        if ($Background) {
            $backendProcess = Start-Process -FilePath "npm" -ArgumentList "run", "start" -PassThru -WindowStyle Minimized
            $processes += $backendProcess
            Write-Success "Backend iniciado en segundo plano (PID: $($backendProcess.Id))"
        } else {
            Write-Info "Iniciando backend en primer plano..."
            Write-Host "🌐 Backend disponible en: http://localhost:$BackendPort" -ForegroundColor Magenta
            Write-Host "🏥 Health check: http://localhost:$BackendPort/health" -ForegroundColor Magenta
            Write-Host "📚 API: http://localhost:$BackendPort/api/v1/" -ForegroundColor Magenta
            Write-Host ""
            Write-Host "Presiona Ctrl+C para detener el servidor" -ForegroundColor Gray
            npm run start
        }
        
        Set-Location "../.."
    }

    # Iniciar frontend (solo si backend está en segundo plano o se omite)
    if (!$SkipFrontend -and $Background) {
        Write-Step "Iniciando servidor frontend en puerto $FrontendPort..."
        Set-Location "apps/web/dist"
        
        $frontendProcess = Start-Process -FilePath "python" -ArgumentList "-m", "http.server", $FrontendPort -PassThru -WindowStyle Minimized
        $processes += $frontendProcess
        Write-Success "Frontend iniciado en segundo plano (PID: $($frontendProcess.Id))"
        
        Set-Location "../../.."
    }

    if ($Background -and $processes.Count -gt 0) {
        Write-Host ""
        Write-Success "🎉 Aplicación iniciada en modo producción!"
        Write-Host ""
        Write-Host "📱 Accede a la aplicación:" -ForegroundColor Yellow
        if (!$SkipBackend) {
            Write-Host "   🔧 Backend: http://localhost:$BackendPort" -ForegroundColor Cyan
            Write-Host "   🏥 Health: http://localhost:$BackendPort/health" -ForegroundColor Cyan
        }
        if (!$SkipFrontend) {
            Write-Host "   🌐 Frontend: http://localhost:$FrontendPort" -ForegroundColor Cyan
        }
        Write-Host ""
        Write-Host "🛑 Para detener los servicios:" -ForegroundColor Red
        foreach ($process in $processes) {
            Write-Host "   Stop-Process -Id $($process.Id)" -ForegroundColor Gray
        }
        Write-Host "   O ejecuta: .\stop-production.ps1" -ForegroundColor Gray
        
        # Guardar PIDs para el script de stop
        $processes | ForEach-Object { $_.Id } | Out-File -FilePath ".production-pids.txt" -Encoding UTF8
    }

} catch {
    Write-Error "Error iniciando la aplicación: $_"
    
    # Limpiar procesos si hay error
    foreach ($process in $processes) {
        try {
            Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
        } catch {
            # Ignorar errores al limpiar
        }
    }
    
    exit 1
} finally {
    # Asegurar que regresamos al directorio raíz
    if (Test-Path (Split-Path $MyInvocation.MyCommand.Path)) {
        Set-Location (Split-Path $MyInvocation.MyCommand.Path)
    }
}
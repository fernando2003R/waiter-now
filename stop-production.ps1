# Script para Detener Servicios de Producción - Waiter Now
# Este script detiene todos los servicios iniciados en modo producción

param(
    [switch]$Force,
    [switch]$Verbose
)

Write-Host "🛑 Deteniendo servicios de Waiter Now..." -ForegroundColor Yellow

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

function Write-Warning {
    param($Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

try {
    $stoppedProcesses = 0
    
    # Leer PIDs guardados si existen
    if (Test-Path ".production-pids.txt") {
        Write-Step "Deteniendo procesos guardados..."
        $pids = Get-Content ".production-pids.txt" | Where-Object { $_ -match '^\d+$' }
        
        foreach ($pid in $pids) {
            try {
                $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
                if ($process) {
                    if ($Verbose) {
                        Write-Host "   Deteniendo proceso: $($process.ProcessName) (PID: $pid)" -ForegroundColor Gray
                    }
                    
                    if ($Force) {
                        Stop-Process -Id $pid -Force
                    } else {
                        Stop-Process -Id $pid
                    }
                    $stoppedProcesses++
                    Write-Success "Proceso $pid detenido"
                } else {
                    if ($Verbose) {
                        Write-Warning "Proceso $pid ya no está ejecutándose"
                    }
                }
            } catch {
                Write-Error "Error deteniendo proceso $pid : $_"
            }
        }
        
        # Limpiar archivo de PIDs
        Remove-Item ".production-pids.txt" -ErrorAction SilentlyContinue
    }
    
    # Buscar y detener procesos relacionados con Waiter Now
    Write-Step "Buscando procesos relacionados con Waiter Now..."
    
    # Buscar procesos de Node.js que puedan ser nuestro backend
    $nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
        $_.CommandLine -like "*waiter*" -or 
        $_.CommandLine -like "*backend*" -or
        $_.CommandLine -like "*3001*"
    }
    
    foreach ($process in $nodeProcesses) {
        try {
            if ($Verbose) {
                Write-Host "   Deteniendo proceso Node.js: $($process.Id)" -ForegroundColor Gray
            }
            
            if ($Force) {
                Stop-Process -Id $process.Id -Force
            } else {
                Stop-Process -Id $process.Id
            }
            $stoppedProcesses++
            Write-Success "Proceso Node.js $($process.Id) detenido"
        } catch {
            Write-Error "Error deteniendo proceso Node.js $($process.Id): $_"
        }
    }
    
    # Buscar procesos de Python que puedan ser nuestro servidor frontend
    $pythonProcesses = Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object {
        $_.CommandLine -like "*http.server*" -or
        $_.CommandLine -like "*8080*"
    }
    
    foreach ($process in $pythonProcesses) {
        try {
            if ($Verbose) {
                Write-Host "   Deteniendo servidor HTTP Python: $($process.Id)" -ForegroundColor Gray
            }
            
            if ($Force) {
                Stop-Process -Id $process.Id -Force
            } else {
                Stop-Process -Id $process.Id
            }
            $stoppedProcesses++
            Write-Success "Servidor HTTP Python $($process.Id) detenido"
        } catch {
            Write-Error "Error deteniendo servidor HTTP Python $($process.Id): $_"
        }
    }
    
    # Verificar puertos específicos
    Write-Step "Verificando puertos 3001 y 8080..."
    
    $port3001 = netstat -ano | Select-String ":3001 " | Select-String "LISTENING"
    $port8080 = netstat -ano | Select-String ":8080 " | Select-String "LISTENING"
    
    if ($port3001) {
        Write-Warning "Puerto 3001 aún está en uso"
        if ($Verbose) {
            Write-Host "   $port3001" -ForegroundColor Gray
        }
    }
    
    if ($port8080) {
        Write-Warning "Puerto 8080 aún está en uso"
        if ($Verbose) {
            Write-Host "   $port8080" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    if ($stoppedProcesses -gt 0) {
        Write-Success "🎉 $stoppedProcesses proceso(s) detenido(s) exitosamente"
    } else {
        Write-Warning "No se encontraron procesos de Waiter Now ejecutándose"
    }
    
    Write-Host ""
    Write-Host "💡 Consejos:" -ForegroundColor Cyan
    Write-Host "   - Para iniciar nuevamente: .\start-production.ps1" -ForegroundColor Gray
    Write-Host "   - Para build completo: .\build.ps1" -ForegroundColor Gray
    Write-Host "   - Para forzar detención: .\stop-production.ps1 -Force" -ForegroundColor Gray

} catch {
    Write-Error "Error durante la detención: $_"
    exit 1
}
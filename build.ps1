# Script de Build para Waiter Now
# Este script automatiza el proceso completo de build para producción

param(
    [switch]$SkipInstall,
    [switch]$SkipBackend,
    [switch]$SkipFrontend,
    [switch]$Verbose
)

Write-Host "🚀 Iniciando proceso de build para Waiter Now..." -ForegroundColor Green

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

# Verificar que estamos en el directorio correcto
if (!(Test-Path "package.json")) {
    Write-Error "Este script debe ejecutarse desde el directorio raíz del proyecto"
    exit 1
}

try {
    # 1. Instalar dependencias si no se especifica lo contrario
    if (!$SkipInstall) {
        Write-Step "Instalando dependencias del proyecto..."
        npm install
        if ($LASTEXITCODE -ne 0) { throw "Error instalando dependencias raíz" }
        Write-Success "Dependencias raíz instaladas"

        Write-Step "Instalando dependencias del backend..."
        Set-Location "apps/backend"
        npm install
        if ($LASTEXITCODE -ne 0) { throw "Error instalando dependencias del backend" }
        Set-Location "../.."
        Write-Success "Dependencias del backend instaladas"

        Write-Step "Instalando dependencias del frontend..."
        Set-Location "apps/web"
        npm install
        if ($LASTEXITCODE -ne 0) { throw "Error instalando dependencias del frontend" }
        Set-Location "../.."
        Write-Success "Dependencias del frontend instaladas"
    }

    # 2. Build del backend
    if (!$SkipBackend) {
        Write-Step "Compilando backend..."
        Set-Location "apps/backend"
        npm run build
        if ($LASTEXITCODE -ne 0) { throw "Error compilando backend" }
        Set-Location "../.."
        Write-Success "Backend compilado exitosamente"
    }

    # 3. Build del frontend
    if (!$SkipFrontend) {
        Write-Step "Compilando frontend..."
        Set-Location "apps/web"
        npm run build
        if ($LASTEXITCODE -ne 0) { throw "Error compilando frontend" }
        Set-Location "../.."
        Write-Success "Frontend compilado exitosamente"
    }

    # 4. Verificar archivos de build
    Write-Step "Verificando archivos de build..."
    
    if (Test-Path "apps/backend/dist") {
        Write-Success "Build del backend encontrado en apps/backend/dist"
    } else {
        Write-Error "Build del backend no encontrado"
    }

    if (Test-Path "apps/web/dist") {
        Write-Success "Build del frontend encontrado en apps/web/dist"
        $frontendFiles = Get-ChildItem "apps/web/dist" -Recurse | Measure-Object
        Write-Host "   📁 Archivos generados: $($frontendFiles.Count)" -ForegroundColor Gray
    } else {
        Write-Error "Build del frontend no encontrado"
    }

    Write-Host ""
    Write-Success "🎉 Build completado exitosamente!"
    Write-Host "📦 Archivos listos para deployment en:" -ForegroundColor Yellow
    Write-Host "   - Backend: apps/backend/dist" -ForegroundColor Gray
    Write-Host "   - Frontend: apps/web/dist" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🚀 Para iniciar en producción, ejecuta:" -ForegroundColor Cyan
    Write-Host "   .\start-production.ps1" -ForegroundColor White

} catch {
    Write-Error "Error durante el build: $_"
    exit 1
} finally {
    # Asegurar que regresamos al directorio raíz
    Set-Location (Split-Path $MyInvocation.MyCommand.Path)
}
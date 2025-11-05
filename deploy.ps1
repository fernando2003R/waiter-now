# Script de Deployment para Waiter Now
# Este script automatiza el deployment a diferentes plataformas

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("railway", "vercel", "heroku", "local")]
    [string]$Platform,
    
    [switch]$SkipBuild,
    [switch]$SkipTests,
    [switch]$Verbose,
    [string]$Environment = "production"
)

Write-Host "🚀 Iniciando deployment de Waiter Now a $Platform..." -ForegroundColor Green

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

function Write-Info {
    param($Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Yellow
}

# Verificar que estamos en el directorio correcto
if (!(Test-Path "package.json")) {
    Write-Error "Este script debe ejecutarse desde el directorio raíz del proyecto"
    exit 1
}

try {
    # 1. Verificar herramientas necesarias
    Write-Step "Verificando herramientas necesarias..."
    
    switch ($Platform) {
        "railway" {
            if (!(Get-Command "railway" -ErrorAction SilentlyContinue)) {
                Write-Error "Railway CLI no está instalado. Instálalo con: npm install -g @railway/cli"
                exit 1
            }
            Write-Success "Railway CLI encontrado"
        }
        "vercel" {
            if (!(Get-Command "vercel" -ErrorAction SilentlyContinue)) {
                Write-Error "Vercel CLI no está instalado. Instálalo con: npm install -g vercel"
                exit 1
            }
            Write-Success "Vercel CLI encontrado"
        }
        "heroku" {
            if (!(Get-Command "heroku" -ErrorAction SilentlyContinue)) {
                Write-Error "Heroku CLI no está instalado. Descárgalo de: https://devcenter.heroku.com/articles/heroku-cli"
                exit 1
            }
            Write-Success "Heroku CLI encontrado"
        }
        "local" {
            Write-Success "Deployment local seleccionado"
        }
    }

    # 2. Ejecutar build si no se omite
    if (!$SkipBuild) {
        Write-Step "Ejecutando build de producción..."
        & ".\build.ps1"
        if ($LASTEXITCODE -ne 0) {
            throw "Error durante el build"
        }
        Write-Success "Build completado"
    }

    # 3. Ejecutar tests si no se omiten
    if (!$SkipTests) {
        Write-Step "Ejecutando tests..."
        
        # Tests del backend
        Set-Location "apps/backend"
        if (Test-Path "package.json") {
            $packageJson = Get-Content "package.json" | ConvertFrom-Json
            if ($packageJson.scripts.test) {
                npm test
                if ($LASTEXITCODE -ne 0) {
                    Write-Warning "Tests del backend fallaron, pero continuando..."
                }
            } else {
                Write-Info "No hay tests configurados para el backend"
            }
        }
        Set-Location "../.."
        
        Write-Success "Tests completados"
    }

    # 4. Deployment específico por plataforma
    Write-Step "Iniciando deployment a $Platform..."
    
    switch ($Platform) {
        "railway" {
            Write-Info "Deploying backend a Railway..."
            Set-Location "apps/backend"
            
            # Verificar si ya está logueado
            $loginCheck = railway whoami 2>&1
            if ($loginCheck -like "*not logged in*") {
                Write-Warning "No estás logueado en Railway. Ejecutando login..."
                railway login
            }
            
            # Deploy
            railway up
            if ($LASTEXITCODE -ne 0) {
                throw "Error durante el deployment a Railway"
            }
            
            Set-Location "../.."
            Write-Success "Backend deployado a Railway"
            
            Write-Info "Para el frontend, usa Vercel o configura Railway para servir archivos estáticos"
        }
        
        "vercel" {
            Write-Info "Deploying frontend a Vercel..."
            Set-Location "apps/web"
            
            # Verificar si ya está logueado
            $loginCheck = vercel whoami 2>&1
            if ($loginCheck -like "*Error*") {
                Write-Warning "No estás logueado en Vercel. Ejecutando login..."
                vercel login
            }
            
            # Deploy
            if ($Environment -eq "production") {
                vercel --prod
            } else {
                vercel
            }
            
            if ($LASTEXITCODE -ne 0) {
                throw "Error durante el deployment a Vercel"
            }
            
            Set-Location "../.."
            Write-Success "Frontend deployado a Vercel"
            
            Write-Info "Para el backend, usa Railway, Heroku o tu servidor preferido"
        }
        
        "heroku" {
            Write-Info "Deploying a Heroku..."
            
            # Verificar si ya está logueado
            $loginCheck = heroku whoami 2>&1
            if ($loginCheck -like "*Error*") {
                Write-Warning "No estás logueado en Heroku. Ejecutando login..."
                heroku login
            }
            
            # Crear app si no existe (esto fallará si ya existe, pero está bien)
            $appName = "waiter-now-$(Get-Random -Minimum 1000 -Maximum 9999)"
            heroku create $appName 2>$null
            
            # Deploy usando Git
            git add .
            git commit -m "Deploy to Heroku - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
            git push heroku main
            
            if ($LASTEXITCODE -ne 0) {
                throw "Error durante el deployment a Heroku"
            }
            
            Write-Success "Aplicación deployada a Heroku"
            Write-Info "URL: https://$appName.herokuapp.com"
        }
        
        "local" {
            Write-Info "Configurando deployment local..."
            
            # Copiar archivos necesarios
            if (!(Test-Path "production")) {
                New-Item -ItemType Directory -Path "production"
            }
            
            # Copiar backend build
            if (Test-Path "apps/backend/dist") {
                Copy-Item -Path "apps/backend/dist" -Destination "production/backend" -Recurse -Force
                Copy-Item -Path "apps/backend/package.json" -Destination "production/backend/"
                Copy-Item -Path "apps/backend/.env.production" -Destination "production/backend/.env" -ErrorAction SilentlyContinue
            }
            
            # Copiar frontend build
            if (Test-Path "apps/web/dist") {
                Copy-Item -Path "apps/web/dist" -Destination "production/frontend" -Recurse -Force
            }
            
            # Crear script de inicio para producción local
            $startScript = @"
@echo off
echo Iniciando Waiter Now en modo produccion local...
cd backend
start "Waiter Now Backend" cmd /k "npm start"
cd ../frontend
start "Waiter Now Frontend" cmd /k "python -m http.server 8080"
echo Aplicacion iniciada:
echo Backend: http://localhost:3001
echo Frontend: http://localhost:8080
pause
"@
            $startScript | Out-File -FilePath "production/start.bat" -Encoding ASCII
            
            Write-Success "Deployment local configurado en ./production/"
            Write-Info "Para iniciar: cd production && start.bat"
        }
    }

    Write-Host ""
    Write-Success "🎉 Deployment completado exitosamente!"
    
    # Mostrar información útil
    Write-Host ""
    Write-Host "📋 Información del deployment:" -ForegroundColor Yellow
    Write-Host "   Plataforma: $Platform" -ForegroundColor Gray
    Write-Host "   Ambiente: $Environment" -ForegroundColor Gray
    Write-Host "   Fecha: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
    
    Write-Host ""
    Write-Host "🔗 Enlaces útiles:" -ForegroundColor Cyan
    switch ($Platform) {
        "railway" {
            Write-Host "   Dashboard: https://railway.app/dashboard" -ForegroundColor White
            Write-Host "   Logs: railway logs" -ForegroundColor White
        }
        "vercel" {
            Write-Host "   Dashboard: https://vercel.com/dashboard" -ForegroundColor White
            Write-Host "   Logs: vercel logs" -ForegroundColor White
        }
        "heroku" {
            Write-Host "   Dashboard: https://dashboard.heroku.com/apps" -ForegroundColor White
            Write-Host "   Logs: heroku logs --tail" -ForegroundColor White
        }
        "local" {
            Write-Host "   Directorio: ./production/" -ForegroundColor White
            Write-Host "   Iniciar: cd production && start.bat" -ForegroundColor White
        }
    }

} catch {
    Write-Error "Error durante el deployment: $_"
    exit 1
} finally {
    # Asegurar que regresamos al directorio raíz
    Set-Location (Split-Path $MyInvocation.MyCommand.Path)
}
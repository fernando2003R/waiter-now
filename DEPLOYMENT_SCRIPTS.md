# Scripts de Deployment - Waiter Now

Este directorio contiene scripts automatizados para el build, deployment y gestión de la aplicación Waiter Now en modo producción.

## 📋 Scripts Disponibles

### 🔨 `build.ps1` - Script de Build
Automatiza el proceso completo de build para producción.

**Uso:**
```powershell
# Build completo
.\build.ps1

# Omitir instalación de dependencias
.\build.ps1 -SkipInstall

# Omitir build del backend
.\build.ps1 -SkipBackend

# Omitir build del frontend
.\build.ps1 -SkipFrontend

# Modo verbose
.\build.ps1 -Verbose
```

**Funciones:**
- ✅ Instala dependencias del proyecto completo
- ✅ Compila el backend TypeScript
- ✅ Genera build optimizado del frontend
- ✅ Verifica la integridad de los builds generados

---

### 🚀 `start-production.ps1` - Inicio en Producción
Inicia la aplicación en modo producción con configuraciones optimizadas.

**Uso:**
```powershell
# Inicio completo en primer plano
.\start-production.ps1

# Inicio en segundo plano
.\start-production.ps1 -Background

# Personalizar puertos
.\start-production.ps1 -BackendPort 3001 -FrontendPort 8080

# Solo backend
.\start-production.ps1 -SkipFrontend

# Solo frontend
.\start-production.ps1 -SkipBackend
```

**Funciones:**
- ✅ Configura variables de entorno para producción
- ✅ Inicia backend con configuración optimizada
- ✅ Sirve frontend desde archivos estáticos
- ✅ Gestión de procesos en segundo plano
- ✅ Guarda PIDs para gestión posterior

---

### 🛑 `stop-production.ps1` - Detener Servicios
Detiene de forma segura todos los servicios de producción.

**Uso:**
```powershell
# Detención normal
.\stop-production.ps1

# Detención forzada
.\stop-production.ps1 -Force

# Modo verbose
.\stop-production.ps1 -Verbose
```

**Funciones:**
- ✅ Detiene procesos usando PIDs guardados
- ✅ Busca y detiene procesos relacionados
- ✅ Verifica liberación de puertos
- ✅ Limpieza automática de archivos temporales

---

### 🌐 `deploy.ps1` - Deployment Automatizado
Automatiza el deployment a diferentes plataformas.

**Uso:**
```powershell
# Deploy a Railway (backend)
.\deploy.ps1 -Platform railway

# Deploy a Vercel (frontend)
.\deploy.ps1 -Platform vercel

# Deploy a Heroku (fullstack)
.\deploy.ps1 -Platform heroku

# Deploy local
.\deploy.ps1 -Platform local

# Omitir build
.\deploy.ps1 -Platform vercel -SkipBuild

# Omitir tests
.\deploy.ps1 -Platform railway -SkipTests
```

**Plataformas Soportadas:**
- 🚂 **Railway**: Ideal para backend Node.js
- ▲ **Vercel**: Perfecto para frontend React
- 🟣 **Heroku**: Aplicación completa
- 💻 **Local**: Deployment en servidor local

---

## 🔧 Configuración Previa

### Requisitos del Sistema
- **PowerShell 5.0+** (Windows)
- **Node.js 18+** y npm
- **Python 3.x** (para servidor HTTP local)

### Variables de Entorno
Asegúrate de tener configurados los archivos `.env`:

**Backend (`apps/backend/.env.production`):**
```env
NODE_ENV=production
PORT=3001
HOST=0.0.0.0
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGINS=*
```

**Frontend (`apps/web/.env.production`):**
```env
VITE_NODE_ENV=production
```

### Herramientas CLI (para deployment)
```bash
# Railway CLI
npm install -g @railway/cli

# Vercel CLI
npm install -g vercel

# Heroku CLI
# Descargar de: https://devcenter.heroku.com/articles/heroku-cli
```

---

## 🚀 Flujo de Trabajo Recomendado

### 1. Desarrollo Local
```powershell
# En desarrollo, usar los comandos npm normales
cd apps/backend && npm run dev
cd apps/web && npm run dev
```

### 2. Testing de Producción Local
```powershell
# 1. Build completo
.\build.ps1

# 2. Iniciar en producción
.\start-production.ps1

# 3. Probar aplicación en:
# - Backend: http://localhost:3001
# - Frontend: http://localhost:8080

# 4. Detener servicios
.\stop-production.ps1
```

### 3. Deployment a Producción
```powershell
# Opción A: Backend en Railway + Frontend en Vercel
.\deploy.ps1 -Platform railway    # Deploy backend
.\deploy.ps1 -Platform vercel     # Deploy frontend

# Opción B: Todo en Heroku
.\deploy.ps1 -Platform heroku

# Opción C: Servidor local/VPS
.\deploy.ps1 -Platform local
```

---

## 📊 Monitoreo y Logs

### Verificar Estado de Servicios
```powershell
# Verificar procesos activos
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*python*"}

# Verificar puertos en uso
netstat -ano | Select-String ":3001|:8080"

# Health check del backend
Invoke-WebRequest http://localhost:3001/health
```

### Logs de Aplicación
```powershell
# Logs del backend (si está en primer plano)
# Se muestran directamente en la consola

# Para deployment en plataformas:
railway logs        # Railway
vercel logs         # Vercel
heroku logs --tail  # Heroku
```

---

## 🔒 Seguridad y Mejores Prácticas

### Variables de Entorno Sensibles
- ❌ **NUNCA** commitear archivos `.env` con datos reales
- ✅ Usar archivos `.env.example` como plantilla
- ✅ Configurar variables en las plataformas de deployment
- ✅ Rotar secretos regularmente

### Configuración de Producción
- ✅ `NODE_ENV=production` siempre en producción
- ✅ CORS configurado apropiadamente
- ✅ Rate limiting habilitado
- ✅ Helmet para headers de seguridad
- ✅ Logs estructurados

### Backup y Recuperación
- ✅ Backup regular de la base de datos
- ✅ Versionado de deployments
- ✅ Plan de rollback definido

---

## 🆘 Troubleshooting

### Problemas Comunes

**Error: "Puerto ya en uso"**
```powershell
# Encontrar proceso usando el puerto
netstat -ano | Select-String ":3001"
# Detener proceso específico
Stop-Process -Id <PID>
```

**Error: "Build fallido"**
```powershell
# Limpiar node_modules y reinstalar
Remove-Item -Recurse -Force node_modules, apps/*/node_modules
.\build.ps1
```

**Error: "CLI no encontrado"**
```powershell
# Verificar instalación
Get-Command railway, vercel, heroku
# Reinstalar si es necesario
npm install -g @railway/cli vercel
```

### Logs de Debug
```powershell
# Ejecutar scripts con verbose
.\build.ps1 -Verbose
.\start-production.ps1 -Verbose
.\stop-production.ps1 -Verbose
.\deploy.ps1 -Platform local -Verbose
```

---

## 📞 Soporte

Para problemas o mejoras en los scripts:
1. Verificar logs con `-Verbose`
2. Revisar configuración de variables de entorno
3. Consultar documentación de la plataforma específica
4. Crear issue en el repositorio del proyecto

---

**¡Feliz deployment! 🚀**
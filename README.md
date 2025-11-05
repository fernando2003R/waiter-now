# 🍽️ Waiter Now

**Aplicación móvil diseñada para digitalizar y simplificar la experiencia de realizar pedidos en restaurantes.**

Inspirada en las máquinas digitales de cadenas como McDonald's, Waiter Now permite a los usuarios ordenar desde su dispositivo móvil en cualquier restaurante, realizar su pedido.

## 🚀 Características Principales

- 🔐 **Autenticación segura** con Gmail OAuth 2.0 y JWT
- 📱 **App móvil** para clientes (React Native + Expo)
- 🌐 **Panel web** para restaurantes (React + Vite)
- 🍕 **Menú digital interactivo** por restaurante
- 🛒 **Carrito inteligente** con personalización de pedidos
- 💳 **Pagos digitales** seguros (tarjeta, billetera virtual, crédito)
- 📊 **Seguimiento en tiempo real** del estado del pedido
- 🔔 **Notificaciones push** sobre el estado del pedido
- 📱 **Código QR** para acceso directo desde la mesa
- 👨‍💼 **Panel de administración** para restaurantes

## 🏗️ Arquitectura del Proyecto

```
waiter-now/
├── apps/
│   ├── backend/          # API REST con Node.js + Express + TypeScript
│   ├── web/              # Panel web para restaurantes (React + Vite)
│   └── mobile/           # App móvil para clientes (React Native + Expo)
├── packages/
│   ├── shared/           # Código compartido (tipos, utilidades)
│   └── ui/               # Componentes UI reutilizables
└── docs/                 # Documentación técnica
```

## 🛠️ Stack Tecnológico

### Frontend
- **Móvil**: React Native + Expo
- **Web**: React.js + Vite + TypeScript
- **UI**: Tailwind CSS + React Native Elements

### Backend
- **API**: Node.js + Express + TypeScript
- **Base de datos**: PostgreSQL + Prisma ORM
- **Autenticación**: Google OAuth 2.0 + JWT
- **Notificaciones**: Firebase Cloud Messaging

### DevOps
- **Contenedores**: Docker + Docker Compose
- **Infraestructura**: Escalable (Docker + Kubernetes opcional)
- **CDN**: Para contenido multimedia

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- Git
- Cuenta de Firebase (para autenticación y notificaciones)

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd waiter-now
```

2. **Instalar dependencias**
```bash
npm run setup
```

3. **Configurar variables de entorno**
```bash
# Copiar archivos de ejemplo
cp apps/backend/.env.example apps/backend/.env
cp apps/web/.env.example apps/web/.env
cp apps/mobile/.env.example apps/mobile/.env

# Editar con tus configuraciones
```

4. **Configurar base de datos**
```bash
npm run db:push
```

5. **Iniciar desarrollo**
```bash
npm run dev
```

Esto iniciará:
- 🔧 Backend API en `http://localhost:3001`
- 🌐 Panel web en `http://localhost:3000`
- 📱 App móvil con Expo

## 📱 Desarrollo

### Comandos Disponibles

```bash
# Desarrollo
npm run dev                 # Inicia todos los servicios
npm run dev:backend        # Solo backend
npm run dev:web           # Solo panel web
npm run dev:mobile        # Solo app móvil

# Base de datos
npm run db:generate       # Genera cliente Prisma
npm run db:push          # Aplica cambios al schema
npm run db:studio        # Abre Prisma Studio

# Construcción
npm run build            # Construye todos los proyectos
npm run test            # Ejecuta tests
npm run lint            # Linting de código
```

## 🔐 Configuración de Autenticación

### Google OAuth 2.0

1. Crear proyecto en [Google Cloud Console](https://console.cloud.google.com/)
2. Habilitar Google+ API
3. Crear credenciales OAuth 2.0
4. Configurar en `.env`:

```env
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
```

### Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Authentication y Cloud Messaging
3. Descargar configuración y colocar en cada app

## 📊 Flujo del Usuario

1. **Acceso**: App o código QR desde la mesa
2. **Autenticación**: Gmail o registro interno
3. **Selección**: Restaurante y visualización del menú
4. **Pedido**: Personalización y carrito
5. **Pago**: Método de pago seguro
6. **Seguimiento**: Notificaciones en tiempo real
7. **Consumo**: Retiro o consumo en el local

## 🎯 Próximos Pasos

1. ✅ Finalizar prototipo visual de la app
2. 🔧 Desarrollar backend con autenticación segura
3. 🌐 Crear panel web para restaurantes
4. 📱 Implementar pagos y pruebas piloto
5. 🚀 Lanzamiento beta con restaurantes asociados

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, lee [CONTRIBUTING.md](CONTRIBUTING.md) para más detalles.

---

**Waiter Now** - Digitalizando la experiencia gastronómica 🍽️✨
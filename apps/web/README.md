# Waiter Now - Panel de Restaurantes

Panel de administración web para restaurantes construido con React, TypeScript y Vite.

## 🚀 Características

- **Dashboard interactivo** con métricas en tiempo real
- **Gestión de pedidos** con actualizaciones de estado
- **Administración del menú** con categorías y elementos
- **Analytics avanzados** con gráficos y reportes
- **Configuración completa** del restaurante y usuario
- **Autenticación segura** con JWT y Google OAuth
- **Diseño responsive** optimizado para móviles y desktop
- **Notificaciones en tiempo real** para nuevos pedidos

## 🛠️ Tecnologías

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **React Query** - Gestión de estado del servidor
- **React Hook Form** - Manejo de formularios
- **Tailwind CSS** - Framework de CSS
- **Lucide React** - Iconos
- **Recharts** - Gráficos y visualizaciones
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificaciones

## 📦 Instalación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```
   
   Edita el archivo `.env` con tus configuraciones:
   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_GOOGLE_CLIENT_ID=tu_google_client_id
   # ... otras variables
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

## 🏗️ Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta ESLint
- `npm run type-check` - Verifica tipos de TypeScript

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI básicos
│   ├── Layout.tsx      # Layout principal
│   └── ProtectedRoute.tsx
├── pages/              # Páginas de la aplicación
│   ├── Dashboard.tsx   # Panel principal
│   ├── Orders.tsx      # Gestión de pedidos
│   ├── Menu.tsx        # Administración del menú
│   ├── Analytics.tsx   # Analytics y reportes
│   ├── Settings.tsx    # Configuración
│   └── Login.tsx       # Página de login
├── hooks/              # Hooks personalizados
│   └── useAuth.ts      # Hook de autenticación
├── lib/                # Utilidades y configuración
│   ├── api.ts          # Cliente API
│   └── utils.ts        # Funciones utilitarias
├── App.tsx             # Componente principal
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales
```

## 🔐 Autenticación

La aplicación soporta dos métodos de autenticación:

1. **Email y contraseña** - Autenticación tradicional
2. **Google OAuth** - Inicio de sesión con Google

El token JWT se almacena en localStorage y se incluye automáticamente en todas las peticiones API.

## 📊 Funcionalidades Principales

### Dashboard
- Métricas de ventas en tiempo real
- Gráficos de tendencias
- Resumen de pedidos recientes
- Estadísticas de rendimiento

### Gestión de Pedidos
- Lista de pedidos con filtros
- Actualización de estados
- Tiempo estimado de preparación
- Notificaciones de nuevos pedidos

### Administración del Menú
- CRUD completo de elementos del menú
- Gestión de categorías
- Subida de imágenes
- Control de disponibilidad

### Analytics
- Reportes de ventas
- Análisis de productos populares
- Métricas de clientes
- Gráficos interactivos

### Configuración
- Información del restaurante
- Horarios de apertura
- Configuración de notificaciones
- Gestión de usuarios

## 🎨 Personalización

### Colores
Los colores se pueden personalizar en `tailwind.config.js`:

```js
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    600: '#2563eb',
    // ...
  }
}
```

### Componentes
Los componentes de UI están en `src/components/ui/` y pueden ser personalizados según las necesidades.

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Variables de Entorno de Producción
Asegúrate de configurar las variables de entorno en tu plataforma de despliegue:

- `VITE_API_URL` - URL de tu API backend
- `VITE_GOOGLE_CLIENT_ID` - ID de cliente de Google OAuth
- Otras variables según sea necesario

### Plataformas Recomendadas
- **Vercel** - Despliegue automático desde Git
- **Netlify** - Hosting estático con CI/CD
- **AWS S3 + CloudFront** - Solución escalable

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

## 🔄 Roadmap

- [ ] Integración con sistemas de pago
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Exportación de reportes
- [ ] Integración con delivery apps
- [ ] Sistema de reservas
- [ ] Chat con clientes
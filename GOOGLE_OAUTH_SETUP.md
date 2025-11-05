# Configuración de Google OAuth para Waiter Now

## Pasos para configurar Google OAuth

### 1. Crear proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google+ o Google Identity

### 2. Configurar OAuth 2.0

1. Ve a "APIs y servicios" > "Credenciales"
2. Haz clic en "Crear credenciales" > "ID de cliente de OAuth 2.0"
3. Selecciona "Aplicación web"
4. Configura los orígenes autorizados:
   - `http://localhost:3000` (frontend desarrollo)
   - `http://localhost:19006` (si usas Expo)
5. Configura las URIs de redirección autorizadas:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/login`

### 3. Configurar variables de entorno

#### Frontend (.env en apps/web/)
```env
VITE_GOOGLE_CLIENT_ID=tu_google_client_id_aqui.apps.googleusercontent.com
```

#### Backend (.env en apps/backend/)
```env
GOOGLE_CLIENT_ID=tu_google_client_id_aqui.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_google_client_secret_aqui
```

### 4. Configuración de dominio para producción

Para producción, asegúrate de agregar tu dominio real a:
- Orígenes autorizados de JavaScript
- URIs de redirección autorizadas

### 5. Verificación del dominio

Para usar Google OAuth en producción, es posible que necesites verificar tu dominio en Google Search Console.

## Notas importantes

- Las credenciales de desarrollo solo funcionarán en localhost
- Para producción necesitarás configurar un dominio verificado
- Mantén las credenciales seguras y nunca las subas al repositorio
- El GOOGLE_CLIENT_SECRET solo se usa en el backend

## Solución de problemas

### Error: "redirect_uri_mismatch"
- Verifica que las URIs de redirección estén configuradas correctamente en Google Cloud Console
- Asegúrate de que la URL coincida exactamente (incluyendo http/https)

### Error: "invalid_client"
- Verifica que el GOOGLE_CLIENT_ID sea correcto
- Asegúrate de que el proyecto esté habilitado para OAuth

### Error: "access_blocked"
- Verifica que el dominio esté autorizado en Google Cloud Console
- Para desarrollo, asegúrate de usar localhost
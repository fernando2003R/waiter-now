import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';

import { errorHandler } from '@/middleware/errorHandler';
import { notFoundHandler } from '@/middleware/notFoundHandler';
import { authRoutes } from '@/routes/auth';
import { restaurantRoutes } from '@/routes/restaurants';
import { menuRoutes } from '@/routes/menus';
import { orderRoutes } from '@/routes/orders';
import { userRoutes } from '@/routes/users';
import tableRoutes from '@/routes/tables';
import { webSocketService } from '@/services/websocket';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = parseInt(process.env['PORT'] || '3001', 10);
const API_VERSION = process.env['API_VERSION'] || 'v1';

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000'), // 15 minutos
  max: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100'), // límite de requests por IP
  message: {
    error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware de seguridad
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const corsOrigins = process.env['CORS_ORIGINS'] || 'http://localhost:3000,http://localhost:19006';
const corsOptions = {
  origin: corsOrigins === '*' ? true : corsOrigins.split(','),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Middleware general
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env['COOKIE_SECRET']));

// Rate limiting
app.use(limiter);

// Servir archivos estáticos del frontend
const frontendDistPath = path.join(__dirname, '../../web/dist');
app.use(express.static(frontendDistPath));

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env['NODE_ENV'],
    version: API_VERSION
  });
});

// API Routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/restaurants`, restaurantRoutes);
app.use(`/api/${API_VERSION}/menus`, menuRoutes);
app.use(`/api/${API_VERSION}/orders`, orderRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/tables`, tableRoutes);

// Catch-all handler: send back React's index.html file for client-side routing
app.get('*', (_req: Request, res: Response) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Middleware de manejo de errores
app.use(notFoundHandler);
app.use(errorHandler);

// Crear servidor HTTP
const server = createServer(app);

// Inicializar WebSocket
webSocketService.initialize(server);

// Iniciar servidor
const HOST = process.env['HOST'] || '0.0.0.0';
server.listen(PORT, HOST, () => {
  console.log(`
🚀 Waiter Now API iniciado exitosamente!
📍 Servidor: http://${HOST}:${PORT}
🌐 Accesible desde cualquier dispositivo en la red
🔧 Entorno: ${process.env['NODE_ENV']}
📚 API Version: ${API_VERSION}
🏥 Health Check: http://${HOST}:${PORT}/health
🔌 WebSocket: Habilitado
  `);
});

export default app;
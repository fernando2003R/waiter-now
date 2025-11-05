import { PrismaClient } from '@prisma/client';

// Crear una instancia global de PrismaClient con tipos explícitos
declare global {
  var __prisma: PrismaClient | undefined;
}

// Singleton pattern para evitar múltiples conexiones en desarrollo
const prisma = globalThis.__prisma || new PrismaClient({
  log: process.env['NODE_ENV'] === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env['NODE_ENV'] === 'development') {
  globalThis.__prisma = prisma;
}

export { prisma };
export default prisma;
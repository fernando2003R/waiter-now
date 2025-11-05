import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Error interno del servidor';
  let details: any = undefined;

  // Error personalizado de la aplicación
  if ('statusCode' in error && typeof (error as any).statusCode === 'number') {
    statusCode = (error as any).statusCode;
    message = error.message;
  }
  
  // Errores de Prisma
  else if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        statusCode = 409;
        message = 'Ya existe un registro con estos datos únicos';
        details = { field: error.meta?.['target'] };
        break;
      case 'P2025':
        statusCode = 404;
        message = 'Registro no encontrado';
        break;
      case 'P2003':
        statusCode = 400;
        message = 'Violación de restricción de clave foránea';
        break;
      default:
        statusCode = 400;
        message = 'Error en la base de datos';
    }
  }
  
  // Errores de validación de Prisma
  else if (error instanceof PrismaClientValidationError) {
    statusCode = 400;
    message = 'Datos de entrada inválidos';
  }
  
  // Errores de JWT
  else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido';
  }
  else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado';
  }
  
  // Errores de validación de Express Validator
  else if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Datos de entrada inválidos';
  }

  // Log del error en desarrollo
  if (process.env['NODE_ENV'] === 'development') {
    console.error('🚨 Error:', {
      message: error.message,
      stack: error.stack,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params,
      query: req.query
    });
  }

  // Respuesta del error
  const errorResponse: any = {
    success: false,
    error: {
      message,
      statusCode,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method
    }
  };

  // Agregar detalles adicionales si existen
  if (details) {
    errorResponse.error.details = details;
  }

  // Agregar stack trace solo en desarrollo
  if (process.env['NODE_ENV'] === 'development') {
    errorResponse.error.stack = error.stack;
  }

  res.status(statusCode).json(errorResponse);
};

// Función para crear errores personalizados
export const createError = (message: string, statusCode: number = 500): AppError => {
  const error = new Error(message) as AppError;
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
};

// Wrapper para funciones async
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
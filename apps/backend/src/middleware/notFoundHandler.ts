import { Request, Response, NextFunction } from 'express';

export const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
  const error = {
    success: false,
    error: {
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      suggestion: 'Verifica la URL y el método HTTP'
    }
  };

  res.status(404).json(error);
};
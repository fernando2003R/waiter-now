import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import { asyncHandler } from '@/middleware/errorHandler';
import { validateRequest } from '@/middleware/validateRequest';

const router = Router();

// Validaciones
const userIdValidation = [
  param('id').isUUID().withMessage('ID de usuario inválido')
];

const updateProfileValidation = [
  body('name').optional().isString().isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
  body('phone').optional().isString().withMessage('Teléfono debe ser texto'),
  body('avatar').optional().isURL().withMessage('Avatar debe ser una URL válida')
];

// GET /api/v1/users/profile - Obtener perfil del usuario autenticado
router.get('/profile', asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implementar obtener perfil del usuario autenticado
  res.json({
    success: true,
    message: 'Perfil de usuario obtenido exitosamente',
    data: null
  });
}));

// PUT /api/v1/users/profile - Actualizar perfil del usuario
router.put('/profile', updateProfileValidation, validateRequest, asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implementar actualizar perfil del usuario
  res.json({
    success: true,
    message: 'Perfil actualizado exitosamente',
    data: null
  });
}));

// GET /api/v1/users/orders - Obtener órdenes del usuario
router.get('/orders', asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implementar obtener órdenes del usuario
  res.json({
    success: true,
    message: 'Órdenes del usuario obtenidas exitosamente',
    data: {
      orders: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
      }
    }
  });
}));

// GET /api/v1/users/:id - Obtener usuario por ID
router.get('/:id', userIdValidation, validateRequest, asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implementar obtener usuario por ID
  res.json({
    success: true,
    message: 'Usuario obtenido exitosamente',
    data: null
  });
}));

// PUT /api/v1/users/:id - Actualizar usuario por ID
router.put('/:id', userIdValidation, updateProfileValidation, validateRequest, asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implementar actualizar usuario por ID
  res.json({
    success: true,
    message: 'Usuario actualizado exitosamente',
    data: null
  });
}));

// DELETE /api/v1/users/:id - Eliminar usuario por ID
router.delete('/:id', userIdValidation, validateRequest, asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implementar eliminar usuario por ID
  res.json({
    success: true,
    message: 'Usuario eliminado exitosamente'
  });
}));

export { router as userRoutes };
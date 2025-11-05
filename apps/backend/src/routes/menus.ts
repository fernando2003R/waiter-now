import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { asyncHandler } from '@/middleware/errorHandler';
import { validateRequest } from '@/middleware/validateRequest';
import { prisma } from '@/lib/prisma';

const router = Router();

// Validaciones
const menuValidation = [
  body('name').notEmpty().withMessage('Nombre del menú requerido'),
  body('description').optional().isString(),
  body('restaurantId').isUUID().withMessage('ID de restaurante inválido')
];

// GET /api/v1/menus - Obtener todos los menús de un restaurante
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId } = req.query;
  
  // Si no se especifica restaurantId, obtener el primer restaurante activo
  let targetRestaurantId = restaurantId as string;
  
  if (!targetRestaurantId) {
    const firstRestaurant = await prisma.restaurant.findFirst({
      where: { isActive: true }
    });
    
    if (!firstRestaurant) {
      return res.status(404).json({
        success: false,
        message: 'No hay restaurantes disponibles'
      });
    }
    
    targetRestaurantId = firstRestaurant.id;
  }

  const menus = await prisma.menu.findMany({
    where: {
      restaurantId: targetRestaurantId,
      isActive: true
    },
    include: {
      categories: {
        where: { isActive: true },
        include: {
          items: {
            where: { 
              isActive: true,
              isAvailable: true 
            },
            include: {
              variants: {
                where: { isActive: true }
              }
            }
          }
        },
        orderBy: { order: 'asc' }
      },
      restaurant: {
        select: {
          id: true,
          name: true,
          description: true,
          logo: true,
          banner: true
        }
      }
    }
  });

  return res.json({
    success: true,
    message: 'Menús obtenidos exitosamente',
    data: menus
  });
}));

// POST /api/v1/menus - Crear nuevo menú
router.post('/', menuValidation, validateRequest, asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implementar crear menú
  res.json({
    success: true,
    message: 'Menú creado exitosamente',
    data: null
  });
}));

// PUT /api/v1/menus/:id - Actualizar menú
router.put('/:id', menuValidation, validateRequest, asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implementar actualizar menú
  res.json({
    success: true,
    message: 'Menú actualizado exitosamente',
    data: null
  });
}));

// GET /api/v1/menus/restaurants - Obtener restaurantes disponibles
router.get('/restaurants', asyncHandler(async (_req: Request, res: Response) => {
  const restaurants = await prisma.restaurant.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      description: true,
      logo: true,
      banner: true,
      address: true,
      phone: true,
      rating: true,
      deliveryTime: true,
      minimumOrder: true,
      workingHours: true
    },
    orderBy: { name: 'asc' }
  });

  return res.json({
    success: true,
    message: 'Restaurantes obtenidos exitosamente',
    data: restaurants
  });
}));

export { router as menuRoutes };
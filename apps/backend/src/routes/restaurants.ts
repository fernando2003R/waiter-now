import { Router, Request, Response } from 'express';
import { body, param, query } from 'express-validator';
import { asyncHandler } from '@/middleware/errorHandler';
import { validateRequest } from '@/middleware/validateRequest';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { validateCuid } from '@/utils/validation';

const router = Router();

// Tipo para restaurante con includes
type RestaurantWithIncludes = Prisma.RestaurantGetPayload<{
  include: {
    menus: {
      include: {
        categories: {
          include: {
            items: {
              include: {
                variants: true
              }
            }
          }
        }
      }
    },
    _count: {
      select: {
        reviews: true,
        orders: true
      }
    }
  }
}>;

// Validaciones
const createRestaurantValidation = [
  body('name').isString().notEmpty().withMessage('Nombre del restaurante requerido'),
  body('description').optional().isString(),
  body('address').isString().notEmpty().withMessage('Dirección requerida'),
  body('phone').isString().notEmpty().withMessage('Teléfono requerido'),
  body('email').isEmail().notEmpty().withMessage('Email válido requerido'),
  body('cuisine').optional().isString(),
  body('priceRange').optional().isIn(['$', '$$', '$$$', '$$$$']).withMessage('Rango de precios inválido'),
  body('openingHours').optional().isObject(),
  body('settings').optional().isObject()
];

const updateRestaurantValidation = [
  param('id').custom(validateCuid('ID de restaurante').custom).withMessage(validateCuid('ID de restaurante').errorMessage),
  body('name').optional().isString().notEmpty(),
  body('description').optional().isString(),
  body('address').optional().isString().notEmpty(),
  body('phone').optional().isString(),
  body('email').optional().isEmail(),
  body('cuisine').optional().isString(),
  body('priceRange').optional().isIn(['$', '$$', '$$$', '$$$$']),
  body('openingHours').optional().isObject(),
  body('settings').optional().isObject()
];

const getRestaurantsValidation = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString(),
  query('cuisine').optional().isString(),
  query('priceRange').optional().isIn(['$', '$$', '$$$', '$$$$'])
];

// POST /api/v1/restaurants - Crear restaurante
router.post('/', createRestaurantValidation, validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const {
    name,
    description,
    address,
    phone,
    email,
    openingHours
  } = req.body;

  try {
    // Verificar si ya existe un restaurante con el mismo email
    const existingRestaurant = await prisma.restaurant.findUnique({
      where: { email }
    });

    if (existingRestaurant) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un restaurante con este email'
      });
    }

    // Crear el restaurante
    const restaurant = await prisma.restaurant.create({
      data: {
        name,
        description,
        address,
        phone,
        email,
        workingHours: openingHours ? JSON.stringify(openingHours) : null,
        // Valores por defecto
        isActive: true,
        isVerified: false,
        rating: 0,
        totalReviews: 0,
        acceptsOrders: true,
        deliveryTime: 30,
        minimumOrder: 0
      }
    });

    // Crear un menú por defecto para el restaurante
    await prisma.menu.create({
      data: {
        name: 'Menú Principal',
        description: 'Menú principal del restaurante',
        restaurantId: restaurant.id,
        isActive: true
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Restaurante creado exitosamente',
      data: {
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        address: restaurant.address,
        phone: restaurant.phone,
        email: restaurant.email,
        isActive: restaurant.isActive,
        isVerified: restaurant.isVerified,
        createdAt: restaurant.createdAt
      }
    });
  } catch (error) {
    console.error('Error creating restaurant:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear el restaurante'
    });
  }
}));

// GET /api/v1/restaurants - Obtener restaurantes
router.get('/', getRestaurantsValidation, validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query['page'] as string) || 1;
  const limit = parseInt(req.query['limit'] as string) || 10;
  const search = req.query['search'] as string;

  const skip = (page - 1) * limit;

  // Construir filtros
  const where: any = {
    isActive: true,
    isVerified: true
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { address: { contains: search, mode: 'insensitive' } }
    ];
  }

  // Obtener restaurantes con paginación
  const [restaurants, total] = await Promise.all([
    prisma.restaurant.findMany({
      where,
      skip,
      take: limit,
      orderBy: [
        { rating: 'desc' },
        { totalReviews: 'desc' },
        { createdAt: 'desc' }
      ],
      include: {
        _count: {
          select: {
            reviews: true,
            orders: true
          }
        }
      }
    }),
    prisma.restaurant.count({ where })
  ]);

  const totalPages = Math.ceil(total / limit);

  // Formatear respuesta
  const formattedRestaurants = restaurants.map(restaurant => ({
    id: restaurant.id,
    name: restaurant.name,
    description: restaurant.description,
    address: restaurant.address,
    phone: restaurant.phone,
    logo: restaurant.logo,
    banner: restaurant.banner,
    rating: restaurant.rating,
    totalReviews: restaurant.totalReviews,
    deliveryTime: restaurant.deliveryTime,
    minimumOrder: restaurant.minimumOrder,
    acceptsOrders: restaurant.acceptsOrders,
    isActive: restaurant.isActive,
    isVerified: restaurant.isVerified,
    createdAt: restaurant.createdAt,
    orderCount: restaurant._count.orders
  }));

  res.json({
    success: true,
    message: 'Restaurantes obtenidos exitosamente',
    data: {
      restaurants: formattedRestaurants,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    }
  });
}));

// GET /api/v1/restaurants/:id - Obtener restaurante por ID
router.get('/:id', param('id').custom(validateCuid('ID de restaurante').custom).withMessage(validateCuid('ID de restaurante').errorMessage), validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'ID de restaurante requerido'
    });
  }

  const restaurant: RestaurantWithIncludes | null = await prisma.restaurant.findFirst({
    where: { 
      id: id as string,
      isActive: true,
      isVerified: true
    },
    include: {
      menus: {
        where: { isActive: true },
        include: {
          categories: {
            where: { isActive: true },
            orderBy: { order: 'asc' },
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
            }
          }
        }
      },
      _count: {
        select: {
          reviews: true,
          orders: true
        }
      }
    }
  });

  if (!restaurant) {
    return res.status(404).json({
      success: false,
      message: 'Restaurante no encontrado'
    });
  }

  // Formatear respuesta
  const formattedRestaurant = {
    id: restaurant.id,
    name: restaurant.name,
    description: restaurant.description,
    address: restaurant.address,
    phone: restaurant.phone,
    email: restaurant.email,
    logo: restaurant.logo,
    banner: restaurant.banner,
    rating: restaurant.rating,
    totalReviews: restaurant.totalReviews,
    deliveryTime: restaurant.deliveryTime,
    minimumOrder: restaurant.minimumOrder,
    acceptsOrders: restaurant.acceptsOrders,
    workingHours: restaurant.workingHours ? JSON.parse(restaurant.workingHours) : null,
    isActive: restaurant.isActive,
    isVerified: restaurant.isVerified,
    createdAt: restaurant.createdAt,
    orderCount: restaurant._count.orders,
    menus: restaurant.menus.map((menu) => ({
      id: menu.id,
      name: menu.name,
      description: menu.description,
      categories: menu.categories.map((category) => ({
        id: category.id,
        name: category.name,
        description: category.description,
        image: category.image,
        order: category.order,
        items: category.items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          calories: item.calories,
          ingredients: item.ingredients,
          allergens: item.allergens,
          variants: item.variants.map((variant) => ({
            id: variant.id,
            name: variant.name,
            description: variant.description,
            priceChange: variant.priceChange
          }))
        }))
      }))
    }))
  };

  return res.json({
    success: true,
    message: 'Restaurante obtenido exitosamente',
    data: formattedRestaurant
  });
}));

// PUT /api/v1/restaurants/:id - Actualizar restaurante
router.put('/:id', updateRestaurantValidation, validateRequest, asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implementar actualizar restaurante
  res.json({
    success: true,
    message: 'Restaurante actualizado exitosamente',
    data: null
  });
}));

// DELETE /api/v1/restaurants/:id - Eliminar restaurante
router.delete('/:id', param('id').custom(validateCuid('ID de restaurante').custom).withMessage(validateCuid('ID de restaurante').errorMessage), validateRequest, asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implementar eliminar restaurante
  res.json({
    success: true,
    message: 'Restaurante eliminado exitosamente'
  });
}));

// GET /api/v1/restaurants/:id/analytics - Obtener analytics del restaurante
router.get('/:id/analytics', param('id').custom(validateCuid('ID de restaurante').custom).withMessage(validateCuid('ID de restaurante').errorMessage), validateRequest, asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implementar analytics del restaurante
  res.json({
    success: true,
    message: 'Analytics obtenidas exitosamente',
    data: {
      totalOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      popularItems: [],
      ordersByHour: [],
      ordersByDay: []
    }
  });
}));

export { router as restaurantRoutes };
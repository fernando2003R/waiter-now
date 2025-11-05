import { Router, Request, Response } from 'express';
import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest';
import { asyncHandler } from '../utils/asyncHandler';
import { prisma } from '../lib/prisma';

const router = Router();

// Validaciones
const createTableValidation = [
  body('number').notEmpty().withMessage('El número de mesa es requerido'),
  body('capacity').isInt({ min: 1, max: 20 }).withMessage('La capacidad debe ser entre 1 y 20 personas'),
  body('section').optional().isString(),
  body('positionX').optional().isFloat(),
  body('positionY').optional().isFloat(),
  body('name').optional().isString(),
  body('notes').optional().isString()
];

const updateTableValidation = [
  param('id').isUUID().withMessage('ID de mesa inválido'),
  body('number').optional().notEmpty().withMessage('El número de mesa no puede estar vacío'),
  body('capacity').optional().isInt({ min: 1, max: 20 }).withMessage('La capacidad debe ser entre 1 y 20 personas'),
  body('status').optional().isIn(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING', 'OUT_OF_ORDER']),
  body('section').optional().isString(),
  body('positionX').optional().isFloat(),
  body('positionY').optional().isFloat(),
  body('name').optional().isString(),
  body('notes').optional().isString()
];

const createReservationValidation = [
  body('tableId').isUUID().withMessage('ID de mesa inválido'),
  body('customerName').notEmpty().withMessage('El nombre del cliente es requerido'),
  body('customerPhone').optional().isMobilePhone('es-CO'),
  body('customerEmail').optional().isEmail(),
  body('partySize').isInt({ min: 1, max: 20 }).withMessage('El tamaño del grupo debe ser entre 1 y 20 personas'),
  body('reservationDate').isISO8601().withMessage('Fecha de reserva inválida'),
  body('duration').optional().isInt({ min: 30, max: 480 }).withMessage('La duración debe ser entre 30 y 480 minutos'),
  body('notes').optional().isString()
];

// GET /api/v1/tables - Obtener todas las mesas
router.get('/', asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Obtener restaurantId del usuario autenticado
  // Por ahora, obtenemos el primer restaurante disponible
  const firstRestaurant = await prisma.restaurant.findFirst({
    where: { isActive: true }
  });
  
  if (!firstRestaurant) {
    return res.status(400).json({
      success: false,
      message: 'No hay restaurantes disponibles'
    });
  }
  
  const restaurantId = firstRestaurant.id;

  const tables = await prisma.table.findMany({
    where: {
      restaurantId,
      isActive: true
    },
    include: {
      orders: {
        where: {
          status: {
            in: ['PENDING', 'CONFIRMED', 'PREPARING']
          }
        },
        select: {
          id: true,
          orderNumber: true,
          status: true,
          customerName: true,
          estimatedTime: true,
          total: true
        }
      },
      reservations: {
        where: {
          status: 'CONFIRMED',
          reservationDate: {
            gte: new Date(),
            lte: new Date(Date.now() + 24 * 60 * 60 * 1000) // Próximas 24 horas
          }
        },
        select: {
          id: true,
          customerName: true,
          partySize: true,
          reservationDate: true,
          duration: true
        }
      }
    },
    orderBy: [
      { section: 'asc' },
      { number: 'asc' }
    ]
  });

  return res.json({
    success: true,
    message: 'Mesas obtenidas exitosamente',
    data: tables
  });
}));

// POST /api/v1/tables - Crear nueva mesa
router.post('/', createTableValidation, validateRequest, asyncHandler(async (req: Request, res: Response) => {
  // TODO: Obtener restaurantId del usuario autenticado
  // Por ahora, obtenemos el primer restaurante disponible
  const firstRestaurant = await prisma.restaurant.findFirst({
    where: { isActive: true }
  });
  
  if (!firstRestaurant) {
    return res.status(400).json({
      success: false,
      message: 'No hay restaurantes disponibles'
    });
  }
  
  const restaurantId = firstRestaurant.id;

  const { number, capacity, section, positionX, positionY, name, notes } = req.body;

  // Verificar que no exista una mesa con el mismo número
  const existingTable = await prisma.table.findUnique({
    where: {
      restaurantId_number: {
        restaurantId,
        number
      }
    }
  });

  if (existingTable) {
    return res.status(400).json({
      success: false,
      message: 'Ya existe una mesa con ese número'
    });
  }

  const table = await prisma.table.create({
    data: {
      number,
      capacity,
      section,
      positionX,
      positionY,
      name,
      notes,
      restaurantId
    }
  });

  return res.status(201).json({
    success: true,
    message: 'Mesa creada exitosamente',
    data: table
  });
}));

// PUT /api/v1/tables/:id - Actualizar mesa
router.put('/:id', updateTableValidation, validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'ID de mesa requerido'
    });
  }

  const table = await prisma.table.update({
    where: { id },
    data: updateData
  });

  return res.json({
    success: true,
    message: 'Mesa actualizada exitosamente',
    data: table
  });
}));

// DELETE /api/v1/tables/:id - Eliminar mesa (soft delete)
router.delete('/:id', param('id').isUUID(), validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'ID de mesa requerido'
    });
  }

  await prisma.table.update({
    where: { id },
    data: { isActive: false }
  });

  return res.json({
    success: true,
    message: 'Mesa eliminada exitosamente'
  });
}));

// POST /api/v1/tables/:id/status - Cambiar estado de mesa
router.post('/:id/status', [
  param('id').isUUID(),
  body('status').isIn(['AVAILABLE', 'OCCUPIED', 'RESERVED', 'CLEANING', 'OUT_OF_ORDER'])
], validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'ID de mesa requerido'
    });
  }

  const updateData: any = { status };
  if (status === 'OCCUPIED') {
    updateData.lastOccupied = new Date();
  }

  const table = await prisma.table.update({
    where: { id },
    data: updateData
  });

  return res.json({
    success: true,
    message: 'Estado de mesa actualizado exitosamente',
    data: table
  });
}));

// GET /api/v1/tables/reservations - Obtener reservas
router.get('/reservations', asyncHandler(async (req: Request, res: Response) => {
  // TODO: Obtener restaurantId del usuario autenticado
  // Por ahora, obtenemos el primer restaurante disponible
  const firstRestaurant = await prisma.restaurant.findFirst({
    where: { isActive: true }
  });
  
  if (!firstRestaurant) {
    return res.status(400).json({
      success: false,
      message: 'No hay restaurantes disponibles'
    });
  }
  
  const restaurantId = firstRestaurant.id;

  const { date, status } = req.query;
  
  const whereClause: any = {
    table: {
      restaurantId
    }
  };

  if (date) {
    const startDate = new Date(date as string);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    
    whereClause.reservationDate = {
      gte: startDate,
      lt: endDate
    };
  }

  if (status) {
    whereClause.status = status;
  }

  const reservations = await prisma.tableReservation.findMany({
    where: whereClause,
    include: {
      table: {
        select: {
          id: true,
          number: true,
          name: true,
          section: true
        }
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      reservationDate: 'asc'
    }
  });

  return res.json({
    success: true,
    message: 'Reservas obtenidas exitosamente',
    data: reservations
  });
}));

// POST /api/v1/tables/reservations - Crear reserva
router.post('/reservations', createReservationValidation, validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const { tableId, customerName, customerPhone, customerEmail, partySize, reservationDate, duration, notes } = req.body;

  // Verificar que la mesa esté disponible en esa fecha/hora
  const reservationStart = new Date(reservationDate);
  const reservationEnd = new Date(reservationStart.getTime() + (duration || 120) * 60000);

  const conflictingReservation = await prisma.tableReservation.findFirst({
    where: {
      tableId,
      status: 'CONFIRMED',
      OR: [
        {
          AND: [
            { reservationDate: { lte: reservationStart } },
            { reservationDate: { gte: new Date(reservationStart.getTime() - 120 * 60000) } }
          ]
        },
        {
          AND: [
            { reservationDate: { gte: reservationStart } },
            { reservationDate: { lte: reservationEnd } }
          ]
        }
      ]
    }
  });

  if (conflictingReservation) {
    return res.status(400).json({
      success: false,
      message: 'La mesa no está disponible en esa fecha y hora'
    });
  }

  const reservation = await prisma.tableReservation.create({
    data: {
      tableId,
      customerName,
      customerPhone,
      customerEmail,
      partySize,
      reservationDate: reservationStart,
      duration: duration || 120,
      notes
    },
    include: {
      table: {
        select: {
          number: true,
          name: true,
          section: true
        }
      }
    }
  });

  return res.status(201).json({
    success: true,
    message: 'Reserva creada exitosamente',
    data: reservation
  });
}));

export default router;
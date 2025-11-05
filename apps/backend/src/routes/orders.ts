import { Router, Request, Response } from 'express';
import { body, param, query } from 'express-validator';
import { asyncHandler } from '@/middleware/errorHandler';
import { validateRequest } from '@/middleware/validateRequest';
import { prisma } from '@/lib/prisma';
import { webSocketService } from '@/services/websocket';

// Interfaces para tipos
interface OrderItemWithItem {
  id: string;
  quantity: number;
  price: number;
  notes: string | null;
  item: {
    name: string;
    description: string | null;
  };
}

const router = Router();

// Validaciones
const createOrderValidation = [
  body('restaurantId').isString().withMessage('ID de restaurante inválido'),
  body('items').isArray({ min: 1 }).withMessage('Debe incluir al menos un item'),
  body('items.*.itemId').isString().withMessage('ID de item de menú inválido'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Cantidad debe ser mayor a 0'),
  body('items.*.price').isFloat({ min: 0 }).withMessage('Precio debe ser mayor a 0'),
  body('items.*.notes').optional().isString(),
  body('customerName').isString().withMessage('Nombre del cliente es requerido'),
  body('customerPhone').optional().isString(),
  body('tableId').optional().isString().withMessage('ID de mesa inválido'),
  body('notes').optional().isString(),
  body('paymentMethod').isIn(['card', 'cash']).withMessage('Método de pago inválido'),
  body('total').isFloat({ min: 0 }).withMessage('Total debe ser mayor a 0')
];

const updateOrderStatusValidation = [
  param('id').isString().withMessage('ID de orden inválido'),
  body('status').isIn(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED', 'COMPLETED'])
    .withMessage('Estado de orden inválido')
];

const getOrdersValidation = [
  query('restaurantId').optional().isString().withMessage('ID de restaurante inválido'),
  query('status').optional().isIn(['PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED', 'COMPLETED']),
  query('tableNumber').optional().isInt({ min: 1 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];

// POST /api/v1/orders - Crear nueva orden
router.post('/', createOrderValidation, validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const {
    restaurantId,
    items,
    customerName,
    customerPhone,
    tableId,
    notes,
    total
  } = req.body;

  try {
    // Verificar que el restaurante existe y está activo
    const restaurant = await prisma.restaurant.findFirst({
      where: { 
        id: restaurantId,
        isActive: true 
      }
    });

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurante no encontrado o no disponible'
      });
    }

    // Generar número de orden único
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Crear la orden
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: 'PENDING',
        total: parseFloat(total),
        subtotal: parseFloat(total),
        customerName,
        customerPhone: customerPhone || null,
        tableId: tableId || null,
        notes: notes || null,
        restaurantId,
        items: {
          create: items.map((item: any) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            price: parseFloat(item.price),
            notes: item.notes || null
          }))
        }
      },
      include: {
        items: {
          include: {
            item: {
              select: {
                name: true,
                description: true
              }
            }
          }
        },
        restaurant: {
          select: {
            name: true,
            phone: true,
            email: true
          }
        },
        table: {
          select: {
            id: true,
            number: true,
            name: true,
            section: true
          }
        }
      }
    });

    // Enviar notificación en tiempo real al restaurante
    const orderData = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      total: order.total,
      customerName: order.customerName,
      tableId: order.tableId,
      table: order.table,
      notes: order.notes,
      estimatedDeliveryTime: new Date(Date.now() + (restaurant.deliveryTime || 30) * 60000), // deliveryTime en minutos
      restaurant: order.restaurant,
      items: order.items.map(orderItem => ({
        id: orderItem.id,
        name: orderItem.item.name,
        description: orderItem.item.description,
        quantity: orderItem.quantity,
        price: orderItem.price,
        notes: orderItem.notes
      }))
    };

    // Notificar al restaurante sobre el nuevo pedido
    webSocketService.notifyNewOrder(restaurantId, orderData);

    return res.status(201).json({
      success: true,
      message: 'Orden creada exitosamente',
      data: orderData
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al crear la orden'
    });
  }
}));

// GET /api/v1/orders - Obtener órdenes
router.get('/', getOrdersValidation, validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const { restaurantId, status, page = 1, limit = 20 } = req.query;

  try {
    const where: any = {};
    
    // Filtrar por restaurante si se proporciona
    if (restaurantId) {
      where.restaurantId = restaurantId as string;
    }
    
    // Filtrar por estado si se proporciona
    if (status) {
      where.status = status as string;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              item: {
                select: {
                  name: true,
                  description: true,
                  price: true
                }
              }
            }
          },
          restaurant: {
            select: {
              name: true,
              phone: true,
              email: true
            }
          },
          table: {
            select: {
              id: true,
              number: true,
              name: true,
              section: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: Number(limit)
      }),
      prisma.order.count({ where })
    ]);

    return res.json({
      success: true,
      message: 'Órdenes obtenidas exitosamente',
      data: {
        orders: orders.map(order => ({
          id: order.id,
          orderNumber: order.orderNumber,
          status: order.status,
          total: order.total,
          subtotal: order.subtotal,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          tableId: order.tableId,
          table: order.table,
          notes: order.notes,
          estimatedTime: order.estimatedTime,
          completedAt: order.completedAt,
          createdAt: order.createdAt,
          restaurant: order.restaurant,
          items: order.items.map(orderItem => ({
            id: orderItem.id,
            name: orderItem.item.name,
            description: orderItem.item.description,
            quantity: orderItem.quantity,
            price: orderItem.price,
            notes: orderItem.notes
          }))
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: totalCount,
          totalPages: Math.ceil(totalCount / Number(limit))
        }
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al obtener las órdenes'
    });
  }
}));

// GET /api/v1/orders/:id - Obtener orden por ID
router.get('/:id', param('id').isUUID(), validateRequest, asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implementar obtener orden por ID
  res.json({
    success: true,
    message: 'Orden obtenida exitosamente',
    data: null
  });
}));

// PUT /api/v1/orders/:id/status - Actualizar estado de orden
router.put('/:id/status', updateOrderStatusValidation, validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, estimatedTime } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: 'ID de orden requerido'
    });
  }

  try {
    // Verificar que la orden existe
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: {
            name: true
          }
        }
      }
    });

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    // Preparar datos de actualización
    const updateData: any = {
      status,
      updatedAt: new Date()
    };

    // Si se proporciona tiempo estimado, agregarlo
    if (estimatedTime) {
      updateData.estimatedTime = new Date(estimatedTime);
    }

    // Si el estado es completado, marcar la fecha de completado
    if (status === 'COMPLETED') {
      updateData.completedAt = new Date();
    }

    // Actualizar la orden
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        items: {
          include: {
            item: {
              select: {
                name: true,
                description: true
              }
            }
          }
        },
        restaurant: {
          select: {
            name: true,
            phone: true,
            email: true
          }
        }
      }
    }) as any;

    const responseData = {
      id: updatedOrder.id,
      orderNumber: updatedOrder.orderNumber,
      status: updatedOrder.status,
      total: updatedOrder.total,
      customerName: updatedOrder.customerName,
      estimatedTime: updatedOrder.estimatedTime,
      completedAt: updatedOrder.completedAt,
      updatedAt: updatedOrder.updatedAt,
      restaurant: updatedOrder.restaurant,
      items: updatedOrder.items.map((orderItem: OrderItemWithItem) => ({
        id: orderItem.id,
        name: orderItem.item.name,
        description: orderItem.item.description,
        quantity: orderItem.quantity,
        price: orderItem.price,
        notes: orderItem.notes
      }))
    };

    // Enviar notificaciones en tiempo real
    webSocketService.notifyOrderStatusUpdate(
      updatedOrder.restaurantId,
      null, // customerId - en una implementación real, esto vendría del token de autenticación
      responseData
    );

    // Si el pedido está listo, enviar notificación especial al cliente
    if (status === 'READY') {
      webSocketService.notifyOrderReady(
        updatedOrder.restaurantId,
        null, // customerId - en una implementación real, esto vendría del token de autenticación
        responseData
      );
    }

    return res.json({
      success: true,
      message: 'Estado de orden actualizado exitosamente',
      data: responseData
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor al actualizar el estado de la orden'
    });
  }
}));

// DELETE /api/v1/orders/:id - Cancelar orden
router.delete('/:id', param('id').isUUID(), validateRequest, asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implementar cancelar orden
  res.json({
    success: true,
    message: 'Orden cancelada exitosamente'
  });
}));

export { router as orderRoutes };
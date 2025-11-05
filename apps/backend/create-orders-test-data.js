const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestOrders() {
  try {
    console.log('🔄 Creando pedidos de prueba...');

    // Obtener el restaurante existente
    const restaurant = await prisma.restaurant.findFirst();
    if (!restaurant) {
      console.log('❌ No se encontró ningún restaurante. Ejecuta create-test-data.js primero.');
      return;
    }

    console.log(`✅ Restaurante encontrado: ${restaurant.name}`);

    // Obtener una mesa existente
    const table = await prisma.table.findFirst({
      where: { restaurantId: restaurant.id }
    });

    if (!table) {
      console.log('❌ No se encontró ninguna mesa. Creando una mesa de prueba...');
      const newTable = await prisma.table.create({
        data: {
          number: 1,
          capacity: 4,
          restaurantId: restaurant.id,
          isActive: true
        }
      });
      console.log(`✅ Mesa creada: Mesa ${newTable.number}`);
    }

    const tableToUse = table || await prisma.table.findFirst({
      where: { restaurantId: restaurant.id }
    });

    // Generar timestamp único para los números de pedido
    const timestamp = Date.now();
    
    // Crear pedidos de prueba con diferentes estados
    const testOrders = [
      {
        orderNumber: `ORD-${timestamp}-001`,
        customerName: 'Juan Pérez',
        customerPhone: '+1234567890',
        customerEmail: 'juan@example.com',
        status: 'PENDING',
        total: 25.50,
        subtotal: 23.00,
        tax: 2.50,
        notes: 'Sin cebolla, por favor',
        restaurantId: restaurant.id,
        tableId: tableToUse.id
      },
      {
        orderNumber: `ORD-${timestamp}-002`,
        customerName: 'María García',
        customerPhone: '+1234567891',
        customerEmail: 'maria@example.com',
        status: 'CONFIRMED',
        total: 42.75,
        subtotal: 38.50,
        tax: 4.25,
        notes: 'Extra picante',
        estimatedTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutos desde ahora
        restaurantId: restaurant.id,
        tableId: tableToUse.id
      },
      {
        orderNumber: `ORD-${timestamp}-003`,
        customerName: 'Carlos López',
        customerPhone: '+1234567892',
        customerEmail: 'carlos@example.com',
        status: 'PREPARING',
        total: 18.25,
        subtotal: 16.50,
        tax: 1.75,
        notes: 'Para llevar',
        estimatedTime: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos desde ahora
        restaurantId: restaurant.id,
        tableId: tableToUse.id
      },
      {
        orderNumber: `ORD-${timestamp}-004`,
        customerName: 'Ana Martínez',
        customerPhone: '+1234567893',
        customerEmail: 'ana@example.com',
        status: 'READY',
        total: 35.00,
        subtotal: 31.50,
        tax: 3.50,
        notes: 'Mesa 5',
        estimatedTime: new Date(Date.now() - 5 * 60 * 1000), // Hace 5 minutos
        restaurantId: restaurant.id,
        tableId: tableToUse.id
      },
      {
        orderNumber: `ORD-${timestamp}-005`,
        customerName: 'Luis Rodríguez',
        customerPhone: '+1234567894',
        customerEmail: 'luis@example.com',
        status: 'DELIVERED',
        total: 28.90,
        subtotal: 26.00,
        tax: 2.90,
        notes: 'Entregado',
        estimatedTime: new Date(Date.now() - 30 * 60 * 1000), // Hace 30 minutos
        completedAt: new Date(Date.now() - 10 * 60 * 1000), // Completado hace 10 minutos
        restaurantId: restaurant.id,
        tableId: tableToUse.id
      }
    ];

    // Crear los pedidos
    for (const orderData of testOrders) {
      const order = await prisma.order.create({
        data: orderData
      });
      console.log(`✅ Pedido creado: ${order.customerName} - ${order.status} - $${order.total}`);
    }

    console.log('🎉 ¡Pedidos de prueba creados exitosamente!');
    console.log(`📊 Total de pedidos creados: ${testOrders.length}`);

  } catch (error) {
    console.error('❌ Error creando pedidos de prueba:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestOrders();
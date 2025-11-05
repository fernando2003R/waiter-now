const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestData() {
  try {
    // Crear categoría
    const category = await prisma.category.create({
      data: {
        name: 'Platos Principales',
        description: 'Deliciosos platos principales',
        menuId: 'cmhcxvt7w000614i1w9r1qmbp',
        order: 1,
        isActive: true
      }
    });

    console.log('Category created:', category.id);

    // Crear elemento de menú
    const item = await prisma.item.create({
      data: {
        name: 'Hamburguesa Clásica',
        description: 'Deliciosa hamburguesa con carne, lechuga, tomate y queso',
        price: 12500,
        categoryId: category.id,
        isActive: true,
        isAvailable: true,
        calories: 650,
        ingredients: 'Carne de res, pan, lechuga, tomate, queso, cebolla'
      }
    });

    console.log('Item created:', item.id);
    console.log('Test data created successfully!');
    
  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();
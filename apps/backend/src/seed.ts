import { prisma } from './lib/prisma';

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Limpiar datos existentes
  await prisma.orderItemVariant.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.itemVariant.deleteMany();
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  await prisma.menu.deleteMany();
  await prisma.userFavorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.tableReservation.deleteMany();
  await prisma.table.deleteMany();
  await prisma.qRCode.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios de ejemplo
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '+57 300 123 4567'
      }
    }),
    prisma.user.create({
      data: {
        name: 'María García',
        email: 'maria@example.com',
        phone: '+57 301 234 5678'
      }
    }),
    prisma.user.create({
      data: {
        name: 'Carlos Rodríguez',
        email: 'carlos@example.com',
        phone: '+57 302 345 6789'
      }
    })
  ]);

  // Crear restaurantes - Cadenas mundiales y locales
  const restaurants = await Promise.all([
    // McDonald's
    prisma.restaurant.create({
      data: {
        name: "McDonald's",
        description: "La cadena de comida rápida más famosa del mundo. Hamburguesas, papas fritas y más.",
        address: "Centro Comercial Santafé, Bogotá",
        phone: "+57 1 800 123 456",
        email: "info@mcdonalds.co",
        logo: "🍟",
        banner: null,
        rating: 4.2,
        totalReviews: 5420,
        deliveryTime: 25,
        minimumOrder: 12000,
        acceptsOrders: true,
        isActive: true,
        isVerified: true,
        workingHours: JSON.stringify({
          monday: { open: "06:00", close: "23:00" },
          tuesday: { open: "06:00", close: "23:00" },
          wednesday: { open: "06:00", close: "23:00" },
          thursday: { open: "06:00", close: "23:00" },
          friday: { open: "06:00", close: "24:00" },
          saturday: { open: "06:00", close: "24:00" },
          sunday: { open: "07:00", close: "23:00" }
        })
      }
    }),
    // KFC
    prisma.restaurant.create({
      data: {
        name: "KFC",
        description: "Kentucky Fried Chicken - El pollo frito más delicioso con la receta secreta del Coronel Sanders.",
        address: "Avenida 19 #104-62, Bogotá",
        phone: "+57 1 800 234 567",
        email: "info@kfc.co",
        logo: "🍗",
        banner: null,
        rating: 4.3,
        totalReviews: 3890,
        deliveryTime: 30,
        minimumOrder: 15000,
        acceptsOrders: true,
        isActive: true,
        isVerified: true,
        workingHours: JSON.stringify({
          monday: { open: "11:00", close: "22:00" },
          tuesday: { open: "11:00", close: "22:00" },
          wednesday: { open: "11:00", close: "22:00" },
          thursday: { open: "11:00", close: "22:00" },
          friday: { open: "11:00", close: "23:00" },
          saturday: { open: "11:00", close: "23:00" },
          sunday: { open: "11:00", close: "22:00" }
        })
      }
    }),
    // Burger King
    prisma.restaurant.create({
      data: {
        name: "Burger King",
        description: "Home of the Whopper. Hamburguesas a la parrilla con ese sabor único que solo Burger King puede ofrecer.",
        address: "Carrera 15 #93-07, Bogotá",
        phone: "+57 1 800 345 678",
        email: "info@burgerking.co",
        logo: "👑",
        banner: null,
        rating: 4.1,
        totalReviews: 2760,
        deliveryTime: 28,
        minimumOrder: 14000,
        acceptsOrders: true,
        isActive: true,
        isVerified: true,
        workingHours: JSON.stringify({
          monday: { open: "10:00", close: "23:00" },
          tuesday: { open: "10:00", close: "23:00" },
          wednesday: { open: "10:00", close: "23:00" },
          thursday: { open: "10:00", close: "23:00" },
          friday: { open: "10:00", close: "24:00" },
          saturday: { open: "10:00", close: "24:00" },
          sunday: { open: "10:00", close: "23:00" }
        })
      }
    }),
    // Pizza Hut
    prisma.restaurant.create({
      data: {
        name: "Pizza Hut",
        description: "La pizza más deliciosa del mundo. Masa tradicional, ingredientes frescos y ese sabor inconfundible.",
        address: "Zona Rosa, Calle 82 #12-15, Bogotá",
        phone: "+57 1 800 456 789",
        email: "info@pizzahut.co",
        logo: "🍕",
        banner: null,
        rating: 4.4,
        totalReviews: 4120,
        deliveryTime: 35,
        minimumOrder: 20000,
        acceptsOrders: true,
        isActive: true,
        isVerified: true,
        workingHours: JSON.stringify({
          monday: { open: "11:00", close: "23:00" },
          tuesday: { open: "11:00", close: "23:00" },
          wednesday: { open: "11:00", close: "23:00" },
          thursday: { open: "11:00", close: "23:00" },
          friday: { open: "11:00", close: "24:00" },
          saturday: { open: "11:00", close: "24:00" },
          sunday: { open: "11:00", close: "23:00" }
        })
      }
    }),
    // Subway
    prisma.restaurant.create({
      data: {
        name: "Subway",
        description: "Sándwiches frescos hechos a tu medida. Ingredientes frescos, pan recién horneado y opciones saludables.",
        address: "Centro Comercial Titán Plaza, Bogotá",
        phone: "+57 1 800 567 890",
        email: "info@subway.co",
        logo: "🥪",
        banner: null,
        rating: 4.0,
        totalReviews: 1980,
        deliveryTime: 20,
        minimumOrder: 10000,
        acceptsOrders: true,
        isActive: true,
        isVerified: true,
        workingHours: JSON.stringify({
          monday: { open: "07:00", close: "22:00" },
          tuesday: { open: "07:00", close: "22:00" },
          wednesday: { open: "07:00", close: "22:00" },
          thursday: { open: "07:00", close: "22:00" },
          friday: { open: "07:00", close: "23:00" },
          saturday: { open: "08:00", close: "23:00" },
          sunday: { open: "08:00", close: "22:00" }
        })
      }
    }),
    // Starbucks (mejorado)
    prisma.restaurant.create({
      data: {
        name: "Starbucks",
        description: "El mejor café del mundo. Bebidas artesanales, frappés, tés y snacks en un ambiente acogedor.",
        address: "Centro Comercial Andino, Bogotá",
        phone: "+57 1 800 678 901",
        email: "info@starbucks.co",
        logo: "☕",
        banner: null,
        rating: 4.5,
        totalReviews: 6780,
        deliveryTime: 18,
        minimumOrder: 8000,
        acceptsOrders: true,
        isActive: true,
        isVerified: true,
        workingHours: JSON.stringify({
          monday: { open: "06:00", close: "22:00" },
          tuesday: { open: "06:00", close: "22:00" },
          wednesday: { open: "06:00", close: "22:00" },
          thursday: { open: "06:00", close: "22:00" },
          friday: { open: "06:00", close: "23:00" },
          saturday: { open: "06:30", close: "23:00" },
          sunday: { open: "07:00", close: "22:00" }
        })
      }
    }),
    // Domino's Pizza
    prisma.restaurant.create({
      data: {
        name: "Domino's Pizza",
        description: "Pizza entregada en 30 minutos o menos. Especialistas en delivery con pizzas deliciosas y calientes.",
        address: "Carrera 7 #127-45, Bogotá",
        phone: "+57 1 800 789 012",
        email: "info@dominos.co",
        logo: "🍕",
        banner: null,
        rating: 4.2,
        totalReviews: 3450,
        deliveryTime: 25,
        minimumOrder: 18000,
        acceptsOrders: true,
        isActive: true,
        isVerified: true,
        workingHours: JSON.stringify({
          monday: { open: "11:00", close: "23:00" },
          tuesday: { open: "11:00", close: "23:00" },
          wednesday: { open: "11:00", close: "23:00" },
          thursday: { open: "11:00", close: "23:00" },
          friday: { open: "11:00", close: "24:00" },
          saturday: { open: "11:00", close: "24:00" },
          sunday: { open: "11:00", close: "23:00" }
        })
      }
    }),
    // Juan Valdez Café (local)
    prisma.restaurant.create({
      data: {
        name: "Juan Valdez Café",
        description: "El mejor café 100% colombiano con sabores únicos y auténticos",
        address: "Calle 93 #11-27, Bogotá",
        phone: "+57 1 234 5678",
        email: "info@juanvaldez.com",
        logo: "☕",
        banner: null,
        rating: 4.6,
        totalReviews: 1250,
        deliveryTime: 15,
        minimumOrder: 15000,
        acceptsOrders: true,
        isActive: true,
        isVerified: true,
        workingHours: JSON.stringify({
          monday: { open: "06:00", close: "22:00" },
          tuesday: { open: "06:00", close: "22:00" },
          wednesday: { open: "06:00", close: "22:00" },
          thursday: { open: "06:00", close: "22:00" },
          friday: { open: "06:00", close: "23:00" },
          saturday: { open: "07:00", close: "23:00" },
          sunday: { open: "07:00", close: "21:00" }
        })
      }
    })
  ]);

  console.log(`✅ Creados ${restaurants.length} restaurantes`);

  // Crear menús completos para cada restaurante

  // ===== McDONALD'S MENU =====
  const mcdonaldsMenu = await prisma.menu.create({
    data: {
      name: "Menú McDonald's",
      description: "Nuestro menú completo con hamburguesas, papas, bebidas y postres",
      restaurantId: restaurants[0].id
    }
  });

  const mcdonaldsCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Hamburguesas",
        description: "Nuestras famosas hamburguesas",
        order: 1,
        menuId: mcdonaldsMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Pollo",
        description: "Deliciosas opciones de pollo",
        order: 2,
        menuId: mcdonaldsMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Acompañamientos",
        description: "Papas fritas y más",
        order: 3,
        menuId: mcdonaldsMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Bebidas",
        description: "Refrescos, jugos y más",
        order: 4,
        menuId: mcdonaldsMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Postres",
        description: "Helados y postres deliciosos",
        order: 5,
        menuId: mcdonaldsMenu.id
      }
    })
  ]);

  // Items de McDonald's
  const mcdonaldsItems = await Promise.all([
    // Hamburguesas
    prisma.item.create({
      data: {
        name: "Big Mac",
        description: "Dos carnes de res, salsa especial, lechuga, queso, pepinillos, cebolla en pan con ajonjolí",
        price: 18500,
        image: "🍔",
        categoryId: mcdonaldsCategories[0].id,
        calories: 550,
        ingredients: "Carne de res, pan, queso, lechuga, cebolla, pepinillos, salsa Big Mac"
      }
    }),
    prisma.item.create({
      data: {
        name: "Cuarto de Libra",
        description: "Carne de res de cuarto de libra, queso, cebolla, pepinillos, ketchup y mostaza",
        price: 16900,
        image: "🍔",
        categoryId: mcdonaldsCategories[0].id,
        calories: 520,
        ingredients: "Carne de res, pan, queso, cebolla, pepinillos, ketchup, mostaza"
      }
    }),
    prisma.item.create({
      data: {
        name: "McDouble",
        description: "Dos carnes de res, queso, pepinillos, cebolla, ketchup y mostaza",
        price: 12900,
        image: "🍔",
        categoryId: mcdonaldsCategories[0].id,
        calories: 390,
        ingredients: "Carne de res, pan, queso, cebolla, pepinillos, ketchup, mostaza"
      }
    }),
    // Pollo
    prisma.item.create({
      data: {
        name: "McNuggets 10 piezas",
        description: "10 deliciosos nuggets de pollo dorados y crujientes",
        price: 15900,
        image: "🍗",
        categoryId: mcdonaldsCategories[1].id,
        calories: 470,
        ingredients: "Pollo, empanizado, aceite vegetal"
      }
    }),
    prisma.item.create({
      data: {
        name: "McPollo",
        description: "Pechuga de pollo empanizada, lechuga y mayonesa",
        price: 14500,
        image: "🍗",
        categoryId: mcdonaldsCategories[1].id,
        calories: 400,
        ingredients: "Pollo, pan, lechuga, mayonesa"
      }
    }),
    // Acompañamientos
    prisma.item.create({
      data: {
        name: "Papas Fritas Medianas",
        description: "Nuestras famosas papas fritas doradas",
        price: 6900,
        image: "🍟",
        categoryId: mcdonaldsCategories[2].id,
        calories: 320,
        ingredients: "Papas, aceite vegetal, sal"
      }
    }),
    prisma.item.create({
      data: {
        name: "Papas Fritas Grandes",
        description: "Porción grande de nuestras papas fritas",
        price: 8900,
        image: "🍟",
        categoryId: mcdonaldsCategories[2].id,
        calories: 510,
        ingredients: "Papas, aceite vegetal, sal"
      }
    }),
    // Bebidas
    prisma.item.create({
      data: {
        name: "Coca-Cola Mediana",
        description: "Refrescante Coca-Cola bien fría",
        price: 4900,
        image: "🥤",
        categoryId: mcdonaldsCategories[3].id,
        calories: 210,
        ingredients: "Agua carbonatada, azúcar, cafeína"
      }
    }),
    prisma.item.create({
      data: {
        name: "Jugo de Naranja",
        description: "Jugo de naranja natural",
        price: 5900,
        image: "🧃",
        categoryId: mcdonaldsCategories[3].id,
        calories: 150,
        ingredients: "Jugo de naranja concentrado, agua"
      }
    }),
    // Postres
    prisma.item.create({
      data: {
        name: "McFlurry Oreo",
        description: "Helado de vainilla con trozos de galleta Oreo",
        price: 8900,
        image: "🍦",
        categoryId: mcdonaldsCategories[4].id,
        calories: 340,
        ingredients: "Helado de vainilla, galletas Oreo"
      }
    }),
    prisma.item.create({
      data: {
        name: "Cono de Helado",
        description: "Helado suave de vainilla en cono crujiente",
        price: 3900,
        image: "🍦",
        categoryId: mcdonaldsCategories[4].id,
        calories: 200,
        ingredients: "Helado de vainilla, cono de waffle"
      }
    })
  ]);

  // ===== KFC MENU =====
  const kfcMenu = await prisma.menu.create({
    data: {
      name: "Menú KFC",
      description: "Pollo frito con la receta secreta del Coronel Sanders",
      restaurantId: restaurants[1].id
    }
  });

  const kfcCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Pollo Frito",
        description: "Nuestro famoso pollo frito",
        order: 1,
        menuId: kfcMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Combos",
        description: "Combos completos con pollo y acompañamientos",
        order: 2,
        menuId: kfcMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Acompañamientos",
        description: "Deliciosos acompañamientos",
        order: 3,
        menuId: kfcMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Bebidas",
        description: "Bebidas refrescantes",
        order: 4,
        menuId: kfcMenu.id
      }
    })
  ]);

  await Promise.all([
    // Pollo Frito
    prisma.item.create({
      data: {
        name: "2 Presas Original",
        description: "2 presas de pollo frito con la receta original del Coronel",
        price: 12900,
        image: "🍗",
        categoryId: kfcCategories[0].id,
        calories: 520,
        ingredients: "Pollo, especias secretas, harina"
      }
    }),
    prisma.item.create({
      data: {
        name: "4 Presas Original",
        description: "4 presas de pollo frito original",
        price: 24900,
        image: "🍗",
        categoryId: kfcCategories[0].id,
        calories: 1040,
        ingredients: "Pollo, especias secretas, harina"
      }
    }),
    prisma.item.create({
      data: {
        name: "Hot Wings 6 piezas",
        description: "6 alitas picantes y crujientes",
        price: 16900,
        image: "🔥",
        categoryId: kfcCategories[0].id,
        calories: 480,
        ingredients: "Alitas de pollo, salsa picante, especias"
      }
    }),
    // Combos
    prisma.item.create({
      data: {
        name: "Combo Coronel",
        description: "2 presas + papas + ensalada + bebida",
        price: 19900,
        image: "🍽️",
        categoryId: kfcCategories[1].id,
        calories: 850,
        ingredients: "Pollo, papas, ensalada de col, bebida"
      }
    }),
    prisma.item.create({
      data: {
        name: "Combo Familiar",
        description: "8 presas + 2 papas grandes + ensalada familiar",
        price: 54900,
        image: "👨‍👩‍👧‍👦",
        categoryId: kfcCategories[1].id,
        calories: 2200,
        ingredients: "Pollo, papas, ensalada de col"
      }
    }),
    // Acompañamientos
    prisma.item.create({
      data: {
        name: "Papas Caseras",
        description: "Papas cortadas en gajos con especias",
        price: 7900,
        image: "🥔",
        categoryId: kfcCategories[2].id,
        calories: 290,
        ingredients: "Papas, especias, aceite vegetal"
      }
    }),
    prisma.item.create({
      data: {
        name: "Ensalada de Col",
        description: "Fresca ensalada de col con aderezo cremoso",
        price: 5900,
        image: "🥗",
        categoryId: kfcCategories[2].id,
        calories: 150,
        ingredients: "Col, zanahoria, aderezo cremoso"
      }
    }),
    // Bebidas
    prisma.item.create({
      data: {
        name: "Pepsi 500ml",
        description: "Pepsi bien fría",
        price: 4900,
        image: "🥤",
        categoryId: kfcCategories[3].id,
        calories: 210,
        ingredients: "Agua carbonatada, azúcar"
      }
    })
  ]);

  // ===== BURGER KING MENU =====
  const burgerKingMenu = await prisma.menu.create({
    data: {
      name: "Menú Burger King",
      description: "Home of the Whopper - Hamburguesas a la parrilla",
      restaurantId: restaurants[2].id
    }
  });

  const burgerKingCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Whoppers",
        description: "Nuestras famosas Whopper",
        order: 1,
        menuId: burgerKingMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Hamburguesas",
        description: "Otras deliciosas hamburguesas",
        order: 2,
        menuId: burgerKingMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Pollo",
        description: "Opciones de pollo",
        order: 3,
        menuId: burgerKingMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Acompañamientos",
        description: "Papas y más",
        order: 4,
        menuId: burgerKingMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Bebidas",
        description: "Bebidas refrescantes",
        order: 5,
        menuId: burgerKingMenu.id
      }
    })
  ]);

  await Promise.all([
    // Whoppers
    prisma.item.create({
      data: {
        name: "Whopper",
        description: "La original: carne a la parrilla, tomate, lechuga, mayonesa, ketchup, pepinillos y cebolla",
        price: 17900,
        image: "🍔",
        categoryId: burgerKingCategories[0].id,
        calories: 660,
        ingredients: "Carne de res a la parrilla, pan, tomate, lechuga, mayonesa, ketchup, pepinillos, cebolla"
      }
    }),
    prisma.item.create({
      data: {
        name: "Whopper con Queso",
        description: "La Whopper original con queso americano",
        price: 19900,
        image: "🍔",
        categoryId: burgerKingCategories[0].id,
        calories: 740,
        ingredients: "Carne de res a la parrilla, pan, queso, tomate, lechuga, mayonesa, ketchup, pepinillos, cebolla"
      }
    }),
    prisma.item.create({
      data: {
        name: "Doble Whopper",
        description: "Dos carnes a la parrilla con todos los ingredientes de la Whopper",
        price: 24900,
        image: "🍔",
        categoryId: burgerKingCategories[0].id,
        calories: 900,
        ingredients: "Doble carne de res a la parrilla, pan, tomate, lechuga, mayonesa, ketchup, pepinillos, cebolla"
      }
    }),
    // Hamburguesas
    prisma.item.create({
      data: {
        name: "Big King",
        description: "Dos carnes, queso, lechuga, cebolla, pepinillos y salsa Big King",
        price: 16900,
        image: "🍔",
        categoryId: burgerKingCategories[1].id,
        calories: 530,
        ingredients: "Doble carne, pan, queso, lechuga, cebolla, pepinillos, salsa Big King"
      }
    }),
    prisma.item.create({
      data: {
        name: "Bacon King",
        description: "Dos carnes, queso, tocineta y salsa especial",
        price: 21900,
        image: "🥓",
        categoryId: burgerKingCategories[1].id,
        calories: 1040,
        ingredients: "Doble carne, pan, queso, tocineta, salsa especial"
      }
    }),
    // Pollo
    prisma.item.create({
      data: {
        name: "Crispy Chicken",
        description: "Pechuga de pollo crujiente con lechuga y mayonesa",
        price: 15900,
        image: "🍗",
        categoryId: burgerKingCategories[2].id,
        calories: 670,
        ingredients: "Pollo empanizado, pan, lechuga, mayonesa"
      }
    }),
    prisma.item.create({
      data: {
        name: "Nuggets 9 piezas",
        description: "9 nuggets de pollo dorados y crujientes",
        price: 14900,
        image: "🍗",
        categoryId: burgerKingCategories[2].id,
        calories: 400,
        ingredients: "Pollo, empanizado, aceite vegetal"
      }
    }),
    // Acompañamientos
    prisma.item.create({
      data: {
        name: "Papas Medianas",
        description: "Papas fritas doradas y saladas",
        price: 6900,
        image: "🍟",
        categoryId: burgerKingCategories[3].id,
        calories: 365,
        ingredients: "Papas, aceite vegetal, sal"
      }
    }),
    prisma.item.create({
      data: {
        name: "Aros de Cebolla",
        description: "Crujientes aros de cebolla empanizados",
        price: 8900,
        image: "🧅",
        categoryId: burgerKingCategories[3].id,
        calories: 320,
        ingredients: "Cebolla, empanizado, aceite vegetal"
      }
    }),
    // Bebidas
    prisma.item.create({
      data: {
        name: "Coca-Cola Mediana",
        description: "Coca-Cola bien fría",
        price: 4900,
        image: "🥤",
        categoryId: burgerKingCategories[4].id,
        calories: 210,
        ingredients: "Agua carbonatada, azúcar, cafeína"
      }
    })
  ]);

  // ===== PIZZA HUT MENU =====
  const pizzaHutMenu = await prisma.menu.create({
    data: {
      name: "Menú Pizza Hut",
      description: "Las mejores pizzas con masa tradicional e ingredientes frescos",
      restaurantId: restaurants[3].id
    }
  });

  const pizzaHutCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Pizzas Tradicionales",
        description: "Nuestras pizzas clásicas",
        order: 1,
        menuId: pizzaHutMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Pizzas Especiales",
        description: "Pizzas gourmet con ingredientes premium",
        order: 2,
        menuId: pizzaHutMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Pastas",
        description: "Deliciosas pastas italianas",
        order: 3,
        menuId: pizzaHutMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Acompañamientos",
        description: "Entradas y acompañamientos",
        order: 4,
        menuId: pizzaHutMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Bebidas",
        description: "Bebidas refrescantes",
        order: 5,
        menuId: pizzaHutMenu.id
      }
    })
  ]);

  const pizzaHutItems = await Promise.all([
    // Pizzas Tradicionales
    prisma.item.create({
      data: {
        name: "Pizza Pepperoni Personal",
        description: "Pizza personal con pepperoni y queso mozzarella",
        price: 16900,
        image: "🍕",
        categoryId: pizzaHutCategories[0].id,
        calories: 1200,
        ingredients: "Masa, salsa de tomate, queso mozzarella, pepperoni"
      }
    }),
    prisma.item.create({
      data: {
        name: "Pizza Hawaiana Mediana",
        description: "Pizza mediana con jamón, piña y queso",
        price: 28900,
        image: "🍕",
        categoryId: pizzaHutCategories[0].id,
        calories: 2100,
        ingredients: "Masa, salsa de tomate, queso mozzarella, jamón, piña"
      }
    }),
    prisma.item.create({
      data: {
        name: "Pizza Margherita Grande",
        description: "Pizza grande con tomate, albahaca fresca y mozzarella",
        price: 34900,
        image: "🍕",
        categoryId: pizzaHutCategories[0].id,
        calories: 2800,
        ingredients: "Masa, salsa de tomate, queso mozzarella, tomate, albahaca"
      }
    }),
    // Pizzas Especiales
    prisma.item.create({
      data: {
        name: "Pizza Suprema",
        description: "Pizza con pepperoni, salchicha, pimentón, cebolla, champiñones y aceitunas",
        price: 39900,
        image: "🍕",
        categoryId: pizzaHutCategories[1].id,
        calories: 3200,
        ingredients: "Masa, salsa, queso, pepperoni, salchicha, pimentón, cebolla, champiñones, aceitunas"
      }
    }),
    prisma.item.create({
      data: {
        name: "Pizza Meat Lovers",
        description: "Para los amantes de la carne: pepperoni, salchicha, jamón y tocineta",
        price: 42900,
        image: "🥓",
        categoryId: pizzaHutCategories[1].id,
        calories: 3500,
        ingredients: "Masa, salsa, queso, pepperoni, salchicha, jamón, tocineta"
      }
    }),
    // Pastas
    prisma.item.create({
      data: {
        name: "Spaghetti Bolognesa",
        description: "Spaghetti con salsa bolognesa tradicional",
        price: 18900,
        image: "🍝",
        categoryId: pizzaHutCategories[2].id,
        calories: 650,
        ingredients: "Spaghetti, carne molida, salsa de tomate, cebolla, ajo"
      }
    }),
    prisma.item.create({
      data: {
        name: "Lasagna de Carne",
        description: "Lasagna tradicional con carne y queso",
        price: 22900,
        image: "🍝",
        categoryId: pizzaHutCategories[2].id,
        calories: 780,
        ingredients: "Pasta lasagna, carne molida, queso ricotta, mozzarella, salsa"
      }
    }),
    // Acompañamientos
    prisma.item.create({
      data: {
        name: "Pan de Ajo",
        description: "Delicioso pan con ajo y mantequilla",
        price: 8900,
        image: "🥖",
        categoryId: pizzaHutCategories[3].id,
        calories: 320,
        ingredients: "Pan, ajo, mantequilla, perejil"
      }
    }),
    prisma.item.create({
      data: {
        name: "Alitas BBQ 8 piezas",
        description: "8 alitas de pollo con salsa BBQ",
        price: 19900,
        image: "🍗",
        categoryId: pizzaHutCategories[3].id,
        calories: 640,
        ingredients: "Alitas de pollo, salsa BBQ"
      }
    }),
    // Bebidas
    prisma.item.create({
      data: {
        name: "Coca-Cola 1.5L",
        description: "Coca-Cola familiar",
        price: 7900,
        image: "🥤",
        categoryId: pizzaHutCategories[4].id,
        calories: 600,
        ingredients: "Agua carbonatada, azúcar, cafeína"
      }
    })
  ]);

  // ===== SUBWAY MENU =====
  const subwayMenu = await prisma.menu.create({
    data: {
      name: "Menú Subway",
      description: "Sándwiches frescos hechos a tu medida",
      restaurantId: restaurants[4].id
    }
  });

  const subwayCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Sándwiches 15cm",
        description: "Sándwiches de 6 pulgadas",
        order: 1,
        menuId: subwayMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Sándwiches 30cm",
        description: "Sándwiches de 12 pulgadas",
        order: 2,
        menuId: subwayMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Ensaladas",
        description: "Ensaladas frescas y saludables",
        order: 3,
        menuId: subwayMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Bebidas",
        description: "Bebidas refrescantes",
        order: 4,
        menuId: subwayMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Galletas",
        description: "Deliciosas galletas recién horneadas",
        order: 5,
        menuId: subwayMenu.id
      }
    })
  ]);

  await Promise.all([
    // Sándwiches 15cm
    prisma.item.create({
      data: {
        name: "Italian B.M.T. 15cm",
        description: "Pepperoni, salami, jamón con queso y vegetales frescos",
        price: 12900,
        image: "🥪",
        categoryId: subwayCategories[0].id,
        calories: 410,
        ingredients: "Pan, pepperoni, salami, jamón, queso, lechuga, tomate, cebolla"
      }
    }),
    prisma.item.create({
      data: {
        name: "Pollo Teriyaki 15cm",
        description: "Pollo tierno con salsa teriyaki y vegetales",
        price: 13900,
        image: "🥪",
        categoryId: subwayCategories[0].id,
        calories: 370,
        ingredients: "Pan, pollo, salsa teriyaki, lechuga, tomate, pimentón"
      }
    }),
    prisma.item.create({
      data: {
        name: "Atún 15cm",
        description: "Atún fresco con mayonesa y vegetales",
        price: 11900,
        image: "🥪",
        categoryId: subwayCategories[0].id,
        calories: 480,
        ingredients: "Pan, atún, mayonesa, lechuga, tomate, cebolla"
      }
    }),
    // Sándwiches 30cm
    prisma.item.create({
      data: {
        name: "Italian B.M.T. 30cm",
        description: "Pepperoni, salami, jamón con queso y vegetales frescos - tamaño grande",
        price: 22900,
        image: "🥪",
        categoryId: subwayCategories[1].id,
        calories: 820,
        ingredients: "Pan, pepperoni, salami, jamón, queso, lechuga, tomate, cebolla"
      }
    }),
    prisma.item.create({
      data: {
        name: "Pollo Teriyaki 30cm",
        description: "Pollo tierno con salsa teriyaki y vegetales - tamaño grande",
        price: 24900,
        image: "🥪",
        categoryId: subwayCategories[1].id,
        calories: 740,
        ingredients: "Pan, pollo, salsa teriyaki, lechuga, tomate, pimentón"
      }
    }),
    // Ensaladas
    prisma.item.create({
      data: {
        name: "Ensalada de Pollo",
        description: "Ensalada fresca con pollo a la parrilla",
        price: 16900,
        image: "🥗",
        categoryId: subwayCategories[2].id,
        calories: 140,
        ingredients: "Lechuga, pollo, tomate, pepino, zanahoria, aderezo"
      }
    }),
    prisma.item.create({
      data: {
        name: "Ensalada Veggie",
        description: "Ensalada vegetariana con todos los vegetales frescos",
        price: 12900,
        image: "🥗",
        categoryId: subwayCategories[2].id,
        calories: 60,
        ingredients: "Lechuga, tomate, pepino, zanahoria, pimentón, cebolla"
      }
    }),
    // Bebidas
    prisma.item.create({
      data: {
        name: "Coca-Cola 500ml",
        description: "Coca-Cola refrescante",
        price: 4900,
        image: "🥤",
        categoryId: subwayCategories[3].id,
        calories: 210,
        ingredients: "Agua carbonatada, azúcar, cafeína"
      }
    }),
    // Galletas
    prisma.item.create({
      data: {
        name: "Galleta Chocolate Chip",
        description: "Galleta con chispas de chocolate recién horneada",
        price: 3900,
        image: "🍪",
        categoryId: subwayCategories[4].id,
        calories: 220,
        ingredients: "Harina, chocolate, mantequilla, azúcar"
      }
    })
  ]);

  // ===== STARBUCKS MENU (MEJORADO) =====
  const starbucksMenu = await prisma.menu.create({
    data: {
      name: "Menú Starbucks",
      description: "El mejor café del mundo y bebidas artesanales",
      restaurantId: restaurants[5].id
    }
  });

  const starbucksCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Cafés Calientes",
        description: "Cafés tradicionales y especiales",
        order: 1,
        menuId: starbucksMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Frappuccinos",
        description: "Bebidas frías y cremosas",
        order: 2,
        menuId: starbucksMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Tés",
        description: "Tés calientes y fríos",
        order: 3,
        menuId: starbucksMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Comida",
        description: "Sándwiches, pasteles y snacks",
        order: 4,
        menuId: starbucksMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Postres",
        description: "Deliciosos postres y pasteles",
        order: 5,
        menuId: starbucksMenu.id
      }
    })
  ]);

  const starbucksItems = await Promise.all([
    // Cafés Calientes
    prisma.item.create({
      data: {
        name: "Americano",
        description: "Espresso con agua caliente",
        price: 8900,
        image: "☕",
        categoryId: starbucksCategories[0].id,
        calories: 15,
        ingredients: "Espresso, agua caliente"
      }
    }),
    prisma.item.create({
      data: {
        name: "Latte",
        description: "Espresso con leche vaporizada",
        price: 12900,
        image: "☕",
        categoryId: starbucksCategories[0].id,
        calories: 190,
        ingredients: "Espresso, leche vaporizada"
      }
    }),
    prisma.item.create({
      data: {
        name: "Cappuccino",
        description: "Espresso con leche vaporizada y espuma",
        price: 11900,
        image: "☕",
        categoryId: starbucksCategories[0].id,
        calories: 140,
        ingredients: "Espresso, leche vaporizada, espuma de leche"
      }
    }),
    prisma.item.create({
      data: {
        name: "Caramel Macchiato",
        description: "Espresso con leche vaporizada, vainilla y caramelo",
        price: 16900,
        image: "☕",
        categoryId: starbucksCategories[0].id,
        calories: 250,
        ingredients: "Espresso, leche, jarabe de vainilla, caramelo"
      }
    }),
    // Frappuccinos
    prisma.item.create({
      data: {
        name: "Frappuccino de Caramelo",
        description: "Bebida fría con café, leche, hielo y caramelo",
        price: 18900,
        image: "🥤",
        categoryId: starbucksCategories[1].id,
        calories: 420,
        ingredients: "Café, leche, hielo, jarabe de caramelo, crema batida"
      }
    }),
    prisma.item.create({
      data: {
        name: "Frappuccino de Chocolate",
        description: "Bebida fría con café, chocolate y crema batida",
        price: 18900,
        image: "🥤",
        categoryId: starbucksCategories[1].id,
        calories: 470,
        ingredients: "Café, leche, hielo, jarabe de chocolate, crema batida"
      }
    }),
    // Tés
    prisma.item.create({
      data: {
        name: "Té Verde",
        description: "Té verde premium",
        price: 7900,
        image: "🍵",
        categoryId: starbucksCategories[2].id,
        calories: 0,
        ingredients: "Té verde, agua caliente"
      }
    }),
    prisma.item.create({
      data: {
        name: "Chai Tea Latte",
        description: "Té chai especiado con leche vaporizada",
        price: 13900,
        image: "🍵",
        categoryId: starbucksCategories[2].id,
        calories: 240,
        ingredients: "Té chai, leche vaporizada, especias"
      }
    }),
    // Comida
    prisma.item.create({
      data: {
        name: "Sándwich de Jamón y Queso",
        description: "Sándwich tostado con jamón y queso",
        price: 14900,
        image: "🥪",
        categoryId: starbucksCategories[3].id,
        calories: 380,
        ingredients: "Pan, jamón, queso, mantequilla"
      }
    }),
    prisma.item.create({
      data: {
        name: "Croissant de Almendras",
        description: "Croissant francés con almendras",
        price: 9900,
        image: "🥐",
        categoryId: starbucksCategories[3].id,
        calories: 420,
        ingredients: "Masa hojaldre, almendras, mantequilla"
      }
    }),
    // Postres
    prisma.item.create({
      data: {
        name: "Cheesecake de Frutos Rojos",
        description: "Delicioso cheesecake con frutos rojos",
        price: 12900,
        image: "🍰",
        categoryId: starbucksCategories[4].id,
        calories: 380,
        ingredients: "Queso crema, frutos rojos, galleta"
      }
    }),
    prisma.item.create({
      data: {
        name: "Muffin de Chocolate",
        description: "Muffin esponjoso con chispas de chocolate",
        price: 8900,
        image: "🧁",
        categoryId: starbucksCategories[4].id,
        calories: 420,
        ingredients: "Harina, chocolate, huevos, mantequilla"
      }
    })
  ]);

  // ===== DOMINO'S MENU =====
  const dominosMenu = await prisma.menu.create({
    data: {
      name: "Menú Domino's",
      description: "Pizza entregada en 30 minutos o menos",
      restaurantId: restaurants[6].id
    }
  });

  const dominosCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Pizzas Clásicas",
        description: "Nuestras pizzas tradicionales",
        order: 1,
        menuId: dominosMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Pizzas Especiales",
        description: "Pizzas gourmet con ingredientes especiales",
        order: 2,
        menuId: dominosMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Acompañamientos",
        description: "Entradas y acompañamientos",
        order: 3,
        menuId: dominosMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Bebidas",
        description: "Bebidas refrescantes",
        order: 4,
        menuId: dominosMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Postres",
        description: "Deliciosos postres",
        order: 5,
        menuId: dominosMenu.id
      }
    })
  ]);

  await Promise.all([
    // Pizzas Clásicas
    prisma.item.create({
      data: {
        name: "Pizza Pepperoni Mediana",
        description: "Pizza mediana con pepperoni y queso mozzarella",
        price: 24900,
        image: "🍕",
        categoryId: dominosCategories[0].id,
        calories: 1800,
        ingredients: "Masa, salsa de tomate, queso mozzarella, pepperoni"
      }
    }),
    prisma.item.create({
      data: {
        name: "Pizza Hawaiana Grande",
        description: "Pizza grande con jamón, piña y queso",
        price: 32900,
        image: "🍕",
        categoryId: dominosCategories[0].id,
        calories: 2400,
        ingredients: "Masa, salsa de tomate, queso mozzarella, jamón, piña"
      }
    }),
    // Pizzas Especiales
    prisma.item.create({
      data: {
        name: "Pizza Extravaganza",
        description: "Pizza con pepperoni, salchicha, jamón, pimentón, cebolla, champiñones y aceitunas",
        price: 38900,
        image: "🍕",
        categoryId: dominosCategories[1].id,
        calories: 2800,
        ingredients: "Masa, salsa, queso, pepperoni, salchicha, jamón, pimentón, cebolla, champiñones, aceitunas"
      }
    }),
    prisma.item.create({
      data: {
        name: "Pizza BBQ Chicken",
        description: "Pizza con pollo BBQ, cebolla roja y cilantro",
        price: 36900,
        image: "🍕",
        categoryId: dominosCategories[1].id,
        calories: 2600,
        ingredients: "Masa, salsa BBQ, queso, pollo, cebolla roja, cilantro"
      }
    }),
    // Acompañamientos
    prisma.item.create({
      data: {
        name: "Pan de Ajo con Queso",
        description: "Delicioso pan de ajo con queso derretido",
        price: 12900,
        image: "🥖",
        categoryId: dominosCategories[2].id,
        calories: 480,
        ingredients: "Pan, ajo, mantequilla, queso mozzarella"
      }
    }),
    prisma.item.create({
      data: {
        name: "Alitas Buffalo 8 piezas",
        description: "8 alitas de pollo con salsa buffalo picante",
        price: 18900,
        image: "🍗",
        categoryId: dominosCategories[2].id,
        calories: 560,
        ingredients: "Alitas de pollo, salsa buffalo"
      }
    }),
    // Bebidas
    prisma.item.create({
      data: {
        name: "Coca-Cola 2L",
        description: "Coca-Cola familiar de 2 litros",
        price: 8900,
        image: "🥤",
        categoryId: dominosCategories[3].id,
        calories: 800,
        ingredients: "Agua carbonatada, azúcar, cafeína"
      }
    }),
    // Postres
    prisma.item.create({
      data: {
        name: "Lava Cake de Chocolate",
        description: "Pastel de chocolate caliente con centro líquido",
        price: 9900,
        image: "🍰",
        categoryId: dominosCategories[4].id,
        calories: 370,
        ingredients: "Chocolate, harina, huevos, mantequilla"
      }
    })
  ]);

  // ===== JUAN VALDEZ CAFÉ MENU =====
  const juanValdezMenu = await prisma.menu.create({
    data: {
      name: "Menú Juan Valdez Café",
      description: "El mejor café 100% colombiano con sabores únicos y auténticos",
      restaurantId: restaurants[7].id
    }
  });

  const juanValdezCategories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Cafés Calientes",
        description: "Cafés tradicionales colombianos",
        order: 1,
        menuId: juanValdezMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Cafés Fríos",
        description: "Bebidas frías de café",
        order: 2,
        menuId: juanValdezMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Bebidas Especiales",
        description: "Chocolate caliente y otras bebidas",
        order: 3,
        menuId: juanValdezMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Panadería",
        description: "Panes, croissants y pasteles",
        order: 4,
        menuId: juanValdezMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Postres",
        description: "Deliciosos postres colombianos",
        order: 5,
        menuId: juanValdezMenu.id
      }
    }),
    prisma.category.create({
      data: {
        name: "Sándwiches",
        description: "Sándwiches frescos y saludables",
        order: 6,
        menuId: juanValdezMenu.id
      }
    })
  ]);

  const juanValdezItems = await Promise.all([
    // Cafés Calientes
    prisma.item.create({
      data: {
        name: "Café Americano",
        description: "Café negro tradicional, intenso y aromático",
        price: 6900,
        image: "☕",
        categoryId: juanValdezCategories[0].id,
        calories: 5,
        ingredients: "Café 100% colombiano, agua caliente"
      }
    }),
    prisma.item.create({
      data: {
        name: "Café con Leche",
        description: "Café colombiano con leche vaporizada",
        price: 8900,
        image: "☕",
        categoryId: juanValdezCategories[0].id,
        calories: 120,
        ingredients: "Café 100% colombiano, leche vaporizada"
      }
    }),
    prisma.item.create({
      data: {
        name: "Cappuccino",
        description: "Espresso con leche vaporizada y espuma de leche",
        price: 9900,
        image: "☕",
        categoryId: juanValdezCategories[0].id,
        calories: 140,
        ingredients: "Espresso colombiano, leche vaporizada, espuma de leche"
      }
    }),
    prisma.item.create({
      data: {
        name: "Latte",
        description: "Espresso suave con abundante leche vaporizada",
        price: 10900,
        image: "☕",
        categoryId: juanValdezCategories[0].id,
        calories: 190,
        ingredients: "Espresso colombiano, leche vaporizada"
      }
    }),
    prisma.item.create({
      data: {
        name: "Café Mocaccino",
        description: "Espresso con chocolate y leche vaporizada",
        price: 12900,
        image: "☕",
        categoryId: juanValdezCategories[0].id,
        calories: 290,
        ingredients: "Espresso colombiano, chocolate, leche vaporizada, crema batida"
      }
    }),
    prisma.item.create({
      data: {
        name: "Café Carajillo",
        description: "Café espresso con licor de café colombiano",
        price: 15900,
        image: "☕",
        categoryId: juanValdezCategories[0].id,
        calories: 180,
        ingredients: "Espresso colombiano, licor de café, azúcar"
      }
    }),
    // Cafés Fríos
    prisma.item.create({
      data: {
        name: "Café Frío Americano",
        description: "Café negro servido con hielo",
        price: 7900,
        image: "🧊",
        categoryId: juanValdezCategories[1].id,
        calories: 5,
        ingredients: "Café 100% colombiano, hielo"
      }
    }),
    prisma.item.create({
      data: {
        name: "Frappé de Café",
        description: "Café batido con hielo y crema",
        price: 13900,
        image: "🥤",
        categoryId: juanValdezCategories[1].id,
        calories: 320,
        ingredients: "Café colombiano, hielo, leche, crema batida, azúcar"
      }
    }),
    prisma.item.create({
      data: {
        name: "Café Granizado",
        description: "Café con hielo granizado y leche condensada",
        price: 11900,
        image: "🧊",
        categoryId: juanValdezCategories[1].id,
        calories: 250,
        ingredients: "Café colombiano, hielo granizado, leche condensada"
      }
    }),
    prisma.item.create({
      data: {
        name: "Malteada de Café",
        description: "Malteada cremosa con café colombiano",
        price: 15900,
        image: "🥤",
        categoryId: juanValdezCategories[1].id,
        calories: 420,
        ingredients: "Café colombiano, helado de vainilla, leche, crema batida"
      }
    }),
    // Bebidas Especiales
    prisma.item.create({
      data: {
        name: "Chocolate Caliente",
        description: "Chocolate colombiano tradicional",
        price: 8900,
        image: "🍫",
        categoryId: juanValdezCategories[2].id,
        calories: 280,
        ingredients: "Chocolate colombiano, leche, canela"
      }
    }),
    prisma.item.create({
      data: {
        name: "Chocolate con Queso",
        description: "Chocolate caliente con queso fresco colombiano",
        price: 12900,
        image: "🍫",
        categoryId: juanValdezCategories[2].id,
        calories: 380,
        ingredients: "Chocolate colombiano, leche, queso fresco"
      }
    }),
    prisma.item.create({
      data: {
        name: "Té Chai Latte",
        description: "Té especiado con leche vaporizada",
        price: 9900,
        image: "🍵",
        categoryId: juanValdezCategories[2].id,
        calories: 240,
        ingredients: "Té chai, leche vaporizada, especias"
      }
    }),
    prisma.item.create({
      data: {
        name: "Limonada de Coco",
        description: "Refrescante limonada con coco",
        price: 8900,
        image: "🥥",
        categoryId: juanValdezCategories[2].id,
        calories: 180,
        ingredients: "Limón, coco, agua, azúcar, hielo"
      }
    }),
    // Panadería
    prisma.item.create({
      data: {
        name: "Croissant de Mantequilla",
        description: "Croissant francés recién horneado",
        price: 6900,
        image: "🥐",
        categoryId: juanValdezCategories[3].id,
        calories: 280,
        ingredients: "Harina, mantequilla, huevos, levadura"
      }
    }),
    prisma.item.create({
      data: {
        name: "Pan de Bono",
        description: "Pan tradicional colombiano con queso",
        price: 4900,
        image: "🍞",
        categoryId: juanValdezCategories[3].id,
        calories: 220,
        ingredients: "Harina de yuca, queso, huevos, mantequilla"
      }
    }),
    prisma.item.create({
      data: {
        name: "Almojábana",
        description: "Pan dulce colombiano con queso",
        price: 5900,
        image: "🍞",
        categoryId: juanValdezCategories[3].id,
        calories: 250,
        ingredients: "Harina de maíz, queso, huevos, azúcar"
      }
    }),
    prisma.item.create({
      data: {
        name: "Muffin de Arándanos",
        description: "Muffin esponjoso con arándanos frescos",
        price: 7900,
        image: "🧁",
        categoryId: juanValdezCategories[3].id,
        calories: 320,
        ingredients: "Harina, arándanos, huevos, mantequilla, azúcar"
      }
    }),
    prisma.item.create({
      data: {
        name: "Croissant de Chocolate",
        description: "Croissant relleno de chocolate",
        price: 8900,
        image: "🥐",
        categoryId: juanValdezCategories[3].id,
        calories: 380,
        ingredients: "Harina, mantequilla, chocolate, huevos"
      }
    }),
    // Postres
    prisma.item.create({
      data: {
        name: "Tres Leches",
        description: "Pastel tradicional de tres leches",
        price: 9900,
        image: "🍰",
        categoryId: juanValdezCategories[4].id,
        calories: 420,
        ingredients: "Bizcocho, leche condensada, leche evaporada, crema de leche"
      }
    }),
    prisma.item.create({
      data: {
        name: "Flan de Café",
        description: "Flan cremoso con sabor a café colombiano",
        price: 8900,
        image: "🍮",
        categoryId: juanValdezCategories[4].id,
        calories: 280,
        ingredients: "Huevos, leche, café colombiano, azúcar, caramelo"
      }
    }),
    prisma.item.create({
      data: {
        name: "Cheesecake de Maracuyá",
        description: "Cheesecake con fruta de la pasión",
        price: 12900,
        image: "🍰",
        categoryId: juanValdezCategories[4].id,
        calories: 380,
        ingredients: "Queso crema, maracuyá, galletas, mantequilla"
      }
    }),
    prisma.item.create({
      data: {
        name: "Brownie de Chocolate",
        description: "Brownie húmedo con nueces",
        price: 7900,
        image: "🍫",
        categoryId: juanValdezCategories[4].id,
        calories: 450,
        ingredients: "Chocolate, harina, nueces, mantequilla, huevos"
      }
    }),
    // Sándwiches
    prisma.item.create({
      data: {
        name: "Sándwich de Pollo y Aguacate",
        description: "Pollo a la plancha con aguacate fresco",
        price: 14900,
        image: "🥪",
        categoryId: juanValdezCategories[5].id,
        calories: 420,
        ingredients: "Pan integral, pollo, aguacate, lechuga, tomate, mayonesa"
      }
    }),
    prisma.item.create({
      data: {
        name: "Sándwich de Jamón y Queso",
        description: "Jamón de pavo con queso derretido",
        price: 12900,
        image: "🥪",
        categoryId: juanValdezCategories[5].id,
        calories: 380,
        ingredients: "Pan, jamón de pavo, queso, lechuga, tomate"
      }
    }),
    prisma.item.create({
      data: {
        name: "Sándwich Vegetariano",
        description: "Vegetales frescos con queso crema",
        price: 11900,
        image: "🥪",
        categoryId: juanValdezCategories[5].id,
        calories: 320,
        ingredients: "Pan integral, aguacate, tomate, lechuga, pepino, queso crema"
      }
    }),
    prisma.item.create({
      data: {
        name: "Sándwich de Atún",
        description: "Atún fresco con vegetales",
        price: 13900,
        image: "🥪",
        categoryId: juanValdezCategories[5].id,
        calories: 350,
        ingredients: "Pan, atún, mayonesa, lechuga, tomate, cebolla"
      }
    })
  ]);

  // Agregar variantes para algunos items (tamaños, extras, etc.)
  await Promise.all([
    // Variantes para McDonald's Big Mac
    prisma.itemVariant.create({
      data: {
        name: "Sin pepinillos",
        description: "Big Mac sin pepinillos",
        priceChange: 0,
        itemId: mcdonaldsItems[0].id
      }
    }),
    prisma.itemVariant.create({
      data: {
        name: "Extra queso",
        description: "Big Mac con queso extra",
        priceChange: 2000,
        itemId: mcdonaldsItems[0].id
      }
    }),
    // Variantes para Starbucks Latte
    prisma.itemVariant.create({
      data: {
        name: "Tamaño Grande",
        description: "16 oz",
        priceChange: 3000,
        itemId: starbucksItems[1].id
      }
    }),
    prisma.itemVariant.create({
      data: {
        name: "Leche de almendras",
        description: "Con leche de almendras",
        priceChange: 1500,
        itemId: starbucksItems[1].id
      }
    }),
    // Variantes para Pizza Hut
    prisma.itemVariant.create({
      data: {
        name: "Masa delgada",
        description: "Pizza con masa delgada",
        priceChange: 0,
        itemId: pizzaHutItems[0].id
      }
    }),
    prisma.itemVariant.create({
      data: {
        name: "Masa gruesa",
        description: "Pizza con masa gruesa",
        priceChange: 2000,
        itemId: pizzaHutItems[0].id
      }
    }),
    // Variantes para Juan Valdez Café Americano
    prisma.itemVariant.create({
      data: {
        name: "Tamaño Grande",
        description: "12 oz",
        priceChange: 2000,
        itemId: juanValdezItems[0].id
      }
    }),
    prisma.itemVariant.create({
      data: {
        name: "Doble Shot",
        description: "Doble espresso",
        priceChange: 3000,
        itemId: juanValdezItems[0].id
      }
    }),
    // Variantes para Juan Valdez Latte
    prisma.itemVariant.create({
      data: {
        name: "Tamaño Grande",
        description: "16 oz",
        priceChange: 3000,
        itemId: juanValdezItems[3].id
      }
    }),
    prisma.itemVariant.create({
      data: {
        name: "Leche de Almendras",
        description: "Con leche de almendras",
        priceChange: 1500,
        itemId: juanValdezItems[3].id
      }
    }),
    prisma.itemVariant.create({
      data: {
        name: "Leche Deslactosada",
        description: "Con leche deslactosada",
        priceChange: 1000,
        itemId: juanValdezItems[3].id
      }
    }),
    prisma.itemVariant.create({
      data: {
        name: "Sin Azúcar",
        description: "Endulzado con stevia",
        priceChange: 0,
        itemId: juanValdezItems[3].id
      }
    }),
    // Variantes para Juan Valdez Cappuccino
    prisma.itemVariant.create({
      data: {
        name: "Tamaño Grande",
        description: "12 oz",
        priceChange: 2500,
        itemId: juanValdezItems[2].id
      }
    }),
    prisma.itemVariant.create({
      data: {
        name: "Extra Espuma",
        description: "Con espuma extra",
        priceChange: 500,
        itemId: juanValdezItems[2].id
      }
    }),
    // Variantes para Juan Valdez Frappé
    prisma.itemVariant.create({
      data: {
        name: "Con Crema Batida",
        description: "Frappé con crema batida extra",
        priceChange: 2000,
        itemId: juanValdezItems[7].id
      }
    }),
    prisma.itemVariant.create({
      data: {
        name: "Sin Azúcar",
        description: "Endulzado con stevia",
        priceChange: 0,
        itemId: juanValdezItems[7].id
      }
    })
  ]);

  // Crear algunas mesas para los restaurantes
  await Promise.all([
    // Mesas para McDonald's
    prisma.table.create({
      data: {
        number: "1",
        name: "Mesa Familiar",
        capacity: 4,
        section: "Interior",
        restaurantId: restaurants[0].id
      }
    }),
    prisma.table.create({
      data: {
        number: "2",
        name: "Mesa Ventana",
        capacity: 2,
        section: "Interior",
        restaurantId: restaurants[0].id
      }
    }),
    // Mesas para KFC
    prisma.table.create({
      data: {
        number: "A1",
        name: "Mesa Grande",
        capacity: 6,
        section: "Zona A",
        restaurantId: restaurants[1].id
      }
    }),
    // Mesas para Starbucks
    prisma.table.create({
      data: {
        number: "S1",
        name: "Mesa Sofá",
        capacity: 4,
        section: "Lounge",
        restaurantId: restaurants[5].id
      }
    }),
    prisma.table.create({
      data: {
        number: "S2",
        name: "Mesa Trabajo",
        capacity: 2,
        section: "Zona Trabajo",
        restaurantId: restaurants[5].id
      }
    }),
    // Mesas para Juan Valdez
    prisma.table.create({
      data: {
        number: "JV1",
        name: "Mesa Terraza",
        capacity: 2,
        section: "Terraza",
        restaurantId: restaurants[7].id
      }
    })
  ]);

  // Crear algunas reseñas para los nuevos restaurantes
  await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment: "¡Excelente! La Big Mac estaba perfecta y el servicio muy rápido.",
        userId: users[0].id,
        restaurantId: restaurants[0].id
      }
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: "El pollo de KFC siempre está delicioso, aunque a veces demoran un poco.",
        userId: users[1].id,
        restaurantId: restaurants[1].id
      }
    }),
    prisma.review.create({
      data: {
        rating: 5,
        comment: "La Whopper es mi hamburguesa favorita. Siempre fresca y sabrosa.",
        userId: users[2].id,
        restaurantId: restaurants[2].id
      }
    }),
    prisma.review.create({
       data: {
         rating: 4,
         comment: "Pizza Hut nunca decepciona. La pizza suprema estaba increíble.",
         userId: users[0].id,
         restaurantId: restaurants[3].id
       }
     }),
     prisma.review.create({
       data: {
         rating: 5,
         comment: "Subway siempre fresco y saludable. El Italian B.M.T. es mi favorito.",
         userId: users[1].id,
         restaurantId: restaurants[4].id
       }
     }),
     prisma.review.create({
       data: {
         rating: 5,
         comment: "Starbucks tiene el mejor café. El Caramel Macchiato es perfecto.",
         userId: users[2].id,
         restaurantId: restaurants[5].id
       }
     }),
     prisma.review.create({
       data: {
         rating: 4,
         comment: "Domino's entrega rápido y las pizzas están siempre calientes.",
         userId: users[0].id,
         restaurantId: restaurants[6].id
       }
     }),
     prisma.review.create({
       data: {
         rating: 5,
         comment: "Juan Valdez tiene el mejor café colombiano. Excelente calidad.",
         userId: users[1].id,
         restaurantId: restaurants[7].id
       }
     })
   ]);

   console.log('✅ Seed completado exitosamente!');
   console.log(`📊 Datos creados:`);
   console.log(`   - ${users.length} usuarios`);
   console.log(`   - ${restaurants.length} restaurantes`);
   console.log(`   - Menús completos con categorías e items para cada cadena`);
   console.log(`   - Mesas y reseñas de ejemplo`);
   console.log(`   - Variantes de productos`);
   console.log(`🍔 Cadenas incluidas: McDonald's, KFC, Burger King, Pizza Hut, Subway, Starbucks, Domino's, Juan Valdez`);
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { asyncHandler } from '@/middleware/errorHandler';
import { validateRequest } from '@/middleware/validateRequest';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

const router = Router();

// Validaciones
const loginValidation = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
];

const registerValidation = [
  body('name').notEmpty().withMessage('El nombre es requerido'),
  body('email').custom((value) => {
    // Permitir emails temporales para usuarios que se registran con teléfono
    if (value.endsWith('@phone.temp')) {
      return true;
    }
    // Para emails normales, validar formato
    if (!value.includes('@') || !value.includes('.')) {
      throw new Error('Email inválido');
    }
    return true;
  }).withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('phone').optional().isMobilePhone('any').withMessage('Número de teléfono inválido'),
  body('restaurantName').optional().isString().withMessage('El nombre del restaurante debe ser texto')
];

const googleAuthValidation = [
  body('token').notEmpty().withMessage('Token de Google requerido')
];

// POST /api/v1/auth/login
router.post('/login', loginValidation, validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    // Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
      return;
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Cuenta desactivada'
      });
      return;
    }

    // Verificar contraseña
    if (!(user as any).password) {
      res.status(401).json({
        success: false,
        message: 'Usuario registrado con Google OAuth. Use "Continuar con Google"'
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, (user as any).password);
    
    if (!isPasswordValid) {
      res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
      return;
    }

    // Generar JWT tokens
    const jwtSecret = process.env['JWT_SECRET'];
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no configurado');
    }

    const jwtExpiresIn = process.env['JWT_EXPIRES_IN'] || '15m';
    const jwtRefreshSecret = process.env['JWT_REFRESH_SECRET'] || jwtSecret;
    const jwtRefreshExpiresIn = process.env['JWT_REFRESH_EXPIRES_IN'] || '7d';

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: jwtExpiresIn } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      jwtRefreshSecret,
      { expiresIn: jwtRefreshExpiresIn } as jwt.SignOptions
    );

    // Respuesta sin incluir datos sensibles
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.createdAt.toISOString()
    };

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: userResponse,
        token,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}));

// POST /api/v1/auth/register
router.post('/register', registerValidation, validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;
  
  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        message: 'Ya existe un usuario con este email'
      });
      return;
    }

    // Hash de la contraseña
    const saltRounds = parseInt(process.env['BCRYPT_ROUNDS'] || '12');
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear usuario en la base de datos
    const userData = {
      name,
      email,
      password: hashedPassword,
      phone: phone || null,
    };
    
    // Nota: El frontend puede enviar restaurantName, pero se ignora por ahora 
    // ya que no está en el modelo User. En el futuro, se podría crear un restaurante asociado al usuario

    const user = await prisma.user.create({
      data: userData
    });

    // Generar JWT token
    const jwtSecret = process.env['JWT_SECRET'];
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no configurado');
    }

    const jwtExpiresIn = process.env['JWT_EXPIRES_IN'] || '15m';
    const jwtRefreshSecret = process.env['JWT_REFRESH_SECRET'] || jwtSecret;
    const jwtRefreshExpiresIn = process.env['JWT_REFRESH_EXPIRES_IN'] || '7d';

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: jwtExpiresIn } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      jwtRefreshSecret,
      { expiresIn: jwtRefreshExpiresIn } as jwt.SignOptions
    );

    // Respuesta sin incluir datos sensibles
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      createdAt: user.createdAt.toISOString()
    };

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: userResponse,
        token,
        refreshToken
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
}));

// POST /api/v1/auth/google
router.post('/google', googleAuthValidation, validateRequest, asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.body;
  
  try {
    const googleClientId = process.env['GOOGLE_CLIENT_ID'];
    
    if (!googleClientId) {
      res.status(500).json({
        success: false,
        message: 'Configuración de Google OAuth no encontrada'
      });
      return;
    }
    
    const client = new OAuth2Client(googleClientId);
    
    // Verificar el token de Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: googleClientId,
    });
    
    const payload = ticket.getPayload();
    
    if (!payload) {
      res.status(400).json({
        success: false,
        message: 'Token de Google inválido'
      });
      return;
    }
    
    const { sub: googleId, email, name, picture } = payload;
    
    if (!email || !name) {
      res.status(400).json({
        success: false,
        message: 'Información de Google incompleta'
      });
      return;
    }
    
    // TODO: Buscar o crear usuario en la base de datos
    // Por ahora simulamos la creación/búsqueda del usuario
    const mockUser = {
      id: googleId,
      name,
      email,
      role: 'user',
      phone: null,
      avatar: picture || null,
      createdAt: new Date().toISOString(),
      provider: 'google'
    };

    const mockToken = 'mock-jwt-token-google-' + Date.now();

    res.json({
      success: true,
      message: 'Autenticación con Google exitosa',
      data: {
        user: mockUser,
        token: mockToken,
        refreshToken: 'mock-refresh-token-google-' + Date.now()
      }
    });
    
  } catch (error) {
    console.error('Error en autenticación con Google:', error);
    res.status(400).json({
      success: false,
      message: 'Error al verificar token de Google'
    });
  }
}));

// POST /api/v1/auth/refresh
router.post('/refresh', asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implementar refresh token
  res.json({
    success: true,
    message: 'Refresh token endpoint - Por implementar',
    data: {
      token: null,
      refreshToken: null
    }
  });
}));

// POST /api/v1/auth/logout
router.post('/logout', asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implementar logout
  res.json({
    success: true,
    message: 'Logout exitoso'
  });
}));

// GET /api/v1/auth/me
router.get('/me', asyncHandler(async (_req: Request, res: Response) => {
  // TODO: Implementar obtener usuario actual
  res.json({
    success: true,
    message: 'User profile endpoint - Por implementar',
    data: {
      user: null
    }
  });
}));

export { router as authRoutes };
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig.js'; // Importar la clave secreta y expiración desde config

const { secret, expiresIn } = jwtConfig;

// Función para generar un token JWT usando la configuración de expiración
export const generateToken = (user) => {
  
  const payload = {
    _id: user._id,
    role: user.role,
    puede_crear_nave: user.puede_crear_nave,
    iat: Math.floor(Date.now() / 1000), // Fecha actual en UTC (segundos desde UNIX epoch)
  };
  

  return jwt.sign(payload, secret, { expiresIn }); // Tiempo de expiración basado en UTC
};

// Función para verificar el token JWT usando la clave secreta desde config
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.log('Error verificando token:', error.message);
    throw error;
  }
};

export const generateResetToken = (userId) => {
  const payload = {
    _id: userId,
    type: 'password_reset', // opcional, por seguridad
  };

  return jwt.sign(payload, secret, { expiresIn: '15m' });
};
// middleware/resetTokenMiddleware.js
import { verifyToken } from "../utils/jwtUtil.js";

export const resetTokenMiddleware = (req, res, next) => {
  const token = req.body.token;

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = verifyToken(token);

    if (decoded.type !== 'password_reset') {
      return res.status(403).json({ message: 'Tipo de token no válido para esta operación' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token de recuperación inválido:', error.message);
    return res.status(403).json({
      message: 'Token de recuperación inválido o expirado',
      details: error.message,
    });
  }
};

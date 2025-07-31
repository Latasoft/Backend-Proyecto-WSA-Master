import { verifyToken } from '../utils/jwtUtil.js'; // Tu función para verificar el token

// Middleware para verificar uno o más roles
export const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Leer encabezado Authorization: "Bearer <token>"
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    // 2. Verificar formato
    const [scheme, token] = authHeader.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res
        .status(401)
        .json({ message: 'Invalid authorization format. Use "Bearer <token>"' });
    }

    try {
      // 3. Verificar la validez del token (firma, expiración)
      const decoded = verifyToken(token); // Retorna payload decodificado
      const userRole = decoded.role; // Ajusta si tu token guarda el rol en otra propiedad

      // 4. Verificar si el rol del usuario está en la lista de roles permitidos
      if (!allowedRoles.includes(userRole)) {
        return res
          .status(403)
          .json({ message: 'Acceso denegado: no tienes el rol permitido' });
      }

      // 5. Si el rol es válido, guardar la info del usuario y continuar
      req.user = decoded;
      next();
    } catch (err) {
      console.error('Token verification failed:', err.message);
      return res
        .status(403)
        .json({ message: 'Token is not valid', details: err.message });
    }
  };
};

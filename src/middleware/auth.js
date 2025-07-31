import { verifyToken } from "../utils/jwtUtil.js";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Invalid authorization format. Use "Bearer <token>"' });
  }

  try {
    // Esto usa internamente la clave secret que obtienes de jwtConfig
    const decoded = verifyToken(token); 
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return res.status(403).json({
      message: 'Token verification failed',
      details: error.message
    });
  }
};

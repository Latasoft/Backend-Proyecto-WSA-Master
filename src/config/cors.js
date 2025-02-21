import cors from 'cors';
import { FRONTEND_URL } from './config.js';

const corsOptions = {
  origin: FRONTEND_URL, // Usa FRONTEND_URL desde la configuración
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Permitir envío de cookies o encabezados con credenciales
};

export const corsMiddleware = cors(corsOptions);



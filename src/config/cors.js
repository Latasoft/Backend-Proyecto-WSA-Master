import cors from 'cors';
import { ALLOWED_ORIGINS } from './config.js';

const corsOptions = { 
  origin: (origin, callback) => {
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS bloqueado para origen: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT','PATCH' , 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Permitir envío de cookies o encabezados con credenciales
};

export const corsMiddleware = cors(corsOptions);



import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el equivalente de __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar las variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PORT = process.env.PORT;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_DEST = process.env.EMAIL_DEST;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
// Token de firma para los usuarios
const JWT_SECRET = process.env.JWT_SECRET;
const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;

// Array de orígenes permitidos para CORS, separado y limpio
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';

// FRONTEND_URL se usa para redireccionar o enviar links, debe ser solo uno
const FRONTEND_URL =
  NODE_ENV === 'production'
    ? process.env.FRONTEND_URL // tu dominio de producción
    : 'http://localhost:4200'; // el front principal en desarrollo

export {
  PORT,
  FIREBASE_STORAGE_BUCKET,
  EMAIL_USER,
  EMAIL_PASSWORD,
  FRONTEND_URL,
  ALLOWED_ORIGINS,
  JWT_SECRET,
  MONGO_URI,
  NODE_ENV,
};

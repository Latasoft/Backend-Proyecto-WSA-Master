import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el equivalente de __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar las variables de entorno
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

 
const PORT = process.env.PORT


// Token de firma para los usuarios
const JWT_SECRET = process.env.JWT_SECRET;
const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;

const MONGO_URI=process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV || 'development';
const FRONTEND_URL =
  NODE_ENV === 'production' ? process.env.FRONTEND_URL : 'http://localhost:8100';
export {PORT,FIREBASE_STORAGE_BUCKET,FRONTEND_URL,JWT_SECRET,MONGO_URI,NODE_ENV}
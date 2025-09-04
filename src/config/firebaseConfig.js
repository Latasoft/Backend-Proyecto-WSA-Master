import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import * as admin from 'firebase-admin';  // Importar todo firebase-admin
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as config from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let firebaseStorage = null;
let firebaseApp = null;

try {
  // Verifica si estamos en modo desarrollo
  if (config.NODE_ENV === 'development') {
    console.log('Firebase Storage configurado en modo desarrollo (mock)');
    
    // Proporciona un objeto mock para el storage
    firebaseStorage = {
      bucket: () => ({
        upload: async () => [{ name: 'mock-file.jpg' }],
        file: () => ({
          getSignedUrl: async () => ['https://example.com/mock-url'],
          delete: async () => [{ success: true }],
          createWriteStream: () => {
            const stream = new require('stream').Writable();
            stream._write = (chunk, encoding, done) => {
              done();
            };
            setTimeout(() => {
              stream.emit('finish');
            }, 100);
            return stream;
          }
        })
      })
    };
  } else {
    // Si estamos en producción, intenta usar las credenciales reales
    const keyFilePath = path.resolve(process.cwd(), 'firebase-key.json');
    
    if (fs.existsSync(keyFilePath)) {
      firebaseApp = initializeApp({
        credential: cert(keyFilePath),
        storageBucket: config.FIREBASE_STORAGE_BUCKET
      });
      
      firebaseStorage = getStorage(firebaseApp);
      console.log('Firebase Storage configurado correctamente');
    } else {
      throw new Error('Archivo de credenciales de Firebase no encontrado');
    }
  }
} catch (error) {
  console.error('Error al configurar Firebase:', error);
  
  // Proporciona un objeto mock para el storage en caso de error
  firebaseStorage = {
    bucket: () => ({
      upload: async () => [{ name: 'mock-file-error.jpg' }],
      file: () => ({
        getSignedUrl: async () => ['https://example.com/mock-url-error'],
        delete: async () => [{ success: true }],
        createWriteStream: () => {
          const stream = new require('stream').Writable();
          stream._write = (chunk, encoding, done) => {
            done();
          };
          setTimeout(() => {
            stream.emit('finish');
          }, 100);
          return stream;
        }
      })
    })
  };
  console.log('Firebase Storage configurado en modo fallback (mock)');
}

// Exportar el objeto firebase storage
export default firebaseStorage;

// Exportar admin para notificaciones
export { admin };

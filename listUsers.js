// listUsers.js
import mongoose from 'mongoose';
import { User } from './src/model/user.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el equivalente de __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar las variables de entorno
dotenv.config({ path: path.resolve(__dirname, '.env') });

// URL de MongoDB - Asegúrate de que está definida en tu archivo .env
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/wsa';

async function listUsers() {
  try {
    console.log('Conectando a la base de datos...');
    console.log('URI de MongoDB:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('Conexión a MongoDB establecida.\n');
    
    const users = await User.find({}, 'username tipo_usuario email password');
    
    console.log(`Se encontraron ${users.length} usuarios:`);
    
    users.forEach((user, index) => {
      console.log(`\nUsuario #${index + 1}:`);
      console.log(`- Username: ${user.username}`);
      console.log(`- Tipo: ${user.tipo_usuario}`);
      console.log(`- Email: ${user.email}`);
      console.log(`- Password Hash: ${user.password}`);
    });
    
    console.log('\nEjecución completada.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error al listar usuarios:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

listUsers();

import firebaseStorage from '../config/firebaseConfig.js';

// Función para subir archivos a Firebase Storage
export const subirArchivoAFirebase = async (file, folder = 'images', filename = null) => {
  try {
    const bucket = firebaseStorage.bucket();
    
    // Generar un nombre de archivo único si no se proporciona uno
    const finalFilename = filename || `${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(`${folder}/${finalFilename}`);
    
    // Crear un stream para subir el archivo
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    
    // Manejar eventos del stream
    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error);
      });
      
      stream.on('finish', async () => {
        // Obtener URL pública del archivo
        const [url] = await fileUpload.getSignedUrl({
          action: 'read',
          expires: '03-01-2500', // Fecha lejana para URL permanente
        });
        
        resolve({
          filename: finalFilename,
          path: `${folder}/${finalFilename}`,
          url,
        });
      });
      
      // Escribir el archivo en el stream
      stream.end(file.buffer);
    });
  } catch (error) {
    console.error('Error al subir archivo a Firebase:', error);
    throw error;
  }
};

// Función para eliminar un archivo antiguo
export const eliminarArchivoAntiguo = async (filePath) => {
  try {
    if (!filePath) return true;
    
    const bucket = firebaseStorage.bucket();
    await bucket.file(filePath).delete();
    return true;
  } catch (error) {
    console.error('Error al eliminar archivo de Firebase:', error);
    // No lanzamos el error para que no interrumpa el flujo
    return false;
  }
};

// Exportar también uploadFile si es necesario para compatibilidad
export const uploadFile = subirArchivoAFirebase;
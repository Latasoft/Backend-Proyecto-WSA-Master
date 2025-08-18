import multer from 'multer';

// Configuración de multer para manejar FormData
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Permitir solo imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// Middleware para procesar FormData con imagen de empresa
export const uploadEmpresaImage = upload.single('imagen_empresa');

// Middleware para procesar FormData con imagen (campo alternativo)
export const uploadEmpresaImageAlt = upload.single('imagen');

// Middleware para procesar fotos de cliente (mantener compatibilidad)
export const uploadFotosCliente = upload.single('foto_cliente');

// Middleware flexible que acepta cualquier campo de archivo
export const uploadAnyImage = upload.any();

// Middleware para manejar errores de multer
export const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      // Ignorar errores de campos inesperados
      console.log('Campo de archivo inesperado ignorado:', error.message);
      return next();
    }
  } else if (error.message === 'Solo se permiten archivos de imagen') {
    return res.status(400).json({ 
      message: 'Solo se permiten archivos de imagen' 
    });
  }
  next(error);
};

// Función para convertir imagen a base64
export const convertImageToBase64 = (file) => {
  if (!file) return null;
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};


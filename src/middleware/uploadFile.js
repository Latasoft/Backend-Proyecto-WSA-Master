import multer from "multer";

// Configuración de almacenamiento en memoria
const storage = multer.memoryStorage();

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Aceptar solo archivos de imagen
  } else {
    cb(new Error("Solo se permiten archivos de imagen"), false);
  }
};

// Configuración general de Multer
export const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Máximo 5MB por archivo
  fileFilter,
});


export const uploadFotosCliente = upload.single('foto_cliente');


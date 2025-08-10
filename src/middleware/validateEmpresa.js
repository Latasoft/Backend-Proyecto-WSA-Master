import { EmpresaSchema, EmpresaUpdateSchema } from '../dtos/empresas/empresa.js';

// Middleware para validar datos al crear empresa
export const validateCreateEmpresa = (req, res, next) => {
  try {
    // Construir objeto de datos para validación
    const empresaData = {
      nombre_empresa: req.body.nombre_empresa,
      pais: req.body.pais,
      direccion: req.body.direccion,
      telefono: req.body.telefono,
      correo: req.body.correo,
    };

    // Agregar contactos si existen
    if (req.body.contacto_operativo) {
      try {
        empresaData.contacto_operativo = JSON.parse(req.body.contacto_operativo);
      } catch (error) {
        console.error('Error al parsear contacto_operativo:', error);
        return res.status(400).json({ 
          message: 'Formato inválido para contacto_operativo' 
        });
      }
    }

    if (req.body.contacto_da) {
      try {
        empresaData.contacto_da = JSON.parse(req.body.contacto_da);
      } catch (error) {
        console.error('Error al parsear contacto_da:', error);
        return res.status(400).json({ 
          message: 'Formato inválido para contacto_da' 
        });
      }
    }

    // Validar datos
    const validatedData = EmpresaSchema.parse(empresaData);
    req.validatedData = validatedData;
    next();
  } catch (error) {
    if (error.errors) {
      const errorMessages = error.errors.map(err => err.message);
      return res.status(400).json({ 
        message: 'Datos inválidos', 
        errors: errorMessages 
      });
    }
    res.status(400).json({ message: 'Error de validación' });
  }
};

// Middleware para validar datos al actualizar empresa
export const validateUpdateEmpresa = (req, res, next) => {
  try {
    // Construir objeto de datos para validación
    const empresaData = {};

    // Solo incluir campos que se envían
    if (req.body.nombre_empresa) empresaData.nombre_empresa = req.body.nombre_empresa;
    if (req.body.pais) empresaData.pais = req.body.pais;
    if (req.body.direccion) empresaData.direccion = req.body.direccion;
    if (req.body.telefono) empresaData.telefono = req.body.telefono;
    if (req.body.correo) empresaData.correo = req.body.correo;

    // Agregar contactos si existen
    if (req.body.contacto_operativo) {
      try {
        empresaData.contacto_operativo = JSON.parse(req.body.contacto_operativo);
      } catch (error) {
        return res.status(400).json({ 
          message: 'Formato inválido para contacto_operativo' 
        });
      }
    }

    if (req.body.contacto_da) {
      try {
        empresaData.contacto_da = JSON.parse(req.body.contacto_da);
      } catch (error) {
        return res.status(400).json({ 
          message: 'Formato inválido para contacto_da' 
        });
      }
    }

    // Validar datos (parcial para actualización)
    const validatedData = EmpresaUpdateSchema.parse(empresaData);
    req.validatedData = validatedData;
    next();
  } catch (error) {
    if (error.errors) {
      const errorMessages = error.errors.map(err => err.message);
      return res.status(400).json({ 
        message: 'Datos inválidos', 
        errors: errorMessages 
      });
    }
    res.status(400).json({ message: 'Error de validación' });
  }
};

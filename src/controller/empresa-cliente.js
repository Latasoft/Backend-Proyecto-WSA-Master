import { EmpresaCliente } from '../model/empresa-cliente.js';
import { convertImageToBase64 } from '../middleware/uploadFile.js';

export const crearEmpresaCliente = async (req, res) => {
  try {
    // Procesar datos del FormData
    const empresaData = {
      nombre_empresa: req.body.nombre_empresa,
      pais: req.body.pais,
      direccion: req.body.direccion,
      telefono: req.body.telefono,
      correo: req.body.correo,
    };

    // Procesar imagen si existe
    if (req.files && req.files.length > 0) {
      // Buscar el archivo de imagen (puede ser imagen_empresa, imagen, o cualquier archivo de imagen)
      const imageFile = req.files.find(file => 
        file.fieldname === 'imagen_empresa' || 
        file.fieldname === 'imagen' || 
        file.mimetype.startsWith('image/')
      );
      
      if (imageFile) {
        empresaData.imagen_empresa = convertImageToBase64(imageFile);
      }
    } else if (req.body.imagen) {
      // Si se recibió el nombre del archivo como string, guardarlo como está
      empresaData.imagen_empresa = req.body.imagen;
    }

    // Procesar contactos si existen
    if (req.body.contacto_operativo) {
      if (typeof req.body.contacto_operativo === 'string') {
        try {
          empresaData.contacto_operativo = JSON.parse(req.body.contacto_operativo);
        } catch (error) {
          console.error('Error al parsear contacto_operativo:', error);
        }
      } else {
        empresaData.contacto_operativo = req.body.contacto_operativo;
      }
    }

    if (req.body.contacto_da) {
      if (typeof req.body.contacto_da === 'string') {
        try {
          empresaData.contacto_da = JSON.parse(req.body.contacto_da);
        } catch (error) {
          console.error('Error al parsear contacto_da:', error);
        }
      } else {
        empresaData.contacto_da = req.body.contacto_da;
      }
    }

    const nuevaEmpresa = new EmpresaCliente(empresaData);
    await nuevaEmpresa.save();
    res.status(201).json(nuevaEmpresa);
  } catch (error) {
    console.error('Error al crear empresa:', error);
    res.status(500).json({ message: 'Error al crear empresa', error: error.message });
  }
};

export const obtenerEmpresas = async (req, res) => {
  try {
    const empresas = await EmpresaCliente.find().sort({ createdAt: -1 });
    res.json(empresas);
  } catch (error) {
    console.error('Error al obtener empresas:', error);
    res.status(500).json({ message: 'Error al obtener empresas' });
  }
};

export const eliminarEmpresaCliente = async (req, res) => {
  try {
    const { id } = req.params;
    await EmpresaCliente.findByIdAndDelete(id);
    res.json({ message: 'Empresa eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar empresa:', error);
    res.status(500).json({ message: 'Error al eliminar empresa' });
  }
};

export const actualizarEmpresaCliente = async (req, res) => {
  try {
    const { id } = req.params;
    
    // DEBUG: Log de los datos recibidos
    console.log('�� Datos recibidos en actualizarEmpresaCliente:', {
      body: req.body,
      files: req.files,
      contacto_operativo_type: typeof req.body.contacto_operativo,
      contacto_da_type: typeof req.body.contacto_da
    });
    
    // Obtener empresa actual
    const empresaActual = await EmpresaCliente.findById(id);
    if (!empresaActual) {
      return res.status(404).json({ message: 'Empresa no encontrada' });
    }

    // Procesar datos del FormData
    const empresaData = {
      nombre_empresa: req.body.nombre_empresa,
      pais: req.body.pais,
      direccion: req.body.direccion,
      telefono: req.body.telefono,
      correo: req.body.correo,
    };

    // Procesar imagen
    if (req.files && req.files.length > 0) {
      const imageFile = req.files.find(file => 
        file.fieldname === 'imagen_empresa' || 
        file.fieldname === 'imagen' || 
        file.mimetype.startsWith('image/')
      );
      
      if (imageFile) {
        empresaData.imagen_empresa = convertImageToBase64(imageFile);
      } else {
        empresaData.imagen_empresa = empresaActual.imagen_empresa;
      }
    } else if (req.body.imagen) {
      empresaData.imagen_empresa = req.body.imagen;
    } else {
      empresaData.imagen_empresa = empresaActual.imagen_empresa;
    }

    // Procesar contactos - CON LOGS DETALLADOS
    if (req.body.contacto_operativo) {
      console.log('🔍 Procesando contacto_operativo:', req.body.contacto_operativo);
      
      if (typeof req.body.contacto_operativo === 'string') {
        try {
          empresaData.contacto_operativo = JSON.parse(req.body.contacto_operativo);
          console.log('✅ contacto_operativo parseado correctamente');
        } catch (error) {
          console.error('❌ Error al parsear contacto_operativo:', error);
          return res.status(400).json({ message: 'Formato inválido para contacto_operativo' });
        }
      } else {
        empresaData.contacto_operativo = req.body.contacto_operativo;
        console.log('✅ contacto_operativo usado directamente como objeto');
      }
    }

    if (req.body.contacto_da) {
      console.log('🔍 Procesando contacto_da:', req.body.contacto_da);
      
      if (typeof req.body.contacto_da === 'string') {
        try {
          empresaData.contacto_da = JSON.parse(req.body.contacto_da);
          console.log('✅ contacto_da parseado correctamente');
        } catch (error) {
          console.error('❌ Error al parsear contacto_da:', error);
          return res.status(400).json({ message: 'Formato inválido para contacto_da' });
        }
      } else {
        empresaData.contacto_da = req.body.contacto_da;
        console.log('✅ contacto_da usado directamente como objeto');
      }
    }

    console.log('�� Datos finales para actualizar:', empresaData);

    const empresaActualizada = await EmpresaCliente.findByIdAndUpdate(
      id, 
      empresaData, 
      { new: true }
    );
    
         console.log('✅ Empresa actualizada exitosamente');
     res.json(empresaActualizada);
     
   } catch (error) {
     console.error('❌ Error al actualizar empresa:', error);
     res.status(500).json({ message: 'Error al actualizar empresa' });
   }
 };

export const obtenerEmpresaClientePorId = async (req, res) => {
   try {
     const { id } = req.params;
     const empresa = await EmpresaCliente.findById(id);
     if (!empresa) {
       return res.status(404).json({ message: 'Empresa-cliente no encontrada' });
     }
     res.json(empresa);
   } catch (error) {
     console.error('Error al obtener empresa por id:', error);
     res.status(500).json({ message: 'Error al obtener empresa por id' });
   }
 };


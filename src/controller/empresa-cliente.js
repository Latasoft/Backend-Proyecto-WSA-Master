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
      try {
        empresaData.contacto_operativo = JSON.parse(req.body.contacto_operativo);
      } catch (error) {
        console.error('Error al parsear contacto_operativo:', error);
      }
    }

    if (req.body.contacto_da) {
      try {
        empresaData.contacto_da = JSON.parse(req.body.contacto_da);
      } catch (error) {
        console.error('Error al parsear contacto_da:', error);
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
    
    // Obtener empresa actual para mantener imagen existente si no se envía nueva
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

    // Procesar imagen: si se envía nueva imagen, usarla; si no, mantener la existente
    if (req.files && req.files.length > 0) {
      // Buscar el archivo de imagen
      const imageFile = req.files.find(file => 
        file.fieldname === 'imagen_empresa' || 
        file.fieldname === 'imagen' || 
        file.mimetype.startsWith('image/')
      );
      
      if (imageFile) {
        empresaData.imagen_empresa = convertImageToBase64(imageFile);
      } else {
        // Mantener imagen existente
        empresaData.imagen_empresa = empresaActual.imagen_empresa;
      }
    } else if (req.body.imagen) {
      // Si se recibió el nombre del archivo como string, guardarlo como está
      empresaData.imagen_empresa = req.body.imagen;
    } else {
      // Mantener imagen existente
      empresaData.imagen_empresa = empresaActual.imagen_empresa;
    }

    // Procesar contactos si existen
    if (req.body.contacto_operativo) {
      try {
        empresaData.contacto_operativo = JSON.parse(req.body.contacto_operativo);
      } catch (error) {
        console.error('Error al parsear contacto_operativo:', error);
      }
    }

    if (req.body.contacto_da) {
      try {
        empresaData.contacto_da = JSON.parse(req.body.contacto_da);
      } catch (error) {
        console.error('Error al parsear contacto_da:', error);
      }
    }

    const empresaActualizada = await EmpresaCliente.findByIdAndUpdate(
      id, 
      empresaData, 
      { new: true }
    );
    res.json(empresaActualizada);
  } catch (error) {
    console.error('Error al actualizar empresa:', error);
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


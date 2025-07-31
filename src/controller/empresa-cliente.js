import { EmpresaCliente } from '../model/empresa-cliente.js';

export const crearEmpresaCliente = async (req, res) => {
  try {
    const nuevaEmpresa = new EmpresaCliente(req.body);
    await nuevaEmpresa.save();
    res.status(201).json(nuevaEmpresa);
  } catch (error) {
    console.error('Error al crear empresa:', error);
    res.status(500).json({ message: 'Error al crear empresa' });
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
    const empresaActualizada = await EmpresaCliente.findByIdAndUpdate(id, req.body, { new: true });
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


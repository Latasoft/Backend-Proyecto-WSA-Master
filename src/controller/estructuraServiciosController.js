import EstructuraServicio from '../models/estructuraServicios.js';


export const crearEstructuraServicio = async (req, res) => {
  try {
    const data = req.body;

    const nuevo = new EstructuraServicio(data);
    const guardado = await nuevo.save();

    res.status(201).json(guardado);
  } catch (error) {
    console.error('Error al guardar estructura:', error.message);
    res.status(500).json({ message: 'Error al guardar', error: error.message });
  }
};


export const obtenerEstructuraServicios = async (req, res) => {
  try {
    const lista = await EstructuraServicio.find();
    res.status(200).json(lista);
  } catch (error) {
    console.error('Error al obtener estructuras:', error.message);
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};


export const eliminarEstructuraServicio = async (req, res) => {
  try {
    const { id } = req.params;

    const eliminado = await EstructuraServicio.findByIdAndDelete(id);
    
    if (!eliminado) {
      return res.status(404).json({ message: 'Estructura de servicio no encontrada' });
    }

    res.status(200).json({ message: 'Estructura eliminada correctamente', data: eliminado });
  } catch (error) {
    console.error('Error al eliminar estructura:', error.message);
    res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
};


export const actualizarEstructuraServicio = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    const actualizado = await EstructuraServicio.findByIdAndUpdate(
      id, 
      data, 
      { new: true, runValidators: true }
    );

    if (!actualizado) {
      return res.status(404).json({ message: 'Estructura de servicio no encontrada' });
    }

    res.status(200).json(actualizado);
  } catch (error) {
    console.error('Error al actualizar estructura:', error.message);
    res.status(500).json({ message: 'Error al actualizar', error: error.message });
  }
};


export const obtenerEstructuraServicioPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const estructura = await EstructuraServicio.findById(id);
    
    if (!estructura) {
      return res.status(404).json({ message: 'Estructura de servicio no encontrada' });
    }

    res.status(200).json(estructura);
  } catch (error) {
    console.error('Error al obtener estructura:', error.message);
    res.status(500).json({ message: 'Error al obtener', error: error.message });
  }
};


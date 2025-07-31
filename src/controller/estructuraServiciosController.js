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

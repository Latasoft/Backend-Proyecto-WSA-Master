import express from 'express';
import EstructuraServicio from '../model/estructura-servicio.js';


const router = express.Router();

// GET - obtener toda la estructura
router.get('/', async (req, res) => {
  try {
    const estructura = await EstructuraServicio.find();
    res.status(200).json(estructura);
  } catch (err) {
    console.error('❌ Error al obtener estructura:', err);
    res.status(500).json({ message: 'Error al obtener estructura' });
  }
});

export default router;

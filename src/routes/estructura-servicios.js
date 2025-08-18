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

// POST - crear nueva estructura
router.post('/', async (req, res) => {
  try {
    const nuevaEstructura = new EstructuraServicio(req.body);
    const guardado = await nuevaEstructura.save();
    res.status(201).json(guardado);
  } catch (err) {
    console.error('❌ Error al guardar estructura:', err);
    res.status(500).json({ message: 'Error al guardar estructura' });
  }
});




router.patch('/eliminar-servicio-relacionado/:principal/:subservicio', async (req, res) => {
  const { principal, subservicio } = req.params;
  const { nombre } = req.body; // nombre del servicio a eliminar

  try {
    const estructura = await EstructuraServicio.findOne({ principal });

    if (!estructura) {
      return res.status(404).json({ message: 'Servicio principal no encontrado' });
    }

    const sub = estructura.subservicios.find(
  s => s.nombre.trim().toLowerCase() === subservicio.trim().toLowerCase()
);


    if (!sub) {
      return res.status(404).json({ message: 'Subservicio no encontrado' });
    }

    const serviciosOriginales = sub.servicios.length;
    sub.servicios = sub.servicios.filter(
  s => s.nombre.trim().toLowerCase() !== nombre.trim().toLowerCase()
);


    if (sub.servicios.length === serviciosOriginales) {
      return res.status(404).json({ message: 'Servicio relacionado no encontrado' });
    }

    await estructura.save();
    console.log("🧠 Resultado después de guardar:", JSON.stringify(estructura, null, 2));

    res.status(200).json({ message: 'Servicio eliminado con éxito' });
  } catch (err) {
    console.error('❌ Error al eliminar servicio relacionado:', err.message);
    res.status(500).json({ message: 'Error interno', error: err.message });
  }
});


router.patch('/editar-servicio-relacionado', async (req, res) => {
  const { principal, subservicio, nombreAntiguo, nombreNuevo } = req.body;

  try {
    const estructura = await EstructuraServicio.findOne({ principal });

    if (!estructura) {
      return res.status(404).json({ message: 'Servicio principal no encontrado' });
    }

    const sub = estructura.subservicios.find(s => s.nombre.toLowerCase() === subservicio.toLowerCase());
    if (!sub) {
      return res.status(404).json({ message: 'Subservicio no encontrado' });
    }

    const servicio = sub.servicios.find(s => s.nombre === nombreAntiguo);
    if (!servicio) {
      return res.status(404).json({ message: 'Servicio relacionado no encontrado' });
    }

    servicio.nombre = nombreNuevo;

    await estructura.save();
    res.json({ message: 'Servicio actualizado correctamente' });

  } catch (err) {
    console.error('Error al editar servicio relacionado:', err);
    res.status(500).json({ message: 'Error al editar servicio' });
  }
});


router.patch('/eliminar-subservicio/:principal', async (req, res) => {
  const { principal } = req.params;
  const { subservicio } = req.body;

  try {
    const estructura = await EstructuraServicio.findOne({ principal });

    if (!estructura) {
      return res.status(404).json({ message: 'Servicio principal no encontrado' });
    }

    estructura.subservicios = estructura.subservicios.filter(
      s => s.nombre.toLowerCase() !== subservicio.toLowerCase()
    );

    await estructura.save();

    res.status(200).json({ message: 'Subservicio eliminado correctamente' });
  } catch (error) {
    console.error('❌ Error al eliminar subservicio:', error);
    res.status(500).json({ message: 'Error al eliminar subservicio' });
  }
});

// PATCH - Agrega un servicio relacionado a un subservicio dentro de un principal existente
router.patch('/agregar-servicio-relacionado/:principal/:subservicio', async (req, res) => {
  const { principal, subservicio } = req.params;
  const nuevoServicio = req.body; // { nombre: "Ok to board" }

  try {
    const estructura = await EstructuraServicio.findOne({ principal });

    if (!estructura) {
      return res.status(404).json({ message: 'Servicio principal no encontrado' });
    }

    const sub = estructura.subservicios.find(s => s.nombre.toLowerCase() === subservicio.toLowerCase());
    if (!sub) {
      return res.status(404).json({ message: 'Subservicio no encontrado' });
    }

    const yaExiste = sub.servicios.find(s => s.nombre === nuevoServicio.nombre);
    if (yaExiste) {
      return res.status(400).json({ message: 'Ese servicio ya existe en este subservicio' });
    }

    sub.servicios.push(nuevoServicio);
    await estructura.save();

    res.status(200).json({ message: 'Servicio relacionado agregado con éxito', estructura });
  } catch (err) {
    console.error('❌ Error al agregar servicio relacionado:', err.message);
    res.status(500).json({ message: 'Error interno', error: err.message });
  }
});

router.patch('/eliminar-servicio-relacionado-por-id', async (req, res) => {
  const { principal, subservicio, idServicio } = req.body;

  try {
    const estructura = await EstructuraServicio.findOne({ principal });

    if (!estructura) {
      return res.status(404).json({ message: 'Principal no encontrado' });
    }

    const sub = estructura.subservicios.find(s => s.nombre === subservicio);
    if (!sub) {
      return res.status(404).json({ message: 'Subservicio no encontrado' });
    }

    // Elimina por _id
    sub.servicios = sub.servicios.filter(s => String(s._id) !== String(idServicio));

    await estructura.save();
    res.json({ message: 'Servicio eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({ message: 'Error interno al eliminar servicio' });
  }
});

// GET - obtener estructura por id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const estructura = await EstructuraServicio.findById(id);
    if (!estructura) {
      return res.status(404).json({ message: 'Estructura de servicio no encontrada' });
    }
    res.status(200).json(estructura);
  } catch (err) {
    console.error('❌ Error al obtener estructura por id:', err);
    res.status(500).json({ message: 'Error al obtener estructura' });
  }
});

// PATCH - actualizar estructura por id
router.patch('/:id', async (req, res) => {
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
  } catch (err) {
    console.error('❌ Error al actualizar estructura:', err);
    res.status(500).json({ message: 'Error al actualizar estructura' });
  }
});

// DELETE - eliminar estructura por id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await EstructuraServicio.findByIdAndDelete(id);
    if (!eliminado) {
      return res.status(404).json({ message: 'Estructura de servicio no encontrada' });
    }
    res.status(200).json({ message: 'Estructura eliminada correctamente', data: eliminado });
  } catch (err) {
    console.error('❌ Error al eliminar estructura:', err);
    res.status(500).json({ message: 'Error al eliminar estructura' });
  }
});


export default router;

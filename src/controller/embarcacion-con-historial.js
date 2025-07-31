// EJEMPLO DE INTEGRACIÓN DEL HISTORIAL DE CAMBIOS
// Este archivo muestra cómo integrar el historial de cambios en el controlador de embarcaciones

import { EmbarcacionService } from "../service/embarcacion.js";
import { Embarcacion } from "../model/embarcacion.js";
import { HistorialCambiosService } from "../service/historial-cambios.js";
import { crearDatosHistorial } from "../middleware/historial.js";
import mongoose from "mongoose";

const embarcacionService = new EmbarcacionService();

// EJEMPLO: Crear embarcación con historial
export async function crearEmbarcacionConHistorial(req, res) {
  try {
    console.log('✅ REQ BODY recibido:', JSON.stringify(req.body, null, 2));

    let dataParse = req.body;
    dataParse.empresa_cliente_id = new mongoose.Types.ObjectId(dataParse.empresa_cliente_id);

    // Crear la embarcación
    const response = await embarcacionService.crearEmbarcacion(dataParse);
    
    // Registrar en historial de cambios
    if (response.embarcacion) {
      const datosHistorial = crearDatosHistorial(req, {
        entidad_tipo: 'embarcacion',
        entidad_id: response.embarcacion._id,
        entidad_nombre: response.embarcacion.nombre || response.embarcacion.da_numero || 'Embarcación sin nombre'
      });

      await HistorialCambiosService.registrarCreacion(datosHistorial);
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error en crearEmbarcacionConHistorial:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
}

// EJEMPLO: Actualizar embarcación con historial
export async function updateEmbarcacionConHistorial(req, res) {
  try {
    const { _id } = req.params;
    
    // Obtener estado anterior
    const embarcacionAnterior = await Embarcacion.findById(_id).lean();
    if (!embarcacionAnterior) {
      return res.status(404).json({ message: "Embarcación no encontrada" });
    }

    // Actualizar la embarcación
    const response = await embarcacionService.updateEmbarcacion(_id, req.body);
    
    // Obtener estado nuevo
    const embarcacionNueva = await Embarcacion.findById(_id).lean();
    
    // Registrar en historial de cambios
    if (embarcacionNueva) {
      const datosHistorial = crearDatosHistorial(req, {
        entidad_tipo: 'embarcacion',
        entidad_id: _id,
        entidad_nombre: embarcacionNueva.nombre || embarcacionNueva.da_numero || 'Embarcación sin nombre'
      });

      await HistorialCambiosService.registrarEdicion(
        datosHistorial,
        embarcacionAnterior,
        embarcacionNueva
      );
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error en updateEmbarcacionConHistorial:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
}

// EJEMPLO: Eliminar embarcación con historial
export async function deleteEmbarcacionConHistorial(req, res) {
  try {
    const { _id } = req.params;
    
    // Obtener datos antes de eliminar
    const embarcacionAEliminar = await Embarcacion.findById(_id).lean();
    if (!embarcacionAEliminar) {
      return res.status(404).json({ message: "Embarcación no encontrada" });
    }

    // Eliminar la embarcación
    const response = await embarcacionService.deleteEmbarcacionById(_id);
    
    // Registrar en historial de cambios
    const datosHistorial = crearDatosHistorial(req, {
      entidad_tipo: 'embarcacion',
      entidad_id: _id,
      entidad_nombre: embarcacionAEliminar.nombre || embarcacionAEliminar.da_numero || 'Embarcación sin nombre'
    });

    await HistorialCambiosService.registrarEliminacion(datosHistorial);

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error en deleteEmbarcacionConHistorial:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
}

// EJEMPLO: Actualizar estado y comentario con historial
export const actualizarEstadoYComentarioConHistorial = async (req, res) => {
  try {
    const { da_numero } = req.params;
    const { estado, comentario } = req.body;

    // Obtener estado anterior
    const embarcacionAnterior = await Embarcacion.findOne({ da_numero }).lean();
    if (!embarcacionAnterior) {
      return res.status(404).json({ message: "Embarcación no encontrada" });
    }

    // Actualizar estado y comentario
    const embarcacionActualizada = await Embarcacion.findOneAndUpdate(
      { da_numero },
      { 
        estado,
        comentario,
        updatedAt: new Date()
      },
      { new: true }
    );

    // Registrar en historial de cambios
    const datosHistorial = crearDatosHistorial(req, {
      entidad_tipo: 'embarcacion',
      entidad_id: embarcacionActualizada._id,
      entidad_nombre: embarcacionActualizada.nombre || embarcacionActualizada.da_numero || 'Embarcación sin nombre'
    });

    await HistorialCambiosService.registrarEdicion(
      datosHistorial,
      embarcacionAnterior,
      embarcacionActualizada.toObject()
    );

    res.status(200).json({
      message: "Estado y comentario actualizados exitosamente",
      embarcacion: embarcacionActualizada
    });

  } catch (error) {
    console.error("❌ Error en actualizarEstadoYComentarioConHistorial:", error);
    res.status(500).json({ 
      message: "Error interno del servidor",
      error: error.message 
    });
  }
};

/*
PARA IMPLEMENTAR EN TUS CONTROLADORES EXISTENTES:

1. Importa los servicios necesarios:
   import { HistorialCambiosService } from "../service/historial-cambios.js";
   import { crearDatosHistorial } from "../middleware/historial.js";

2. Agrega el middleware de captura de datos en tus rutas:
   import { captureHistorialData } from '../middleware/historial.js';
   router.put('/:_id', authMiddleware, captureHistorialData, verifyRoles(...), updateEmbarcacion);

3. En cada función que modifique datos, agrega el registro de historial:
   
   Para CREAR:
   await HistorialCambiosService.registrarCreacion(crearDatosHistorial(req, {
     entidad_tipo: 'embarcacion',
     entidad_id: nuevaEntidad._id,
     entidad_nombre: nuevaEntidad.nombre
   }));
   
   Para EDITAR:
   const estadoAnterior = await Modelo.findById(id).lean();
   // ... hacer la actualización ...
   const estadoNuevo = await Modelo.findById(id).lean();
   await HistorialCambiosService.registrarEdicion(
     crearDatosHistorial(req, { entidad_tipo: 'embarcacion', entidad_id: id, entidad_nombre: nombre }),
     estadoAnterior,
     estadoNuevo
   );
   
   Para ELIMINAR:
   const entidadAEliminar = await Modelo.findById(id).lean();
   // ... hacer la eliminación ...
   await HistorialCambiosService.registrarEliminacion(crearDatosHistorial(req, {
     entidad_tipo: 'embarcacion',
     entidad_id: id,
     entidad_nombre: entidadAEliminar.nombre
   }));
*/
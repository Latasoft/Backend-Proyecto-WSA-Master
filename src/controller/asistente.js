import { Embarcacion } from "../model/embarcacion.js";
import { User } from "../model/user.js";
import mongoose from "mongoose";

// Obtener todas las embarcaciones asociadas a un asistente por ID
export const getEmbarcacionesByAsistenteId = async (req, res) => {
  try {
    const { asistenteId } = req.params;

    // Validar que el ID sea válido
    if (!mongoose.Types.ObjectId.isValid(asistenteId)) {
      return res.status(400).json({ message: "ID de asistente inválido" });
    }

    // Verificar que el usuario existe y es de tipo ASISTENTE
    const asistente = await User.findById(asistenteId);
    if (!asistente) {
      return res.status(404).json({ message: "Asistente no encontrado" });
    }

    if (asistente.tipo_usuario !== 'ASISTENTE') {
      return res.status(400).json({ message: "El usuario no es de tipo asistente" });
    }

    // Buscar todas las embarcaciones que tengan este asistente asignado
    const embarcaciones = await Embarcacion.find({
      "asistentes.asistenteId": asistenteId,
      is_activated: true
    })
    .populate('empresa_cliente_id', 'nombre_empresa')
    .populate('asistentes.asistenteId', 'username email')
    .populate('trabajadores.trabajadorId', 'username email')
    .sort({ fecha_creacion: -1 });

    res.status(200).json({
      success: true,
      message: "Embarcaciones obtenidas exitosamente",
      data: embarcaciones,
      total: embarcaciones.length
    });

  } catch (error) {
    console.error("❌ Error en getEmbarcacionesByAsistenteId:", error);
    res.status(500).json({ 
      success: false,
      message: "Error interno del servidor",
      error: error.message 
    });
  }
};

// Obtener todos los asistentes disponibles
export const getAllAsistentes = async (req, res) => {
  try {
    // Buscar todos los usuarios de tipo ASISTENTE
    const asistentes = await User.find(
      { tipo_usuario: 'ASISTENTE' },
      { password: 0, fcmTokens: 0 } // Excluir campos sensibles
    ).sort({ username: 1 });

    res.status(200).json({
      success: true,
      message: "Asistentes obtenidos exitosamente",
      data: asistentes,
      total: asistentes.length
    });

  } catch (error) {
    console.error("❌ Error en getAllAsistentes:", error);
    res.status(500).json({ 
      success: false,
      message: "Error interno del servidor",
      error: error.message 
    });
  }
};
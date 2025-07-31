import mongoose from "mongoose";

const solicitudReporteSchema = new mongoose.Schema({
  id_solicitante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // el nombre del modelo de User
    required: true
  },
  fecha_solicitud: {
    type: Date,
    default: Date.now
  },
  rango_fecha_inicio: {
    type: Date,
    required: true
  },
  rango_fecha_termino: {
    type: Date,
    required: true
  },
  estado_solicutud:{
    type: String,
    enum: ['PENDIENTE', 'ACEPTADA', 'RECHAZADA'],
    default: 'PENDIENTE'
  },
  docuemento_reporte:{
    type: String,
    default: null
  }
});

export const SolicitudReporte = mongoose.model('solicitudReporte', solicitudReporteSchema);
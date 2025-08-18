import mongoose from "mongoose";

// Subesquema para cada acción dentro de un estado
const accionSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    fecha: { type: Date, required: false, default: Date.now },
    comentario: { type: String, required: false },
    incidente: { type: Boolean, required: false },
    servicio_relacionado: { type: String, default: '' }
  },
  { _id: false }
);

// Subesquema para cada estado
const estadoSchema = new mongoose.Schema(
  {
    nombre_estado: { type: String, required: true },
    acciones: {
      type: [accionSchema],
      default: []
    }
  },
  { _id: false }
);

// Subesquema para el servicio
const servicioSchema = new mongoose.Schema({
  nombre_servicio: {
    type: String,
    required: true
  },
  estados: {
    type: [estadoSchema],
    default: []
  }
});

// Esquema principal para la embarcación
const embarcacionSchema = new mongoose.Schema({
  titulo_embarcacion: { type: String, required: true },
  destino_embarcacion: { type: String, required: true },
  da_numero: { type: String, required: true, unique: true },
  pais_embarcacion: { type: String, required: true },

  fecha_creacion: { type: Date, default: Date.now },
  fecha_arribo: { type: Date },
  fecha_zarpe: { type: Date },
  fecha_estimada_zarpe: { type: Date },

  // ✅ Cambio aquí: guardar como string para evitar desfase
  fecha_servicio_relacionado: { type: String },
  nota_servicio_relacionado: { type: String, default: '' },

  estado_actual: {
    type: String,
    enum: ['aprobado', 'observaciones', 'en_proceso'],
    default: 'en_proceso'
  },
  comentario_general: { type: String, default: '' },

  servicio: { type: String, default: '' },
  subservicio: { type: String, default: '' },

  // ✅ Cambio aquí: guardar la fecha de cada servicio como string
  servicios_relacionados: {
  type: [
    {
      nombre: { type: String, required: true },
      subservicio: { type: String, default: '' }, 
      servicio_principal: { type: String, required: true }, 
      fecha: { type: String, required: true },
      nota: { type: String, default: '' },
      estado: { type: String, default: 'pendiente' },
      fecha_modificacion: { type: Date, default: Date.now }
    }
  ],
  default: []
},

  // Campos para empresa-cliente asociada
  empresa_cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EmpresaCliente",
    required: true
  },
  nombre_empresa_cliente: {
    type: String,
    required: true
  },

  is_activated: { type: Boolean, default: true },
  trabajadores: [
    {
      trabajadorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    }
  ],
  asistentes: [
    {
      asistenteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      }
    }
  ],

  servicios: {
    type: [servicioSchema],
    default: []
  }
});

// Índice geoespacial si usas ubicación
embarcacionSchema.index({ "ubicacion_embarcacion.coordinates": "2dsphere" });

export const Embarcacion = mongoose.model("embarcaciones", embarcacionSchema);

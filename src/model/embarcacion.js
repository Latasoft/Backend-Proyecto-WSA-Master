import mongoose from "mongoose";

// Subesquema para cada acción dentro de un estado
const accionSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    fecha: { type: Date, required: true },
    comentario: { type: String, required: false },
    incidente: { type: Boolean, required: false },
    servicio_relacionado: { type: String, default: '' }
  },
  { _id: false }
);

// Subesquema para cada estado
const estadoSchema = new mongoose.Schema(
  {
    nombre_estado: {
      type: String,
      required: true,
      enum: [
        "Provisions and Bonds",
        "Technical Assitance and Products",
        "WorkShop Coordination",
        "Diving Service Coordination",
        "Marine Surveyor Arrangement",
        "Last Mile",
        "Sample shipping",
        "Cargo Shipping",
        "Landing and Return By Courier",
        "Airfreight Coordination",
        "Seafreight Coordination",
        "Courier on Board Clearance",
        "Landing and Return Spare Parts",
        "Port Technical Services",
        "Custom Process",
        "Representation",
        "Local Subpplier And Provisions to Expeditions",
        "Hub Agent",
        "Part Asistence",
        "Account Supervision",
        "Tax Recovery (Chile)",
        "Full Port Agent",
        "Protective Agency",
        "Bunkering Call",
        "Logistic Call",
        "Panama Channel Transit",
        "Magellan Strait Pilotage",
        "Crew Change",
        "Medical Assistance",
        "Visa Authorization on Arraival",
        "Hotel Service",
        "Transportation",
        "Cash to Master",
        "Ok to Board Issuance",
        "Working Permit"
      ]
    },
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
        fecha: { type: String, required: true }, // ← ✅ Cambio clave
        nota: { type: String, default: '' },
        estado: { type: String, default: 'pendiente' },
        fecha_modificacion: { type: Date, default: Date.now }
      }
    ],
    default: []
  },

  clientes: [
    {
      cliente_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "cliente",
        required: true
      }
    }
  ],
  is_activated: { type: Boolean, default: true },
  trabajadores: [
    {
      trabajadorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
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

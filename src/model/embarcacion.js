import mongoose from "mongoose";

// Subesquema para cada acción dentro de un estado
const accionSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    fecha: { type: Date, required: true },
    comentario:{type:String,required:false},
    incidente:{type:Boolean,required:false}

  },
  { _id: false }
);

// Subesquema para cada estado (por ejemplo, "puerto", "hotel", etc.)
const estadoSchema = new mongoose.Schema(
  {
    nombre_estado: {
      type: String,
      required: true,
      // Si los estados son fijos, puedes limitar los valores permitidos:
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
        "Working Permit" // ← Agregado solo si es válido
      ]
        
    },
    // Cada estado puede tener varias acciones (eventos) en su línea de tiempo
    acciones: {
      type: [accionSchema],
      default: []
    }
  },
  { _id: false }
);

// Subesquema para el servicio, que incluye el nombre del servicio y sus estados
const servicioSchema = new mongoose.Schema({
  nombre_servicio: {
    type: String,
    required: true
  },
  // La línea de tiempo con los estados y sus acciones
  estados: {
    type: [estadoSchema],
    default: []
  }
});

// Esquema principal para la embarcación
const embarcacionSchema = new mongoose.Schema({
  titulo_embarcacion: { type: String, required: true },
  destino_embarcacion: { type: String, required: true },
  fecha_creacion: { type: Date, default: Date.now }, 
  fecha_arribo: { type: Date, required:false},
  fecha_zarpe: { type: Date, required:false},

// AGREGO EL ESTADO DE LAS NAVES Y COMENTARIO DE LA MISMA 

  estado_actual: {
    type: String,
    enum: ['aprobado', 'observaciones', 'en_proceso'],
    default: 'en_proceso'
  },
  comentario_general: {
    type: String,
    default: ''

//BLOQUE SUPERIOR ES EL CAMBIO DE LAS NAVES 

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
  // Array de servicios
  servicios: {
    type: [servicioSchema],
    default: []
  }
});

// Si planeas hacer consultas geoespaciales, crea un índice
embarcacionSchema.index({ "ubicacion_embarcacion.coordinates": "2dsphere" });

export const Embarcacion = mongoose.model("embarcaciones", embarcacionSchema);

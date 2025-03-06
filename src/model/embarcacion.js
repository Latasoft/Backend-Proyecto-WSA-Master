import mongoose from "mongoose";

// Subesquema para cada acción dentro de un estado
const accionSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    fecha: { type: Date, required: true }
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
      enum: ["puerto", "hotel", "aeropuerto"]
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
  permisos_embarcacion: [
    {
      nombre_permiso: { type: String }
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

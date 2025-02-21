import mongoose from "mongoose";

// Subesquema para la ubicación usando GeoJSON
const ubicacionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    default: 'Point'
  },
  // En GeoJSON, las coordenadas se guardan como [longitud, latitud]
  coordinates: {
    type: [Number],
    required: false
  },
  // Puedes agregar un timestamp para saber cuándo se registró la posición
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Esquema principal para la embarcación
const embarcacionSchema = new mongoose.Schema({
  titulo_embarcacion: {
    type: String,
    required: true
  },
  destino_embarcacion:{
    type:String,
    required:true
  },
  cliente_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "cliente",
    required: true
  },
  is_activated:{
    type:Boolean, default:true
},
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
  // Aquí se guarda el historial de ubicaciones (la ruta)
  ubicacion_embarcacion: [ubicacionSchema] 
}, {
  timestamps: true // Para registrar createdAt y updatedAt
});

// Si planeas hacer consultas geoespaciales, crea un índice en las coordenadas
embarcacionSchema.index({ "ubicacion_embarcacion.coordinates": "2dsphere" });

export const Embarcacion = mongoose.model('embarcaciones', embarcacionSchema);

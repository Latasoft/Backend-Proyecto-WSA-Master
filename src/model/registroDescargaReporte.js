import mongoose from "mongoose";
const registroDescargaRespoSchema= new mongoose.Schema({
    id_solicitante:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // el nombre del modelo de User
        required: true
      },
      fecha_descarga:{
        type: Date,
        default: Date.now
      },
      rango_fecha_inicio:{
        type: Date,
        required: true
      },
      rango_fecha_termino:{
        type: Date,
        required: true
      }
})

export const RegistroDescargaResporte= mongoose.model('registroDescargaReporte',registroDescargaRespoSchema)
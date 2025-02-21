import mongoose from "mongoose";
const clientSchema= new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user", // el nombre del modelo de User
        required: true
      },
    rut_cliente:{
        type:String,
        required:true,
        unique:true
    },
    nombre_cliente:{
        type:String,
        required:true
    },
    apellido_cliente:{
        type:String,
        required:true
    },
    foto_cliente:{type:String,required:false}


})

export const Client= mongoose.model('cliente',clientSchema)
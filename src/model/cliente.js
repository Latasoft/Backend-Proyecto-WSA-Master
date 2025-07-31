import mongoose from "mongoose";
const clientSchema= new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // el nombre del modelo de User
        required: true
      },
    pais_cliente:{
        type:String,
        required:true
    },
    empresa_cliente_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EmpresaCliente",
        required: false
    },
    nombre_cliente:{
        type:String,
        required:true
    },
    dato_contacto_cliente:{
        type:String,
        required:true
    },
    foto_cliente:{type:String,required:false}


})

export const Client= mongoose.model('cliente',clientSchema)
import mongoose from "mongoose";

const rolEnum=['ADMINISTRADOR','CLIENTE','TRABAJADOR','ASISTENTE','ADMINISTRATIVO']

const userSchema= new mongoose.Schema({

    
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    tipo_usuario:{
        type:String,
        enum:rolEnum,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    nombre_completo: {
        type: String,
        required: true
    },
    imagen_usuario: String,
    fcmTokens: {
        type: [String],
        default: []
    },
    puede_crear_nave: {
        type: Boolean,
        default: false
    },
    empresa_cliente: {
        type: String,
        default:''
    },
    pais_asignado: {
        type: String,
        default: ''
    },
    dato_contacto: {
        type: String,
        default: ''
    }
})

export const User= mongoose.model('User',userSchema)
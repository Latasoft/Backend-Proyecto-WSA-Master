import mongoose from 'mongoose';

const EmpresaClienteSchema = new mongoose.Schema({
  nombre_empresa: String,
  pais: String,
  direccion: String,
  telefono: String,
  correo: String,
  imagen_empresa: String,

  contacto_operativo: {
    nombre: String,
    cargo: String,
    correo: String,
    telefono: String
  },

  contacto_da: {
    nombre: String,
    cargo: String,
    correo: String,
    telefono: String
  }
}, {
  timestamps: true
});

export const EmpresaCliente = mongoose.model('EmpresaCliente', EmpresaClienteSchema);

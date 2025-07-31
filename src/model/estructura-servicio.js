import mongoose from 'mongoose';

const ServicioRelacionadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true }
});

const SubservicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  servicios: [ServicioRelacionadoSchema]
});

const EstructuraServicioSchema = new mongoose.Schema({
  principal: { type: String, required: true },
  subtitulo: { type: String },
  subservicios: [SubservicioSchema]
});

const EstructuraServicio = mongoose.model('estructura_servicios', EstructuraServicioSchema, 'estructura_servicios');

export default EstructuraServicio;

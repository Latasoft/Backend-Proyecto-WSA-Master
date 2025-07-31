import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Asegúrate de tener definido el modelo 'User'
  }],
  status:{type:Boolean, required:true},
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Grupo= mongoose.model('grupo',groupSchema)

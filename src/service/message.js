// service/mensajeService.js
import {Mensaje} from '../model/mensaje.js';
import { createMessageSchema } from '../dtos/mensajes/mensaje.js';

export class MensajeService {
  async crearMensaje(messageData) {
    try {
      // Validar y parsear los datos con Zod
      const parsedData = createMessageSchema.parse(messageData);
      
      // Crear y guardar el mensaje en la base de datos
      const newMessage = await Mensaje.create({
        group: parsedData.group,
        sender: parsedData.sender,
        content: parsedData.content
      });

      return { message: "Mensaje creado con éxito", mensaje: newMessage  };
    } catch (error) {
      console.error("Error al crear mensaje:", error);
      throw new Error(error.message);
    }
  }

  async listMessagesByGroup(groupId) {
    try {
      // Buscar mensajes pertenecientes a un grupo, ordenados por timestamp
      // y utilizando populate para traer el username del remitente
      const messages = await Mensaje.find({ group: groupId })
        .populate('sender', 'username')
        .sort({ timestamp: 1 });

      return { messages };
    } catch (error) {
      console.error("Error al listar mensajes:", error);
      throw new Error(error.message);
    }
  }
}

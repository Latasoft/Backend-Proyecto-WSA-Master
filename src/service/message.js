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

  async listMessagesByGroup(groupId, page = 1, limit = 20) {
    try {
      // Calcula el número de documentos a saltar
      const skip = (page - 1) * limit;
  
      // Busca y ordena los mensajes, aplicando skip y limit
      const messages = await Mensaje.find({ group: groupId })
        .populate('sender', 'username')
        .sort({ timestamp: 1 }) // Orden ascendente: primero los mensajes enviados primero
        .skip(skip)
        .limit(limit);
  
      // También puedes obtener el total de mensajes para calcular el número total de páginas
      const totalMessages = await Mensaje.countDocuments({ group: groupId });
      const totalPages = Math.ceil(totalMessages / limit);
  
      return { 
        messages,
        totalMessages,
        totalPages,
        currentPage: page
      };
    } catch (error) {
      console.error("Error al listar mensajes:", error);
      throw new Error(error.message);
    }
  }
  
}

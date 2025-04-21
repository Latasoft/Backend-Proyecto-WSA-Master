// service/mensajeService.js
import {Mensaje} from '../model/mensaje.js';
import {Grupo} from '../model/grupo.js';
import { createMessageSchema } from '../dtos/mensajes/mensaje.js';
import { MessageError } from '../utils/messageErrorUtil.js';
import { sendNotification } from '../utils/notificationUtil.js';
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
      // Popular el sender antes de devolver
      const mensajePopulado = await newMessage.populate('sender', 'username');

        // 3. Obtener miembros del grupo
    const grupo = await Grupo.findById(parsedData.group).populate('members', 'fcmTokens username _id');
    if (!grupo) throw new Error('Grupo no encontrado');

    

    return {
      message: "Mensaje creado con éxito",
      mensaje: mensajePopulado
    
    };
    } catch (error) {
      console.error("Error al crear mensaje:", error);
      throw new Error(error.message);
    }
  }

  async listMessagesByGroup(groupId, cursor, limit = 20, userId, role) {
    try {
      const grupo = await Grupo.findById(groupId);
      if (!grupo) {
        throw new MessageError('Grupo no encontrado', 404);
      }
  
      const esMiembro = grupo.members.includes(userId);
      const esAdmin = role === "ADMINISTRADOR";
  
      if (!esMiembro && !esAdmin) {
        throw new MessageError('No tienes permiso para ver los mensajes de este grupo', 403);
      }
  
      const query = { group: groupId };
  
      // Si hay cursor, buscar mensajes anteriores a ese ID
      if (cursor) {
        const mensajeCursor = await Mensaje.findById(cursor);
        if (mensajeCursor) {
          query.$or = [
            { sentAt: { $lt: mensajeCursor.sentAt } },
            { sentAt: mensajeCursor.sentAt, _id: { $lt: mensajeCursor._id } }
          ];
        }
      }
  
      const messages = await Mensaje.find(query)
        .populate('sender', 'username')
        .sort({ sentAt: -1, _id: -1 }) // trae los más recientes primero
        .limit(limit);
  
      return {
        messages: messages.reverse(), // devuelve en orden ascendente
        hasMore: messages.length === limit,
        cursor: messages.length ? messages[0]._id : null
      };
  
    } catch (error) {
      console.error("Error al listar mensajes:", error);
      throw new Error(error.message);
    }
  }
  
  
}

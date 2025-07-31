// controllers/mensajeController.js
import { MensajeService } from '../service/message.js';
const mensajeService = new MensajeService();
import { getSocketIO } from '../config/socket.js';
import { MessageError } from '../utils/messageErrorUtil.js';

export async function createMensajeController(req, res) {
    try {
      // Se espera que req.body contenga: { group, sender, content }
      const result = await mensajeService.crearMensaje(req.body);
      
      
      // Antes de emitir, verificamos que el grupo esté definido
      if (!req.body.group) {
        console.warn("No se especificó el grupo en el body");
      } else {
        console.log("Grupo:", req.body.group);
        console.log("Mensaje:", result.mensaje);
        
        getSocketIO().to(req.body.group).emit("newMessage", result.mensaje);
      }
      
      return res.status(201).json(result);
    } catch (error) {
      console.error("Error en createMensajeController:", error);
      return res.status(500).json({ message: error.message });
    }
  }


export async function listMessagesController(req, res) {
  try {
    // Se espera que el ID del grupo venga en la URL (por ejemplo, /api/messages/:groupId)
    const groupId = req.params.groupId;
    const { _id: userId, role } = req.user;
    const cursor = req.query.cursor;
    const limit = parseInt(req.query.limit || '20');
    
    const result = await mensajeService.listMessagesByGroup(
      groupId,
      cursor,
      parseInt(limit),
      userId,
      role
    );
    return res.status(200).json(result);
  } catch (error) {
    
    if (error.name === 'Error') {
      
      return res.status(error.statusCode || 400).json({ message: error.message });
    }
    

    return res.status(500).json({ message: "Error inesperado en el servidor" });

  }
}

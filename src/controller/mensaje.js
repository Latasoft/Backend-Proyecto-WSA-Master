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
    const { page = 1, limit = 20 } = req.query;
    const { _id: userId, role } = req.user;
    
    const result = await mensajeService.listMessagesByGroup(
      groupId,
      parseInt(page),
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

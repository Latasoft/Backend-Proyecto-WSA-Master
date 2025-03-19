// controllers/mensajeController.js
import { MensajeService } from '../service/message.js';
const mensajeService = new MensajeService();
import { getSocketIO } from '../config/socket.js';

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
    const result = await mensajeService.listMessagesByGroup(groupId);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Error en listMessagesController:", error);
    return res.status(500).json({ message: error.message });
  }
}

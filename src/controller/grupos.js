import {  GrupoService } from "../service/grupo.js";
const grupoService= new GrupoService();
import { getSocketIO } from "../config/socket.js";

export async function createGrupo(req,res){
    try {
        // Se espera que req.body tenga la estructura validada por Zod en el service.
        const result = await grupoService.crearGrupo(req.body);

        // Si quieres limitar la emisión a una sala específica, usa: getSocketIO().to(room).emit(...)
        getSocketIO().emit("groupCreated", result.grupo);
    
        return res.status(201).json(result);
      } catch (error) {
        console.error("Error en createGroupController:", error);
        return res.status(500).json({ message: error.message });
      }
}


export const addMemberController = async (req, res) => {
    try {
      const groupId = req.params._id; // Se recibe el ID del grupo por la URL
      const { userId } = req.body; // Se espera que el body contenga el userId a agregar
  
      const result = await grupoService.addMemberToGroup(groupId, userId);
      // Si el grupo no fue encontrado, el service devuelve un mensaje específico
      if (result.message === "Grupo no encontrado") {
        return res.status(404).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error en addMemberController:", error);
      return res.status(500).json({ message: error.message });
    }
  };
  
  export const removeMemberController = async (req, res) => {
    try {
      const groupId = req.params._id; // Se recibe el ID del grupo por la URL
      const { userId } = req.body; // Se espera que el body contenga el userId a remover
  
      const result = await grupoService.removeMemberFromGroup(groupId, userId);
      if (result.message === "Grupo no encontrado") {
        return res.status(404).json(result);
      }
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error en removeMemberController:", error);
      return res.status(500).json({ message: error.message });
    }
  };

  export const listGroupsForAdmin = async(req,res)=>{
    try {
      const page = parseInt(req.query.page) || 1;

        const result = await grupoService.listGrupsForAdmin(page);
        if (result.message) {
          return res.status(404).json(result);
        }
        return res.status(200).json(result);
      } catch (error) {
        console.error("Error en listUsersInGroupController:", error);
        return res.status(500).json({ message: error.message });
      }

  }
  export const getGruposByUserId = async (req, res) => {
    const userId = req.params._id;
    const page = parseInt(req.query.page) || 1;
  
    if (!userId) {
      return res.status(400).json({ message: "Falta el ID del usuario" });
    }
  
    try {
      const result = await grupoService.listGruposByUserIdPaginated(userId, page);
      return res.status(200).json(result);
    } catch (error) {
      console.error("Error en getGruposByUserId:", error);
      return res.status(500).json({ message: error.message });
    }
  };
  export const getGrupoById = async (req, res) => {
    try {
      const groupId = req.params._id;
      console.log(groupId);
  
      const response = await grupoService.getGrupoById(groupId);
      return res.status(200).json(response);
  
    } catch (error) {
      console.error("Error en getGrupoById:", error.message);
      return res.status(500).json({ message: error.message });
    }
  };
  
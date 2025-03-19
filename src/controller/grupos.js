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

  export const listEmployeesInGrouop = async(req,res)=>{
    try {
        const groupId = req.params._id; // Se espera que el ID del grupo venga en la URL
        const result = await grupoService.listEmployeeInGrouop(groupId);
        if (result.message) {
          return res.status(404).json(result);
        }
        return res.status(200).json(result);
      } catch (error) {
        console.error("Error en listUsersInGroupController:", error);
        return res.status(500).json({ message: error.message });
      }

  }
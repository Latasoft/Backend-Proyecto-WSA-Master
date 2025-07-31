import {Grupo} from "../model/grupo.js";
import { createGroupSchema } from "../dtos/grupos/grupo.js";

export class GrupoService {
  async crearGrupo(grupoData) {
    try {
      // Validar y parsear los datos con Zod
      const grupoParsedData = createGroupSchema.parse(grupoData);

      // Crear y guardar el grupo en la base de datos
      const newGrupo = await Grupo.create({
        name: grupoParsedData.name,
        members: grupoParsedData.members || [],
        status:grupoParsedData.status,
      });

      return { message: 'Grupo creado con éxito' ,grupo: newGrupo};
    } catch (error) {
      console.error('Error al crear grupo:', error);
      // Se puede lanzar el error para que el controlador lo maneje o devolver una respuesta controlada
      throw new Error(error.message);
    }
  } 
  async addMemberToGroup(groupId, userId){
    try{

        const existeGrupo= await Grupo.findById(groupId)

        if(!existeGrupo){
            return {meesage:'Grupo no encontrado'}
        }

        const grupoActualizado= await Grupo.findByIdAndUpdate(
            groupId,
                {$addToSet:{members:userId}},
                {new :true}
            
        )

        return { message: 'Miembro agregado con éxito'};

    }catch(error){
        console.error('Error al agregar miembro:', error);
        throw new Error(error.message);

    }
  }
  async removeMemberFromGroup(groupId, userId) {
    try {
      // Buscar el grupo por su ID
      const grupoExistente = await Grupo.findById(groupId);
      if (!grupoExistente) {
        return { message: 'Grupo no encontrado' };
      }
      
      // Remover el miembro usando $pull
      const grupoActualizado = await Grupo.findByIdAndUpdate(
        groupId,
        { $pull: { members: userId } },
        { new: true }
      );
      
      return { message: 'Miembro removido con éxito', grupo: grupoActualizado };
    } catch (error) {
      console.error('Error al quitar miembro:', error);
      throw new Error(error.message);
    }
  }
  async listGrupsForAdmin(page = 1, limit = 5) {
    try {
      const skip = (page - 1) * limit;
  
      // Traemos todos los grupos paginados
      const grupos = await Grupo.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(); // lean() mejora rendimiento
  
      // Obtenemos la cantidad total
      const total = await Grupo.countDocuments();
  
      // Para cada grupo, populamos parcialmente los primeros 3 miembros
      const gruposConMiembros = await Promise.all(
        grupos.map(async (grupo) => {
          const grupoConMiembros = await Grupo.findById(grupo._id)
            .populate({
              path: "members",
              select: "_id username",
              options: { limit: 3 } // Solo los primeros 3
            })
            .lean();
  
          return {
            _id: grupo._id,
            name: grupo.name,
            status: grupo.status,
            members: grupoConMiembros.members
          };
        })
      );
  
      return {
        data: gruposConMiembros,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      };
    } catch (error) {
      console.error("Error al listar grupos para admin:", error);
      throw new Error("Error interno del servidor");
    }
  }
  async listGruposByUserIdPaginated(userId, page = 1, limit = 5) {
    try {
      const skip = (page - 1) * limit;
  
      const query = {
        members: userId,
        status: true // ✅ solo grupos activos
      };
  
      const grupos = await Grupo.find(query)
        .select('_id name status')
        .skip(skip)
        .limit(limit)
        .lean();
  
      const total = await Grupo.countDocuments(query);
  
      return {
        data: grupos,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      };
    } catch (error) {
      console.error("Error al listar grupos activos por usuario:", error);
      throw new Error("Error interno del servidor");
    }
  }

  async getGrupoById(groupId) {
    try {
      const group = await Grupo.findById(groupId); // <-- te faltaba el `await`
      if (!group) {
        throw new Error("Grupo no encontrado");
      }
  
      return {
        message: "Grupo encontrado",
        data: group,
      };
    } catch (error) {
      throw new Error(`Error al obtener el grupo por ID: ${error.message}`);
    }
  }
  
  async updateGrupo(groupId, updateData) {
    try {
      const grupoParsedData=createGroupSchema.parse(updateData)
      const grupoActualizado = await Grupo.findByIdAndUpdate(
        groupId,
        grupoParsedData,
        { new: true, runValidators: true }
      ).lean();

      if (!grupoActualizado) {
        throw { status: 404, message: 'Grupo no encontrado' };
      }

      return {
        message: 'Grupo actualizado con éxito'
      };
    } catch (error) {
      console.error('Error en GrupoService.updateGrupo:', error);
      throw new Error(error.message);
    }
  }

  
  
}

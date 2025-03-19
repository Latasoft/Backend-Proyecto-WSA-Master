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
  async listEmployeeInGrouop(groupId){
    try{
         // Se utiliza populate para traer la información de los usuarios
      const grupo = await Grupo.findById(groupId).populate("members", "_id username");
      if (!grupo) {
        return { message: "Grupo no encontrado" };
      }
      // Retorna solo el array de miembros con _id y name
      return { members: grupo.members };

    }catch(error){
        console.error("Error al listar usuarios en el grupo:", error);
      throw new Error(error.message);

    }
  }
}

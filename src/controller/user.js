import {  UserService } from "../service/user.js";
import { User } from "../model/user.js";
import { EmailService } from "../service/email.js"; 
const userService= new UserService();


export const actualizarCampo = async (req, res) => {
  try {
    const { _id } = req.params;
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(_id, updates, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({
      message: 'Usuario actualizado correctamente',
      user: updatedUser
    });
  } catch (err) {
    console.error('❌ Error al actualizar usuario:', err);
    res.status(500).json({ message: 'Error al actualizar usuario', error: err.message });
  }
};

export async function createUser(req, res) {
  try {
    // Crear el usuario (el servicio ya maneja el envío de correos)
    const response = await userService.createUser(req.body);
    
    // Si llegamos aquí, el usuario se creó exitosamente
    res.status(201).json(response);

  } catch (error) {
    console.error("❌ Error al crear usuario:", error.message);
    res.status(error.status || 500).json({ message: error.message });
  }
}

export async function updateUser(req,res){
    try{
        const { _id } = req.params;
      const userData = req.body;
      
      
      const updatedUser = await userService.updateUser(_id, userData);
      
      res.status(201).json(
        updatedUser 
      );

    }
    catch(error){
        console.error(error.message);
        res.status(error.status || 500).json({ message: error.message})
    }
}


export async function findUserById(req,res){
    const {_id} = req.params;

    
    const response = await userService.findById(_id)

    res.status(200).json(
        response
    )

}

export async function getAllUsersPaginated(req, res) {
    try {
        // Obtener los parámetros de la solicitud, como `page` y `limit`
        const { page = 1, limit = 10,role } = req.query;

        // Llamar al método del servicio para obtener los usuarios paginados
        const result = await userService.getAllUsersPaginated(page, limit,role);

        // Devolver la respuesta con los datos de la paginación
        res.status(200).json(result);
    } catch (error) {
        // Manejar los errores
        console.error('Error al obtener usuarios:',error.message);
        res.status(error.status || 500).json({ message: error.message})
    }
}

export async function getAllEmployes(req,res){
    try{
         // Llamar al método del servicio para obtener los usuarios paginados
         const result = await userService.getUsersEmploye();

         res.status(200).json(result)

    }catch(error){
        res.status(error.status || 500).json({ message: error.message})

    }
}

export async function saveFcmTokenController(req, res) {
    try {
      const userId = req.user._id; // asegurado por middleware de autenticación
      const { fcmToken } = req.body;
  
      if (!fcmToken) {
        return res.status(400).json({ message: 'FCM Token es requerido' });
      }
  
      const result = await userService.registroFmcToken(userId, fcmToken);
      return res.status(200).json(result);
  
    } catch (error) {
      console.error('Error guardando FCM Token:', error.message);
      return res.status(500).json({ message: 'Error al guardar el token FCM' });
    }
  }

  export async function deleteUserById(req,res){
    try{
        const {_id}= req.params;
        const response= await userService.deleteUserById(_id)
        res.status(200).json(response)
    }catch(error){
        res.status(error.status || 500).json({ message: error.message  });
    }

    
}
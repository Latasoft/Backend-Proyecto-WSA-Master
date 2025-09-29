import {  UserService } from "../service/user.js";
import { User } from "../model/user.js";
import { EmailService } from "../service/email.js"; 
import { convertImageToBase64 } from '../middleware/uploadFile.js';
import { UserSchema, UpdateUserSchema } from '../dtos/users/user.js';
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
    // Procesar imagen si existe
    if (req.files && req.files.length > 0) {
      const imageFile = req.files.find(file => 
        file.fieldname === 'imagen_usuario' || 
        file.fieldname === 'imagen' || 
        file.mimetype.startsWith('image/')
      );
      
      if (imageFile) {
        req.body.imagen_usuario = convertImageToBase64(imageFile);
      }
    } else if (req.body.imagen) {
      req.body.imagen_usuario = req.body.imagen;
    }

    // Validar datos con Zod
    try {
      const validatedData = UserSchema.parse(req.body);
      req.body = validatedData;
    } catch (validationError) {
      console.error('❌ Error de validación:', validationError.errors);
      return res.status(400).json({ 
        message: 'Datos inválidos', 
        errors: validationError.errors.map(err => err.message)
      });
    }

    const response = await userService.createUser(req.body);
    
    res.status(201).json(response);

  } catch (error) {
    console.error("❌ Error al crear usuario:", error.message);
    res.status(error.status || 500).json({ message: error.message });
  }
}

export async function updateUser(req,res){
  try{
      const { _id } = req.params;
      let userData = req.body;
      
      // Obtener usuario actual para mantener imagen existente si no se envía nueva
      const userActual = await User.findById(_id);
      if (!userActual) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Procesar imagen: si se envía nueva imagen, usarla; si no, mantener la existente
      if (req.files && req.files.length > 0) {
        const imageFile = req.files.find(file => 
          file.fieldname === 'imagen_usuario' || 
          file.fieldname === 'imagen' || 
          file.mimetype.startsWith('image/')
        );
        
        if (imageFile) {
          userData.imagen_usuario = convertImageToBase64(imageFile);
        } else {
          userData.imagen_usuario = userActual.imagen_usuario;
        }
      } else if (req.body.imagen) {
        userData.imagen_usuario = req.body.imagen;
      } else {
        userData.imagen_usuario = userActual.imagen_usuario;
      }

      // Validar datos con Zod para actualización
      try {
        const validatedData = UpdateUserSchema.parse(userData);
        userData = validatedData;
      } catch (validationError) {
        console.error('❌ Error de validación en actualización:', validationError.errors);
        return res.status(400).json({ 
          message: 'Datos inválidos para actualización', 
          errors: validationError.errors.map(err => err.message)
        });
      }
      
      const updatedUser = await userService.updateUser(_id, userData);
      
      res.status(200).json(updatedUser);

  }
  catch(error){
      console.error('❌ Error al actualizar usuario:', error.message);
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
        const { page = 1, limit = 10, role = '', searchTerm = '' } = req.query;

        // Pasar todos los parámetros a la función del servicio
        const result = await userService.getAllUsersPaginated(page, limit, role, searchTerm);

        res.status(200).json(result);
    } catch (error) {
        console.error('Error al obtener usuarios:', error.message);
        res.status(error.status || 500).json({ message: error.message });
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

export async function toggleUserStatus(req, res) {
    try {
        const { _id } = req.params;
        const { activo } = req.body;
        
        const updatedUser = await User.findByIdAndUpdate(
            _id, 
            { activo }, 
            { new: true }
        );
        
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}

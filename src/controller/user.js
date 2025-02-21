import {  UserService } from "../service/user.js";
const userService= new UserService();
export async function createUser(req,res){
    try{
        
        const response= await userService.createUser(req.body)
        res.status(201).json(response);
    }catch(error){
        console.error(error.message);
        throw new Error('Error crenado usuario.');

    }
}

export async function updateUser(req,res){
    const { _id } = req.params;
      const userData = req.body;
      
      
      const updatedUser = await userService.updateUser(_id, userData);
      
      res.status(201).json(
        updatedUser 
      );
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
        const { page = 1, limit = 10 } = req.query;

    
        // Llamar al método del servicio para obtener los usuarios paginados
        const result = await userService.getAllUsersPaginated(page, limit);

        // Devolver la respuesta con los datos de la paginación
        res.status(200).json(result);
    } catch (error) {
        // Manejar los errores
        console.error('Error al obtener usuarios:',error.message);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export async function getAllEmployes(req,res){
    try{
         // Llamar al método del servicio para obtener los usuarios paginados
         const result = await userService.getUsersEmploye();

         res.status(200).json(result)

    }catch(error){
        throw error

    }
}

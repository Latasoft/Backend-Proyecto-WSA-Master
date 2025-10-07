import { User } from "../model/user.js";
import { Client } from "../model/cliente.js";
import { UserSchema,UpdateUserSchema } from "../dtos/users/user.js";
import { hashPassword } from "../utils/bcryptUtil.js";
import{EmailService} from "../service/email.js"
import { FRONTEND_URL } from "../config/config.js";
import { generateResetToken } from "../utils/jwtUtil.js";
export class UserService{
    async createUser(data) {
        try {
          // 1. Validar y crear User
          const userDataParsed = UserSchema.parse(data);
          const hashedPassword = await hashPassword(userDataParsed.password);
      
          const newUser = await User.create({
            username: userDataParsed.username,
            password: hashedPassword,
            tipo_usuario: userDataParsed.tipo_usuario,
            email:userDataParsed.email,
            empresa_cliente: data.empresa_cliente || ''
          });
      
          // 2. Si es CLIENTE, crear el Client
          if (userDataParsed.tipo_usuario === "CLIENTE") {
            const {  nombre_cliente, pais_cliente,dato_contacto_cliente ,foto_cliente, empresa_cliente_id } = data;
      
            try {
              await Client.create({
                userId: newUser._id,
                pais_cliente,
                nombre_cliente,
                dato_contacto_cliente,
                foto_cliente: foto_cliente || "",
                empresa_cliente_id: empresa_cliente_id || undefined,
              });
            } catch (errorCliente) {
                console.error('❌ Error real al crear cliente:', errorCliente.message); // 👈 para ver el problema real
                await User.findByIdAndDelete(newUser._id);
                throw { status: 400, message: 'Error al registrar cliente. Verifica los datos ingresados.' };
              }

          }
           // 4. 🔥 Enviar correo de bienvenida + link de creación de contraseña
          const token = generateResetToken(newUser._id);
          const linkCambioPassword = `${FRONTEND_URL}/change-password?token=${token}`;

          await EmailService.enviarCorreoCreacionUsuarioYUpdatePassword(
            newUser.email,
            newUser.username,
            data.password,
            linkCambioPassword
          );
      
          // 3. Si todo salió bien
          return { message: "Usuario registrado correctamente" };
        } catch (error) {
          // Errores de duplicidad o cualquier otro
          if (error.code === 11000 && error.keyValue?.username) {
            throw new Error("El nombre de usuario ya existe");
          }
          throw new Error("Error al crear el usuario: " + error.message);
        }
      }
      

    
  // ... resto de métodos
    async updateUser(_id, data) {
        console.log()
        const existeUsuario = await User.findById(_id);

        if (!existeUsuario) {
            return { message: 'Usuario no encontrado' };
        }

        // Parseamos los datos con el esquema
        const parsedUser = UpdateUserSchema.parse(data);

        // Verificamos si hay una nueva contraseña
        if (parsedUser.password) {
            // Si se pasa una nueva contraseña, la encriptamos y la actualizamos
            const hashedPassword = await hashPassword(parsedUser.password);
            existeUsuario.password = hashedPassword;
        }

        // Actualizar el resto de los datos, sin modificar la contraseña si no fue proporcionada
        existeUsuario.username = parsedUser.username || existeUsuario.username;
        existeUsuario.tipo_usuario = parsedUser.tipo_usuario || existeUsuario.tipo_usuario; // ⚠️ Era rol_usuario, debería ser tipo_usuario
        existeUsuario.email = parsedUser.email || existeUsuario.email;
        existeUsuario.empresa_cliente = parsedUser.empresa_cliente || existeUsuario.empresa_cliente;
        existeUsuario.nombre_completo = parsedUser.nombre_completo || existeUsuario.nombre_completo;
        existeUsuario.pais_asignado = parsedUser.pais_asignado || existeUsuario.pais_asignado;
        existeUsuario.activo = parsedUser.activo !== undefined ? parsedUser.activo : existeUsuario.activo;
        
        // Guardar los cambios
        await existeUsuario.save();

        // 🔥 IMPORTANTE: Devolver el usuario actualizado sin la contraseña
        const { password, ...userResponse } = existeUsuario.toObject();

        return { 
            message: 'Usuario actualizado correctamente',
            user: userResponse // 👈 Devolver los datos del usuario
        };
    }

    async findById(_id){
        console.log(_id)
        
        const existeUsuario = await User.findById(_id)

        if(!existeUsuario){
            return {message:'Usuario no existe'}
        }

        const { password, ...userResponse }= existeUsuario.toObject();

        return {message:'Usuario encontrado',userResponse}
    }

    async getAllUsersPaginated(page = 1, limit = 10,role) {
        // Calcular el número de registros a omitir
        const skip = (page - 1) * limit;
        const query = role ? { tipo_usuario: role } : {}; // Si no hay rol, trae todos

        
        try {
            // Obtener los usuarios paginados
            const users = await User.find(query)
                .skip(skip)       // Omitir los primeros registros (según la página)
                .limit(limit)     // Limitar la cantidad de resultados por página
                .exec();
              
        
            // Contar el total de usuarios para saber cuántas páginas hay
            const totalUsers = await User.countDocuments(query);
    
            // Retornar los usuarios y la información de la paginación
            return {
                message: 'Usuarios encontrados',
                users,
                totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page
            };
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return { message: 'Error al obtener usuarios', error: error.message };
        }
    }

    async getUsersEmploye(page = 1, limit = 10) {
      try {
        const rol = 'TRABAJADOR';
        const skip = (page - 1) * limit;
    
        // Consulta paginada para obtener solo los trabajadores
        const trabajadores = await User.find({ tipo_usuario: rol })
          .skip(skip)
          .limit(limit)
          .select('-password'); // Ejemplo: excluimos el campo password
    
        // Verificamos si se encontraron registros
        if (trabajadores.length === 0) {
          return { message: 'No existen usuarios con el rol asociado' };
        }
    
        // Obtenemos el total para la paginación
        const total = await User.countDocuments({ tipo_usuario: rol });
    
        return {
          message: 'Trabajadores encontrados',
          trabajadores,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
          }
        };
      } catch (error) {
        throw error;
      }
    }
    async registroFmcToken(userId, fcmToken ){
      const user = await User.findById(userId)

      if(!user){
        throw new Error("Error Usuario no existe")
      }

          // Verificar si el token ya existe
      if (!user.fcmTokens.includes(fcmToken)) {
        user.fcmTokens.push(fcmToken);
        await user.save();
      }
      return {
        message: "Token FCM actualizado correctamente",
      };


    }
    
    async deleteUserById(_id){
      try{
        const usuario= await User.findById(_id)
        if(!usuario){
          throw {status:404,message:'Usuario no existe'}
        }
        if (usuario.tipo_usuario === 'CLIENTE') {
          await Client.findOneAndDelete({ userId: _id });
        }
    
        await User.findByIdAndDelete(_id);

        return { message: 'Usuario eliminado correctamente' };
      }catch(error){
        console.error('Error al eliminar usuario:', error);
        throw {
          status: error.status || 500,
          message: error.message || 'Error interno al eliminar usuario'
        };
      }


    }
    
}

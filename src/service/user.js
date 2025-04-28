
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
            email:userDataParsed.email
          });
      
          // 2. Si es CLIENTE, crear el Client
          if (userDataParsed.tipo_usuario === "CLIENTE") {
            const { rut_cliente, nombre_cliente, apellido_cliente, foto_cliente } = data;
      
            try {
              await Client.create({
                userId: newUser._id,
                rut_cliente,
                nombre_cliente,
                apellido_cliente,
                foto_cliente: foto_cliente || "",
              });
            } catch (errorCliente) {
              // Si falla la creación del cliente, borramos el User recién creado
              await User.findByIdAndDelete(newUser._id);
              throw {status: 401,message:'Error al registrar rut cliente ya existe'}
            }
          }
           // 4. 🔥 Enviar correo de bienvenida + link de creación de contraseña
          const token = generateResetToken(newUser._id);
          const linkCambioPassword = `${FRONTEND_URL}/change-password?token=${token}`;

          await EmailService.enviarCorreoCreacionUsuarioYUpdatePassword(
            newUser.email,
            newUser.username,
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
            const hashedPassword = await hashPassword(parsedUser.password);  // Suponiendo que tienes un método para encriptar
            existeUsuario.password = hashedPassword;
        }
    
        // Actualizar el resto de los datos, sin modificar la contraseña si no fue proporcionada
        existeUsuario.username = parsedUser.username || existeUsuario.username;
        existeUsuario.rol_usuario = parsedUser.tipo_usuario || existeUsuario.rol_usuario;
        existeUsuario.email = parsedUser.email || existeUsuario.email;
        // Guardar los cambios
        await existeUsuario.save();
    
        return { message: 'Usuario actualizado correctamente' };
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

    async getAllUsersPaginated(page = 1, limit = 10) {
        // Calcular el número de registros a omitir
        const skip = (page - 1) * limit;
    
        try {
            // Obtener los usuarios paginados
            const users = await User.find()
                .skip(skip)       // Omitir los primeros registros (según la página)
                .limit(limit)     // Limitar la cantidad de resultados por página
                .exec();
    
            // Contar el total de usuarios para saber cuántas páginas hay
            const totalUsers = await User.countDocuments();
    
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
    
    
}

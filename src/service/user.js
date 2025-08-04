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
          // 1. Validar datos
          const userDataParsed = UserSchema.parse(data);
          
          // 2. Verificar si el usuario o email ya existen
          const existingUser = await User.findOne({
            $or: [
              { username: userDataParsed.username },
              { email: userDataParsed.email }
            ]
          });
          
          if (existingUser) {
            if (existingUser.username === userDataParsed.username) {
              throw { status: 400, message: "El nombre de usuario ya existe" };
            }
            if (existingUser.email === userDataParsed.email) {
              throw { status: 400, message: "El email ya está registrado" };
            }
          }
          
          // 3. Crear User
          const hashedPassword = await hashPassword(userDataParsed.password);
      
          const newUser = await User.create({
            username: userDataParsed.username,
            password: hashedPassword,
            tipo_usuario: userDataParsed.tipo_usuario,
            email:userDataParsed.email,
            empresa_cliente: data.empresa_cliente || ''
          });
      
          // 4. Si es CLIENTE, crear el Client
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
           // 5. 🔥 Enviar correo de bienvenida + link de creación de contraseña (opcional)
          try {
            const token = generateResetToken(newUser._id);
            const linkCambioPassword = `${FRONTEND_URL}/change-password?token=${token}`;

            await EmailService.enviarCorreoCreacionUsuarioYUpdatePassword(
              newUser.email,
              newUser.username,
              data.password,
              linkCambioPassword
            );
          } catch (emailError) {
            console.warn('⚠️ No se pudo enviar el correo de bienvenida:', emailError.message);
            // No lanzamos error, solo registramos el warning
          }
      
          // 6. Si todo salió bien
          return { message: "Usuario registrado correctamente" };
        } catch (error) {
          console.error('❌ Error en createUser:', error);
          
          // Errores de duplicidad de MongoDB
          if (error.code === 11000) {
            if (error.keyValue?.username) {
              throw { status: 400, message: "El nombre de usuario ya existe" };
            }
            if (error.keyValue?.email) {
              throw { status: 400, message: "El email ya está registrado" };
            }
          }
          
          // Errores de validación de Zod
          if (error.name === 'ZodError') {
            const firstError = error.errors[0];
            throw { status: 400, message: firstError.message };
          }
          
          // Si ya tiene status y message, lo pasamos tal como está
          if (error.status && error.message) {
            throw error;
          }
          
          // Error genérico
          throw { status: 500, message: "Error interno del servidor al crear usuario" };
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
        existeUsuario.empresa_cliente = parsedUser.empresa_cliente || existeUsuario.empresa_cliente;
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

    async getAllUsersPaginated(page = 1, limit = 10, role, searchTerm = '') {
      try {
        page = Number(page);
        limit = Number(limit);
        if (page < 1) page = 1;
        if (limit < 1) limit = 10;

        const skip = (page - 1) * limit;
        const conditions = [];

        if (role) {
          conditions.push({ tipo_usuario: role });
        }

        if (searchTerm && searchTerm.trim() !== '') {
          conditions.push({
            $or: [
              { username: { $regex: searchTerm, $options: 'i' } },
              { email: { $regex: searchTerm, $options: 'i' } },
            ],
          });
        }

        // Si hay condiciones, usamos $and, si no, {} para traer todo
        const query = conditions.length > 0 ? { $and: conditions } : {};

        const users = await User.find(query).skip(skip).limit(limit).exec();
        const totalUsers = await User.countDocuments(query);

        return {
          message: 'Usuarios encontrados',
          users,
          totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
          currentPage: page,
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

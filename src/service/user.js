import { User } from "../model/user.js";
import { Client } from "../model/cliente.js";
import { EmpresaCliente } from "../model/empresa-cliente.js";
import { hashPassword } from "../utils/bcryptUtil.js";
import{EmailService} from "../service/email.js"
import { FRONTEND_URL } from "../config/config.js";
import { generateResetToken } from "../utils/jwtUtil.js";
import { UpdateUserSchema } from "../dtos/users/user.js";
export class UserService{
    async createUser(data) {
        try {
          console.log('📝 Datos recibidos:', { 
            username: data.username, 
            email: data.email, 
            tipo_usuario: data.tipo_usuario,
            timestamp: new Date().toISOString()
          });
          
          // 1. Verificar si el usuario o email ya existen
          const existingUser = await User.findOne({
            $or: [
              { username: data.username },
              { email: data.email }
            ]
          });
          
          console.log('🔍 Usuario existente:', existingUser ? 'SÍ' : 'NO');
          
          // Verificación adicional para evitar duplicados concurrentes
          if (existingUser) {
            if (existingUser.username === data.username) {
              throw { status: 400, message: "El nombre de usuario ya existe" };
            }
            if (existingUser.email === data.email) {
              throw { status: 400, message: "El email ya está registrado" };
            }
          }
          
          if (existingUser) {
            if (existingUser.username === data.username) {
              throw { status: 400, message: "El nombre de usuario ya existe" };
            }
            if (existingUser.email === data.email) {
              throw { status: 400, message: "El email ya está registrado" };
            }
          }
          
          // 2. Crear User
          const hashedPassword = await hashPassword(data.password);
      
          const newUser = await User.create({
            username: data.username,
            password: hashedPassword,
            tipo_usuario: data.tipo_usuario,
            email: data.email,
            nombre_completo: data.nombre_completo,
            imagen_usuario: data.imagen_usuario || '',
            empresa_cliente: data.empresa_cliente || '',
            pais_asignado: data.pais_asignado || '',
            dato_contacto: data.dato_contacto_cliente || ''
          });
      
          // 3. Si es CLIENTE, crear el Client
          if (data.tipo_usuario === "CLIENTE") {
            const {  nombre_cliente, pais_cliente,dato_contacto_cliente ,foto_cliente, empresa_cliente_id, empresa_cliente } = data;
            
            // Buscar empresa cliente por nombre si se proporciona
            let empresaClienteId = empresa_cliente_id;
            if (empresa_cliente && !empresa_cliente_id) {
              try {
                const empresaEncontrada = await EmpresaCliente.findOne({ 
                  nombre_empresa: empresa_cliente 
                });
                if (empresaEncontrada) {
                  empresaClienteId = empresaEncontrada._id;
                  console.log('🏢 Empresa cliente encontrada:', empresaEncontrada.nombre_empresa);
                }
              } catch (errorEmpresa) {
                console.warn('⚠️ Error al buscar empresa cliente:', errorEmpresa.message);
              }
            }
      
            try {
              await Client.create({
                userId: newUser._id,
                pais_cliente,
                nombre_cliente,
                dato_contacto_cliente,
                foto_cliente: foto_cliente || "",
                empresa_cliente_id: empresaClienteId || undefined,
              });
            } catch (errorCliente) {
                console.error('❌ Error real al crear cliente:', errorCliente.message); // 👈 para ver el problema real
                await User.findByIdAndDelete(newUser._id);
                throw { status: 400, message: 'Error al registrar cliente. Verifica los datos ingresados.' };
              }

          }
           // 4. 🔥 Enviar correo de bienvenida + link de creación de contraseña (opcional) - DESACTIVADO TEMPORALMENTE
          /*
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
          */
      
          // 5. Si todo salió bien
          console.log('✅ Usuario creado exitosamente:', newUser._id);
          return { 
            message: "Usuario registrado correctamente",
            user: {
              id: newUser._id,
              username: newUser.username,
              email: newUser.email,
              tipo_usuario: newUser.tipo_usuario,
              imagen_usuario: newUser.imagen_usuario,
              pais_asignado: newUser.pais_asignado
            }
          };
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
          
          // Errores de validación (removido Zod)
          if (error.name === 'ValidationError') {
            const firstError = Object.values(error.errors)[0];
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

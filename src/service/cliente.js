import { Client } from "../model/cliente.js";
import { subirArchivoAFirebase,eliminarArchivoAntiguo } from "../utils/firebaseUtil.js";
import { ClienteSchema } from "../dtos/clientes/cliente.js";

export class ClienteService {
  
  async actualizarCliente(_id, data, file) {
    try {
      // 1. Recuperar el cliente actual
      const clienteExistente = await Client.findOne({userId:_id});
      if (!clienteExistente) {
        throw new Error("Cliente no encontrado");
      }

      // 2. Actualizar datos de texto
      clienteExistente.nombre_cliente = data.nombre_cliente || clienteExistente.nombre_cliente;
      clienteExistente.pais_cliente = data.pais_cliente || clienteExistente.pais_cliente;
      clienteExistente.dato_contacto_cliente = data.dato_contacto_cliente || clienteExistente.dato_contacto_cliente;
      
      // Actualizar empresa_cliente_id si viene en los datos
      if (data.empresa_cliente_id) {
        clienteExistente.empresa_cliente_id = data.empresa_cliente_id;
      }

      // 3. Si llega un nuevo archivo en `file`, eliminar la foto anterior (si existe) y subir la nueva
      if (file) {
        // Verificamos si había una foto previa
        if (clienteExistente.foto_cliente) {
          // Llama a tu método para eliminar el archivo previo de Firebase
          await eliminarArchivoAntiguo(clienteExistente.foto_cliente);
        }
        // Subir nueva foto
        const urlFoto = await subirArchivoAFirebase(file, "Clientes", "foto");
        // Asignar la nueva URL
        clienteExistente.foto_cliente = urlFoto;
      }

      // 4. Guardamos los cambios
      await clienteExistente.save();

      return { message: "Cliente actualizado con éxito"};
    } catch (error) {
      if (error.code === 11000 && error.keyValue && error.keyValue.username) {
        // Puedes personalizar el mensaje
        return {message:'nombre de usuario ya existe'}
      }
      else{
        return {message:'Error Creando usuario'}
        
        
      }
      throw new Error("Error creadndo usuario",error);
    }
  }


  

  async buscarById(_id){
    

    const clientes= await Client.findOne({userId:_id}).lean()

    if(!clientes){
        return{message:'CLiente No existe'}
    }

    

    return {message:'Usuario encontado', clientes}

  }

    async traerCLientesPaginados(page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        try {
            // Obtener los usuarios paginados
            const clientes = await Client.find()
                .skip(skip)       // Omitir los primeros registros (según la página)
                .limit(limit)     // Limitar la cantidad de resultados por página
                .exec();

            // Contar el total de usuarios para saber cuántas páginas hay
            const totalClients = await Client.countDocuments();

            // Retornar los usuarios y la información de la paginación
            return {
                message: 'Usuarios encontrados',
                clientes,
                totalClients,
                totalPages: Math.ceil(totalClients / limit),
                currentPage: page
            };
        } catch (error) {
            console.error('Error al obtener clientes:', error);
            return { message: 'Error al obtener Clientes', error: error.message };
        }

    }
}

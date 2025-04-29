import { Embarcacion } from "../model/embarcacion.js";
import { Client } from "../model/cliente.js";
import { 
  EmbarcacionDto, 
   
} from "../dtos/embarcaciones/embarcacion.js";

export class EmbarcacionService {
  async crearEmbarcacion(data) {
    try {
      // Validamos y parseamos la data usando el DTO
      const validData = EmbarcacionDto.parse(data);

      console.log(validData)
      const embarcacion = await Embarcacion.create({
        titulo_embarcacion: validData.titulo_embarcacion,
        destino_embarcacion: validData.destino_embarcacion,
        fecha_arribo: validData.fecha_arribo || null, // ➡️ opcional
        fecha_zarpe: validData.fecha_zarpe || null, 
        clientes: validData.clientes,
        is_activated: validData.is_activated,
        trabajadores: validData.trabajadores,
        permisos_embarcacion: validData.permisos_embarcacion,
        // Se incluye la nueva propiedad para los servicios
        servicios: validData.servicios
        // Nota: Si tienes otros campos como ubicaciones, agrégalos aquí.
      });

      throw {status:201, message: 'Embarcacion creada exitosamente' };
    } catch (error) {
      
    }
  }

  async  actualizarServicioAccion(_id,  nombre_servicio, nombre_estado,acciones) {
     
    // Buscar la embarcación por id
    const embarcacion = await Embarcacion.findById(_id);
    if (!embarcacion) {
      return { message: 'Embarcación no encontrada' };
    }
  
    
    // Buscar el servicio dentro del documento
    const servicio = embarcacion.servicios.find(
      s => s.nombre_servicio.toLowerCase().trim() === nombre_servicio.toLowerCase().trim()
    );
    if (!servicio) {
      return { message: 'Servicio no encontrado' };
    }
    
    // Buscar el estado dentro del servicio
    const estado = servicio.estados.find(e => e.nombre_estado === nombre_estado);
    if (!estado) {
      return { message: 'Estado no encontrado' };
    }
    
    // Agregar las nuevas acciones al array de acciones del estado
    estado.acciones=acciones;
    
    // Guardar la actualización en la base de datos
    await embarcacion.save();
    
    return { message: 'Acciones agregadas al estado' };
  }
 
  async actualizarEmbarcacion(_id, data) {
    try {
      // Validar la data usando DTO
      const dataParsed = EmbarcacionDto.parse(data);
  
      // Buscar la embarcación existente para fusionar datos
      const embarcacionExistente = await Embarcacion.findById(_id);
      if (!embarcacionExistente) {
        throw {status:404, message: "Embarcación no encontrada" };
      }
  
      // Fusionar servicios existentes con los nuevos sin eliminar los previos
      const serviciosActualizados = [...embarcacionExistente.servicios];
  
      dataParsed.servicios.forEach((nuevoServicio) => {
        const index = serviciosActualizados.findIndex(
          (s) => s.nombre_servicio === nuevoServicio.nombre_servicio
        );
  
        if (index === -1) {
          // 🔹 Si el servicio no existe, lo agregamos
          serviciosActualizados.push(nuevoServicio);
        } else {
          // 🔹 Si ya existe, mantenemos el servicio sin modificar
          serviciosActualizados[index] = {
            ...serviciosActualizados[index],
            estados: [...serviciosActualizados[index].estados, ...nuevoServicio.estados],
          };
        }
      });
  
      // Actualizar la embarcación
      const updatedEmbarcacion = await Embarcacion.findByIdAndUpdate(
        _id,
        {
          ...dataParsed,
          servicios: serviciosActualizados, // Mantener servicios anteriores + nuevos
        },
        { new: true, runValidators: true } // Aplicar validaciones
      );
  
      return {status:201, message: "Embarcación actualizada con éxito", data: updatedEmbarcacion };
    } catch (error) {
      console.error("Error en actualizarEmbarcacion:", error);
      throw error;
    }
  }
   

  async getEmbarcacionById(_id) {
    // 1. Busca la embarcación en la BD
    const embarcacionDoc = await Embarcacion.findById(_id);
    if (!embarcacionDoc) {
      throw { status: 404, message: 'Embarcacion  no encontrado' };
    }
  
    // Conviertes a objeto para manipularlo más fácil.
    const embarcacion = embarcacionDoc.toObject();
  
    
      // Retornamos solo esos campos
      return {
        message: 'Embarcacion encontrada',
        data: embarcacion
      };
    
  
  }
  

  async getEmbarcacionesByTrabajadorId(_id, page = 1) {
    try {
      const limit = 10;
      const skip = (page - 1) * limit;

      const embarcaciones = await Embarcacion.find({
        'trabajadores.trabajadorId': _id,
        is_activated: true
      })
        .skip(skip)
        .limit(limit)
        .populate({
          path:'clientes.cliente_id',
          select:'nombre_cliente -_id'
        });
        

        const total = await Embarcacion.countDocuments({ 
          'trabajadores.trabajadorId': _id,
          is_activated: true
        });

      if (embarcaciones.length === 0) {
        return { message: 'No se encontraron embarcaciones para este trabajador' };
      }

      return { 
        message: 'Embarcacion encontrada',
        data: embarcaciones,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
       };
    } catch (error) {
      console.error('Error al buscar embarcaciones:', error);
      throw error;
    }
  }

  async getEmbarcacionByIdCliente(_id, page = 1, limit = 10) {
    try {
      const cliente = await Client.findOne({ userId: _id });
      if (!cliente) {
        throw {status:404, message: 'Id de cliente no existe' };
      }

      const skip = (page - 1) * limit;

      const embarcaciones = await Embarcacion.find({ 'clientes.cliente_id': cliente._id })
        .skip(skip)
        .limit(limit)
        .populate({
          path: 'clientes.cliente_id',
          select: 'nombre_cliente apellido_cliente'
        });
        

      const total = await Embarcacion.countDocuments({ 'clientes.cliente_id': cliente._id });

      if (embarcaciones.length === 0) {
        throw { status:404,message: 'Embarcacion no encontrada' };
      }

      return {
        message: 'Embarcacion encontrada',
        data: embarcaciones,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error al obtener embarcacion por id de cliente:', error);
      throw error;
    }
  }

  async getAllEmbarcaciones(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const embarcaciones = await Embarcacion.find({})
        .skip(skip)
        .limit(limit)
        .populate({
          path:'clientes.cliente_id',
            select:'nombre_cliente -_id'
        });

      const total = await Embarcacion.countDocuments({});

      if (embarcaciones.length === 0) {
        throw {status:404, message: 'No se encontraron embarcaciones' };
      }

      return {
        message: 'Embarcaciones encontradas',
        data: embarcaciones,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error al obtener embarcaciones:', error);
      throw error;
    }
  }


  async getEmbarcacionByIdAndUsuario(embarcacionId, userId) {
    // Primero, encuentra el cliente asociado al usuario
    const cliente = await Client.findOne({ userId: userId });
    
    if (!cliente) {
      throw { status:404,message: 'Cliente no encontrado para este usuario' };
    }
    
    // Luego usa la función existente pasando el ID del cliente
    return this.getEmbarcacionByIdAndCliente(embarcacionId, cliente._id.toString());
  }

  async getEmbarcacionByIdAndUsuario(embarcacionId, userId) {
    // Encuentra el cliente asociado al usuario
    const cliente = await Client.findOne({ userId: userId });
    
    if (!cliente) {
      throw { status:404,message: 'Cliente no encontrado para este usuario' };
    }
    
    const clienteId = cliente._id;
    
    // Busca la embarcación con este cliente
    const embarcacionDoc = await Embarcacion.findOne({
      _id: embarcacionId,
      "clientes.cliente_id": clienteId
    }).populate("clientes.cliente_id", "nombre_cliente apellido_cliente rut_cliente foto_cliente");
  
    if (!embarcacionDoc) {
      throw {status:404, message: 'Embarcación no encontrada para este cliente' };
    }
  
    const embarcacion = embarcacionDoc.toObject();
  
    // Buscar el cliente solicitado dentro del array
    const clienteData = embarcacion.clientes.find(
      (c) => c.cliente_id && c.cliente_id._id.toString() === clienteId.toString()
    )?.cliente_id;
  
    return {
      message: 'Embarcación encontrada',
      data: {
        _id: embarcacion._id,
        titulo_embarcacion: embarcacion.titulo_embarcacion,
        destino_embarcacion: embarcacion.destino_embarcacion,
        fecha_creacion: embarcacion.fecha_creacion,
        servicios: embarcacion.servicios,
        permisos_embarcacion: embarcacion.permisos_embarcacion,
        cliente: clienteData
          ? {
              _id: clienteData._id,
              nombre: clienteData.nombre_cliente,
              apellido: clienteData.apellido_cliente,
              rut: clienteData.rut_cliente,
              foto: clienteData.foto_cliente
            }
          : null
      }
    };
  }
  async deleteEmbarcacionById(_id){
    try {
      const embarcacion = await Embarcacion.findByIdAndDelete(_id);
      if (!embarcacion) {
        throw { status: 404, message: 'Embarcación no encontrada' };
      }
  
  
      return { message: 'Embarcación eliminada exitosamente' };
    } catch (error) {
      console.error('Error al eliminar embarcación:', error);
      throw {
        status: error.status || 500,
        message: error.message || 'Error interno al eliminar embarcación'
      };
    }
  }
}

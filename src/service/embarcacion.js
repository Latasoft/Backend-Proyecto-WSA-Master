import { Embarcacion } from "../model/embarcacion.js";
import { Client } from "../model/cliente.js";
import { 
  EmbarcacionDto, 
  updateEmbarcacionAdminDto, 
  updateEmbarcacionTrabajadorDto 
} from "../dtos/embarcaciones/embarcacion.js";

export class EmbarcacionService {
  async crearEmbarcacion(data) {
    try {
      const embarcacion = await Embarcacion.create({
        titulo_embarcacion: data.titulo_embarcacion,
        destino_embarcacion:data.destino_embarcacion,
        cliente_id: data.cliente_id,
        is_activated: data.is_activated,
        trabajadores: data.trabajadores,
        permisos_embarcacion: data.permisos_embarcacion
        // Nota: Si deseas agregar ubicaciones en la creación, inclúyelas aquí.
      });

      return { message: 'Embarcacion creada exitosamente' };
    } catch (error) {
      console.error('Error al crear la embarcación:', error);
      throw error;
    }
  }

 
  async actualizarEmbarcacion(_id, data,userRole) {
    try {
      const embarcacion = await Embarcacion.findById(_id);
      if (!embarcacion) {
        return { message: 'Embarcacion no encontrada' };
      }

      let parsedData;
      if (userRole === 'ADMIN') {
        parsedData = updateEmbarcacionAdminDto.parse(data);
      } else if (userRole === 'TRABAJADOR') {
        parsedData = updateEmbarcacionTrabajadorDto.parse(data);
      } else {
        return res.status(403).json({ message: 'No tienes permiso para actualizar' });
      }
      const updated = await Embarcacion.findByIdAndUpdate(_id, parsedData, { new: true });

      return { message: "Embarcación actualizada por trabajador", data: updated };
    } catch (error) {
      console.error("Error en actualizarEmbarcacionTrabajador:", error);
      throw error;
    }
  }

  async getEmbarcacionById(_id, userRole) {
    // 1. Busca la embarcación en la BD
    const embarcacionDoc = await Embarcacion.findById(_id);
    if (!embarcacionDoc) {
      return { message: 'Embarcacion no encontrada' };
    }
  
    // Conviertes a objeto para manipularlo más fácil.
    const embarcacion = embarcacionDoc.toObject();
  
    // 2. Filtra campos según el rol
    if (userRole === 'ADMINISTRADOR') {
      // El ADMIN puede ver todo excepto TÍTULO y UBICACIÓN:
      delete embarcacion.titulo_embarcacion;
      delete embarcacion.ubicacion_embarcacion;
    } else if (userRole === 'TRABAJADOR') {
      // El TRABAJADOR solo ve DESTINO, UBICACIÓN, PERMISOS y si está ACTIVO:
      const filtered = {
        destino_embarcacion: embarcacion.destino_embarcacion,
        ubicacion_embarcacion: embarcacion.ubicacion_embarcacion,
        permisos_embarcacion: embarcacion.permisos_embarcacion,
        is_activated: embarcacion.is_activated
      };
      // Retornamos solo esos campos
      return {
        message: 'Embarcacion encontrada',
        data: filtered
      };
    }
  
    // 3. Retorna el resultado final
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
          path:'cliente_id',
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
        return { message: 'Id de cliente no existe' };
      }

      const skip = (page - 1) * limit;

      const embarcaciones = await Embarcacion.find({ cliente_id: cliente._id })
        .skip(skip)
        .limit(limit)
        .populate(
          {
            path:'cliente_id',
            select:'nombre_cliente -_id'
          }
        );
        

      const total = await Embarcacion.countDocuments({ cliente_id: cliente._id });

      if (embarcaciones.length === 0) {
        return { message: 'Embarcacion no encontrada' };
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
        .limit(limit);

      const total = await Embarcacion.countDocuments({});

      if (embarcaciones.length === 0) {
        return { message: 'No se encontraron embarcaciones' };
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
}

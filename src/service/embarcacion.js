import { Embarcacion } from "../model/embarcacion.js";
import { Client } from "../model/cliente.js";
import { EmpresaCliente } from "../model/empresa-cliente.js";

export class EmbarcacionService {
  async crearEmbarcacion(data) {
    try {
      const validData = data;

      // Validar si ya existe DA duplicado
      const yaExiste = await Embarcacion.findOne({ da_numero: validData.da_numero });
      if (yaExiste) {
        throw { status: 400, message: 'El número DA ya está registrado' };
      }

      let empresa_cliente_id = validData.empresa_cliente_id;
      let nombre_empresa_cliente = validData.nombre_empresa_cliente;

      // Si solo viene el id, buscar el nombre
      if (empresa_cliente_id && !nombre_empresa_cliente) {
        const empresa = await EmpresaCliente.findById(empresa_cliente_id);
        if (empresa) {
          nombre_empresa_cliente = empresa.nombre_empresa;
        }
      }

      const embarcacion = await Embarcacion.create({
        titulo_embarcacion: validData.titulo_embarcacion,
        destino_embarcacion: validData.destino_embarcacion,
        pais_embarcacion: validData.pais_embarcacion,
        fecha_arribo: validData.fecha_arribo || null,
        fecha_zarpe: validData.fecha_zarpe || null,
        fecha_estimada_zarpe: validData.fecha_estimada_zarpe || null,
        is_activated: validData.is_activated,
        trabajadores: validData.trabajadores,
        asistentes: validData.asistentes,
        permisos_embarcacion: validData.permisos_embarcacion,
        servicios: validData.servicios,
        da_numero: validData.da_numero,
        empresa_cliente_id: empresa_cliente_id || undefined,
        nombre_empresa_cliente: nombre_empresa_cliente || undefined
      });

      return {
        message: 'Embarcación creada exitosamente',
        data: embarcacion
      };
    } catch (error) {
      if (error.code === 11000 && error.keyPattern?.da_numero) {
        throw { status: 400, message: 'El número DA ya existe. Debe ser único.' };
      }
      console.error('❌ Error al crear embarcación:', error);
      throw {
        status: error.status || 500,
        message: error.message || 'Error interno al crear embarcación'
      };
    }
  }

  async actualizarServicioAccion(_id, nombre_servicio, nombre_estado, acciones) {
    const embarcacion = await Embarcacion.findById(_id);
    if (!embarcacion) {
      return { message: 'Embarcación no encontrada' };
    }

    const servicio = embarcacion.servicios.find(
      s => s.nombre_servicio.toLowerCase().trim() === nombre_servicio.toLowerCase().trim()
    );
    if (!servicio) {
      return { message: 'Servicio no encontrado' };
    }

    const estado = servicio.estados.find(e => e.nombre_estado === nombre_estado);
    if (!estado) {
      return { message: 'Estado no encontrado' };
    }

    estado.acciones = acciones;

    await embarcacion.save();

    return { message: 'Acciones agregadas al estado' };
  }

  async actualizarEmbarcacion(_id, data) {
    try {
      const dataParsed = data;

      const embarcacionExistente = await Embarcacion.findById(_id);
      if (!embarcacionExistente) {
        throw { status: 404, message: "Embarcación no encontrada" };
      }

      // Validar y asegurar que servicios_relacionados tengan fecha
      if (dataParsed.servicios_relacionados && Array.isArray(dataParsed.servicios_relacionados)) {
        dataParsed.servicios_relacionados = dataParsed.servicios_relacionados.map(servicio => {
          if (!servicio.fecha) {
            servicio.fecha = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
          }
          return servicio;
        });
      }

      const serviciosActualizados = [...embarcacionExistente.servicios];

      if (dataParsed.servicios && Array.isArray(dataParsed.servicios)) {
        dataParsed.servicios.forEach((nuevoServicio) => {
          const index = serviciosActualizados.findIndex(
            (s) => s.nombre_servicio === nuevoServicio.nombre_servicio
          );

          if (index === -1) {
            serviciosActualizados.push(nuevoServicio);
          } else {
            serviciosActualizados[index] = {
              ...serviciosActualizados[index],
              estados: [...serviciosActualizados[index].estados, ...nuevoServicio.estados],
            };
          }
        });
      }

      const updatedEmbarcacion = await Embarcacion.findByIdAndUpdate(
        _id,
        {
          ...dataParsed,
          servicios: serviciosActualizados,
        },
        { new: true, runValidators: true }
      );

      return { status: 201, message: "Embarcación actualizada con éxito", data: updatedEmbarcacion };
    } catch (error) {
      console.error("Error en actualizarEmbarcacion:", error);
      throw error;
    }
  }

  async getEmbarcacionById(_id) {
    const embarcacionDoc = await Embarcacion.findById(_id);
    if (!embarcacionDoc) {
      throw { status: 404, message: 'Embarcación no encontrada' };
    }

    const embarcacion = embarcacionDoc.toObject();

    return {
      message: 'Embarcación encontrada',
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
        .limit(limit);

      const total = await Embarcacion.countDocuments({
        'trabajadores.trabajadorId': _id,
        is_activated: true
      });

      if (embarcaciones.length === 0) {
        return { message: 'No se encontraron embarcaciones para este trabajador' };
      }

      return {
        message: 'Embarcación encontrada',
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
        throw { status: 404, message: 'Id de cliente no existe' };
      }

      const skip = (page - 1) * limit;

      const embarcaciones = await Embarcacion.find({ 'empresa_cliente_id': _id })
        .skip(skip)
        .limit(limit);

      const total = await Embarcacion.countDocuments({ 'empresa_cliente_id': _id });

      if (embarcaciones.length === 0) {
        throw { status: 404, message: 'Embarcación no encontrada' };
      }

      return {
        message: 'Embarcación encontrada',
        data: embarcaciones,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error al obtener embarcación por id de cliente:', error);
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
        throw { status: 404, message: 'No se encontraron embarcaciones' };
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
    const cliente = await Client.findOne({ userId: userId });

    if (!cliente) {
      throw { status: 404, message: 'Cliente no encontrado para este usuario' };
    }

    const clienteId = cliente._id;

    const embarcacionDoc = await Embarcacion.findOne({
      _id: embarcacionId,
      empresa_cliente_id: userId
    });

    if (!embarcacionDoc) {
      throw { status: 404, message: 'Embarcación no encontrada para este cliente' };
    }

    const embarcacion = embarcacionDoc.toObject();

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

  async getEmbarcacionByIdAndClienteId(embarcacionId, clienteId) {
    const embarcacionDoc = await Embarcacion.findOne({
      _id: embarcacionId,
      empresa_cliente_id: clienteId
    });

    if (!embarcacionDoc) {
      throw { status: 404, message: 'Embarcación no encontrada para este cliente' };
    }

    const embarcacion = embarcacionDoc.toObject();

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

  async obtenerReporteTodas() {
    try {
      const embarcaciones = await Embarcacion.find();
      return { data: embarcaciones };
    } catch (error) {
      console.error("Error en obtenerReporteTodas:", error);
      throw {
        status: error.status || 500,
        message: error.message || "Error interno al obtener el reporte de todas las embarcaciones"
      };
    }
  }

  async deleteEmbarcacionById(_id) {
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

  // metodo para traer embarcaiones NUMERO de ellas 
  async obtenerCantidadEmbarcaciones() {
    try {
      const total = await Embarcacion.countDocuments({});
      return { totalEmbarcaciones: total };
    } catch (error) {
      console.error("Error en obtenerCantidadEmbarcaciones:", error);
      throw {
        status: error.status || 500,
        message: error.message || "Error interno al obtener la cantidad de embarcaciones"
      };
    }
  }
}



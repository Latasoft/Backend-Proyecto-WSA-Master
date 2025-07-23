import { EmbarcacionService } from "../service/embarcacion.js";
import { EmbarcacionDto } from "../dtos/embarcaciones/embarcacion.js";
import { Embarcacion } from "../model/embarcacion.js";
import { EstadoEmbarcacionDto } from "../dtos/embarcaciones/estadoEmbarcacion.js";
import mongoose from "mongoose";

const embarcacionService = new EmbarcacionService();

export const obtenerCantidadEmbarcaciones = async (req, res) => {
  try {
    const response = await embarcacionService.obtenerCantidadEmbarcaciones();
    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error en obtenerCantidadEmbarcaciones:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export async function crearEmbarcacion(req, res) {
  try {
    // Loguea el body y el tipo de empresa_cliente_id
    console.log('Body recibido:', req.body);
    console.log('Tipo de empresa_cliente_id:', typeof req.body.empresa_cliente_id, req.body.empresa_cliente_id);

    // Normaliza empresa_cliente_id para que siempre sea string
    if (
      req.body.empresa_cliente_id &&
      typeof req.body.empresa_cliente_id === 'object'
    ) {
      if ('_id' in req.body.empresa_cliente_id && typeof req.body.empresa_cliente_id._id === 'string') {
        req.body.empresa_cliente_id = req.body.empresa_cliente_id._id;
      } else if (typeof req.body.empresa_cliente_id.toString === 'function') {
        req.body.empresa_cliente_id = req.body.empresa_cliente_id.toString();
      } else {
        req.body.empresa_cliente_id = String(req.body.empresa_cliente_id);
      }
    }

    console.log('✅ REQ BODY recibido:', JSON.stringify(req.body, null, 2));

    let dataParse = req.body;

    dataParse.empresa_cliente_id = new mongoose.Types.ObjectId(dataParse.empresa_cliente_id);

    const response = await embarcacionService.crearEmbarcacion(dataParse);
    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error en crearEmbarcacion:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
}

export async function getEmbarcacionesByTrabajadorId(req, res) {
  try {
    const { _id } = req.params;
    const response = await embarcacionService.getEmbarcacionesByTrabajadorId(_id);
    res.status(200).json(response);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

export async function getEmbarcacionesByClienteId(req, res) {
  try {
    const { _id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const response = await embarcacionService.getEmbarcacionByIdCliente(
      _id,
      Number(page),
      Number(limit)
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

export async function getAllEmbarcaciones(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const response = await embarcacionService.getAllEmbarcaciones(
      Number(page),
      Number(limit)
    );
    res.status(200).json(response);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
}

export async function updateEmbarcacion(req, res) {
  try {
    const { _id } = req.params;
    const response = await embarcacionService.actualizarEmbarcacion(_id, req.body);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error en actualizarEmbarcacion:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
}

export async function updateServiceAccion(req, res) {
  try {
    const { _id } = req.params;
    const { nombre_servicio, nombre_estado, acciones } = req.body;

    const response = await embarcacionService.actualizarServicioAccion(
      _id,
      nombre_servicio,
      nombre_estado,
      acciones
    );

    res.status(200).json(response);
  } catch (error) {
    console.error("Error en updateServiceAccion:", error);
    res.status(400).json({ message: 'Error al actualizar accion del servicio' });
  }
}

export async function getEmbarcacionesByIdAndClienteId(req, res) {
  try {
    const { embarcacionId, clienteId } = req.params;
    const response = await embarcacionService.getEmbarcacionByIdAndClienteId(
      embarcacionId,
      clienteId
    );
    res.status(200).json(response);
  } catch (error) {
    console.error("Error en getEmbarcacionesByIdAndClienteId:", error);
    res.status(error.status || 500).json({
      message: error.message || "Error interno al obtener la embarcación",
    });
  }
}

export async function deleteEmbarcacionById(req, res) {
  try {
    const { _id } = req.params;
    const response = await embarcacionService.deleteEmbarcacionById(_id);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error en deleteEmbarcacionById:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
}

export const actualizarEstadoYComentario = async (req, res) => {
  const { da_numero } = req.params;
  try {
    console.log('🛬 BODY RECIBIDO EN BACKEND:', JSON.stringify(req.body, null, 2));
    const data = EstadoEmbarcacionDto.parse(req.body);
    console.log('📦 Data recibida:', JSON.stringify(data, null, 2));

    const updateFields = {};
    for (const key in data) {
      const value = data[key];
      if (value === undefined || value === null) continue;

      if (key === 'servicios_relacionados' && Array.isArray(value)) {
        updateFields[key] = value.map(servicio => ({
          nombre: servicio.nombre,
          subservicio: servicio.subservicio || '',
          nota: servicio.nota,
          estado: servicio.estado,
          servicio_principal: servicio.servicio_principal?.trim() ? servicio.servicio_principal : 'Otro',
          ...(servicio.fecha ? { fecha: servicio.fecha } : {}),
          fecha_modificacion: new Date()
        }));
      } else if (key === 'eta') {
        updateFields['fecha_arribo'] = value;
      } else if (key === 'etb') {
        updateFields['fecha_estimada_zarpe'] = value;
      } else if (key === 'etd') {
        updateFields['fecha_zarpe'] = value;
      } else {
        updateFields[key] = value;
      }
    }

    console.log('🔧 Campos a actualizar:', JSON.stringify(updateFields, null, 2));

    const embarcacion = await Embarcacion.findOneAndUpdate(
      { da_numero },
      updateFields,
      { new: true }
    );

    if (!embarcacion) {
      return res.status(404).json({ message: 'Embarcación no encontrada' });
    }

    res.json(embarcacion);

  } catch (error) {
    console.error('❌ Error al actualizar estado/comentario:', error);
    res.status(500).json({ message: error.message });
  }
};

export async function obtenerReporteTodas(req, res) {
  try {
    const response = await embarcacionService.obtenerReporteTodas();
    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error en obtenerReporteTodas:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
}

export const getEmbarcaciones = async (req, res) => {
  try {
    const { clienteId } = req.query;

    const filtro = {};

    if (clienteId) {
      filtro["clientes.cliente_id"] = clienteId;
    }

    const embarcaciones = await Embarcacion.find(filtro)
      .populate("trabajadores.trabajadorId", "username")
      .lean();

    console.log("✅ Embarcaciones encontradas:", JSON.stringify(embarcaciones, null, 2));

    const resultado = embarcaciones.map(e => {
      const operador = e.trabajadores?.[0]?.trabajadorId?.username || "";
      const grouped = {};
      for (const sr of e.servicios_relacionados || []) {
        if (!grouped[sr.servicio_principal]) {
          grouped[sr.servicio_principal] = [];
        }
        grouped[sr.servicio_principal].push({
          sub_service: sr.nombre,
          date: sr.fecha_modificacion
            ? new Date(sr.fecha_modificacion).toISOString().split('T')[0]
            : "",
          estado: sr.estado || "",
          nota: sr.nota || ""
        });
      }
      return {
        vessel: e.titulo_embarcacion || "",
        da_numero: e.da_numero || "",
        port: e.destino_embarcacion || "",
        pais_embarcacion: e.pais_embarcacion || 'NO DISPONIBLE',
        empresa: e.nombre_empresa_cliente || "",
        estado_actual: e.estado_actual || "",
        eta: e.fecha_arribo || "",
        etb: e.fecha_estimada_zarpe || "",
        etd: e.fecha_zarpe || "",
        operador,
        services: Object.entries(grouped).map(([main_service, sub_services]) => ({
          main_service,
          sub_services
        }))
      };
    });

    res.json(resultado);

  } catch (error) {
    console.error("❌ ERROR en getEmbarcaciones:", error);
    res.status(500).json({
      message: "Error obteniendo embarcaciones.",
      error: error.message,
    });
  }
};

export const getEmbarcacionesFiltradas = async (req, res) => {
  try {
    const embarcaciones = await Embarcacion.find({})
      .populate("trabajadores.trabajadorId", "username")
      .lean();

    res.json(embarcaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener embarcaciones" });
  }
};

export const getEmbarcacionByDaNumero = async (req, res) => {
  try {
    const { da_numero } = req.params;

    const embarcacion = await Embarcacion.findOne({ da_numero });

    if (!embarcacion) {
      return res.status(404).json({ message: 'Embarcación no encontrada' });
    }

    res.status(200).json(embarcacion);
  } catch (error) {
    console.error("❌ Error en getEmbarcacionByDaNumero:", error);
    res.status(500).json({ message: error.message });
  }
};
export async function getEmbarcacionById(req, res) {
  try {
    const { _id } = req.params;
    const response = await embarcacionService.getEmbarcacionById(_id);
    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error en getEmbarcacionById:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
}

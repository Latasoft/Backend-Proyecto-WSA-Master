import { Embarcacion } from "../model/embarcacion.js";

/**
 * ✅ Controller - Traer TODAS las embarcaciones (detalle completo)
 */
export const getAllEmbarcaciones = async (req, res) => {
  try {
    const embarcaciones = await Embarcacion.find()
      .populate({
        path: "clientes.cliente_id",
        populate: { path: "userId" },
      })
      .populate({
        path: "trabajadores.trabajadorId",
      });

    const resultado = embarcaciones.map((e) => {
      const clientes = e.clientes.map((c) => ({
        _id: c.cliente_id?._id,
        nombre_cliente: c.cliente_id?.nombre_cliente,
        pais_cliente: c.cliente_id?.pais_cliente,
        dato_contacto_cliente: c.cliente_id?.dato_contacto_cliente,
        foto_cliente: c.cliente_id?.foto_cliente,
        user: c.cliente_id?.userId
          ? {
              _id: c.cliente_id.userId._id,
              username: c.cliente_id.userId.username,
              email: c.cliente_id.userId.email,
              tipo_usuario: c.cliente_id.userId.tipo_usuario,
              empresa_cliente: c.cliente_id.userId.empresa_cliente,
            }
          : null,
      }));

      const trabajadores = e.trabajadores
        .filter((t) => t.trabajadorId?.tipo_usuario === "TRABAJADOR")
        .map((t) => ({
          _id: t.trabajadorId._id,
          username: t.trabajadorId.username,
          email: t.trabajadorId.email,
          tipo_usuario: t.trabajadorId.tipo_usuario,
          empresa_cliente: t.trabajadorId.empresa_cliente,
        }));

      return {
        _id: e._id,
        da_numero: e.da_numero,
        titulo_embarcacion: e.titulo_embarcacion,
        destino_embarcacion: e.destino_embarcacion,
        fecha_arribo: e.fecha_arribo,
        fecha_zarpe: e.fecha_zarpe,
        fecha_creacion: e.fecha_creacion,
        estado_actual: e.estado_actual,
        servicio: e.servicio,
        subservicio: e.subservicio,
        servicios_relacionados: e.servicios_relacionados,
        servicios: e.servicios,
        clientes,
        trabajadores,
      };
    });

    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ Controller - Contar total de embarcaciones
 */
export const countEmbarcaciones = async (req, res) => {
  try {
    const total = await Embarcacion.countDocuments();
    res.json({ total_vessels: total });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ Controller - Contar embarcaciones por país
 */
export const reportEmbarcacionesByCountry = async (req, res) => {
  try {
    const embarcaciones = await Embarcacion.find().populate({
      path: "clientes.cliente_id",
    });

    const counts = {};
    let totalVessels = 0;

    for (const e of embarcaciones) {
      const pais = e.clientes?.[0]?.cliente_id?.pais_cliente || "DESCONOCIDO";
      counts[pais] = (counts[pais] || 0) + 1;
      totalVessels += 1;
    }

    res.json({
      total_vessels: totalVessels,
      by_country: counts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

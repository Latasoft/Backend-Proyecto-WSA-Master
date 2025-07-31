import { Embarcacion } from "../model/embarcacion.js";
import { User } from "../model/user.js";

/**
 * ✅ Controller - Traer TODAS las embarcaciones (detalle completo)
 */
export const getAllEmbarcaciones = async (req, res) => {
  try {
    const embarcaciones = await Embarcacion.find()
      .populate({
        path: "trabajadores.trabajadorId",
      });

    const resultado = embarcaciones.map((e) => {
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
        pais_embarcacion: e.pais_embarcacion || 'NO DISPONIBLE',
        fecha_arribo: e.fecha_arribo,
        fecha_zarpe: e.fecha_zarpe,
        fecha_creacion: e.fecha_creacion,
        estado_actual: e.estado_actual,
        servicio: e.servicio,
        subservicio: e.subservicio,
        servicios_relacionados: e.servicios_relacionados,
        servicios: e.servicios,
        empresa_cliente_id: e.empresa_cliente_id,
        nombre_empresa_cliente: e.nombre_empresa_cliente,
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
 * ✅ Controller - Contar embarcaciones por empresa
 */
export const reportEmbarcacionesByEmpresa = async (req, res) => {
  try {
    const embarcaciones = await Embarcacion.find();

    const counts = {};
    let totalVessels = 0;

    for (const e of embarcaciones) {
      const empresa = e.nombre_empresa_cliente || "DESCONOCIDO";
      counts[empresa] = (counts[empresa] || 0) + 1;
      totalVessels += 1;
    }

    res.json({
      total_vessels: totalVessels,
      by_empresa: counts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

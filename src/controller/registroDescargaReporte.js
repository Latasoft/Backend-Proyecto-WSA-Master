import { RegistroDescargaReporteService } from "../service/registroDescargaReporte.js";
const registroSolicitudService = new RegistroDescargaReporteService();

export async function crearRegistroDescargaReporte(req, res) {
    try {
        const { id_solicitante, rango_fecha_inicio, rango_fecha_termino,  } = req.body;
        const nuevaSolicitud = await registroSolicitudService.crearRegistroDescargadReporte({ id_solicitante,  rango_fecha_inicio, rango_fecha_termino });
        return res.status(201).json(nuevaSolicitud);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || 'Error al crear la solicitud de reporte' });
    }
}

export async function obtenerTodasLasSolicitudes(req, res) {
    try {
        const { page = 1, limit = 10 } = req.query;
        const solicitudes = await registroSolicitudService.obtenerTodasLasSolicitudesPaginadas(page, limit);
        return res.status(200).json(solicitudes);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || 'Error al obtener las solicitudes de reporte' });
    }
}
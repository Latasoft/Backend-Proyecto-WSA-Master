import { SolicitudReporteService } from "../service/SolicitudReporte.js";
const solicitudReporteService= new SolicitudReporteService();

export async function crearSolicitudReporte(req, res) {
    try {
        const { id_solicitante,  rango_fecha_inicio, rango_fecha_termino, estado_solicutud, documento_reporte } = req.body;
        const nuevaSolicitud = await solicitudReporteService.crearSolicitudReporte({ id_solicitante,  rango_fecha_inicio, rango_fecha_termino, estado_solicutud, documento_reporte });
        return res.status(201).json(nuevaSolicitud);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || 'Error al crear la solicitud de reporte' });
    }
}

export async function obtenerTodasLasSolicitudes(req, res) {
    try {
        const { page = 1, limit = 10 } = req.query;
        const solicitudes = await solicitudReporteService.obtenerTodasLasSolicitudesPaginadas(page, limit);
        return res.status(200).json(solicitudes);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || 'Error al obtener las solicitudes de reporte' });
    }
}
export async function obtenerSolicitudPorId(req, res) {
    try {
        const { _id } = req.params;
        const solicitud = await solicitudReporteService.obtenerSolicitudPorId(_id);
        return res.status(200).json(solicitud);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || 'Error al obtener la solicitud de reporte' });
    }
}
export async function actualizarSolicitud(req, res) {
    try {
        const { _id } = req.params;
        const { estado_solicutud, documento_reporte } = req.body;
        const solicitudActualizada = await solicitudReporteService.actualizarSolicitud(_id, { estado_solicutud, documento_reporte });
        return res.status(200).json(solicitudActualizada);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || 'Error al actualizar la solicitud de reporte' });
    }
}
export async function obtenerSolicitudesPorUsuario(req, res) {
    try {
        const { id } = req.params;
        const solicitudes = await solicitudReporteService.obtenreSolicitudByUserId(id);
        return res.status(200).json(solicitudes);
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message || 'Error al obtener las solicitudes de reporte por usuario' });
    }
}
import { crearRegistroDescargaReporteSchema } from "../dtos/reportes/registroDescargaReporte.js";
import { RegistroDescargaResporte } from "../model/registroDescargaReporte.js";

export class RegistroDescargaReporteService {
    async crearRegistroDescargadReporte(solicitud) {
        console.log(solicitud)
        const result = crearRegistroDescargaReporteSchema.safeParse(solicitud);
        try {

            if (!result.success) {
                console.error('❌ Error validando solicitud:', result.error.format());
                // ⬇️ Termina el flujo lanzando error inmediatamente
                throw { status: 400, message: 'Error en los datos enviados', errores: result.error.format() };
            }
        
            // ✅ Solo si los datos fueron validados correctamente
            const solicitudValida = result.data;
            const nuevaSolicitud = await RegistroDescargaResporte.create(
                {
                    id_solicitante: solicitudValida.id_solicitante,
                    rango_fecha_inicio: solicitudValida.rango_fecha_inicio,
                    rango_fecha_termino: solicitudValida.rango_fecha_termino
                }
            );
            return { status:201, message: "Solicitud de reporte creada correctamente", id: nuevaSolicitud._id };
        } catch (error) {
            console.log(error);
            throw { status:500,message: "Error al crear la solicitud de reporte" };
        }
    }
    async obtenerTodasLasSolicitudesPaginadas(page=1,limit=10){
        const skip = (page - 1) * limit;
        try{
             // Obtener los usuarios paginados
            const solicitudBD  = await RegistroDescargaResporte.find()
            .skip(skip)       // Omitir los primeros registros (según la página)
            .limit(limit)     // Limitar la cantidad de resultados por página
            .populate({
                path: 'id_solicitante',    // 👉 campo de referencia en RegistroReporte
                select: 'username -_id',         // 👉 qué campo quieres traer
            })
            .sort({ createdAt: -1 })
            .exec();

            const totalSolicitudes = await RegistroDescargaResporte.countDocuments();
            
             // 🔥 Aquí haces el "map" para cambiar id_solicitante -> solicitante
        const solicitud = solicitudBD.map(doc => ({
            _id: doc._id,
            solicitante: doc.id_solicitante, // 👈 renombrado aquí
            rango_fecha_inicio: doc.rango_fecha_inicio,
            rango_fecha_termino: doc.rango_fecha_termino,
            fecha_descarga: doc.fecha_descarga,
        }));

            return {
                message: 'Solictudes encontradas',
                solicitud,
                totalSolicitudes,
                totalPages: Math.ceil(totalSolicitudes / limit),
                currentPage: page
            };
        }
        catch(error){
            console.error('❌ Error exacto al obtener solicitudes:', error);
            throw  {message:'Error al obtener las solicitudes de reporte',error}
        }
    
    } 
}
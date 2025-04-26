import { crearRegistroDescargaReporteSchema } from "../dtos/reportes/registroDescargaReporte.js";
import { RegistroResporte } from "../model/registroReporte.js";

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
            const nuevaSolicitud = await RegistroResporte.create(
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
            const solicitud = await RegistroResporte.find()
            .skip(skip)       // Omitir los primeros registros (según la página)
            .limit(limit)     // Limitar la cantidad de resultados por página
            .populate({
                path: 'id_solicitante',    // 👉 campo de referencia en RegistroReporte
                select: 'username',         // 👉 qué campo quieres traer
            })
            .sort({ createdAt: -1 })
            .exec();
            const totalSolicitudes = await RegistroResporte.countDocuments();
            
            return {
                message: 'Solictudes encontradas',
                solicitud,
                totalSolicitudes,
                totalPages: Math.ceil(totalSolicitudes / limit),
                currentPage: page
            };
        }
        catch(error){
            throw  {message:'Error al obtener las solicitudes de reporte'}
        }
    
    } 
}
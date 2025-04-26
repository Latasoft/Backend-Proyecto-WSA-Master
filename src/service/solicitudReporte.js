import { RegistroSolicitudReporteSchema,actualizarRegistroSolicitudReporteSchema } from "../dtos/reportes/solicitudReporte.js";
import { SolicitudReporte } from "../model/solicitudReporte.js";

export class SolicitudReporteService {
    async crearSolicitudReporte(solicitud) {
        const solicitudValida = RegistroSolicitudReporteSchema.parse(solicitud);
        try {
            const nuevaSolicitud = await SolicitudReporte.create({
                id_solicitante: solicitudValida.id_solicitante,
                rango_fecha_inicio: solicitudValida.rango_fecha_inicio,
                rango_fecha_termino: solicitudValida.rango_fecha_termino,
                estado_solicutud: solicitudValida.estado_solicutud,
                docuemento_reporte: solicitudValida.documento_reporte
            });
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
            const solicitud = await SolicitudReporte.find()
            .skip(skip)       // Omitir los primeros registros (según la página)
            .limit(limit)     // Limitar la cantidad de resultados por página
            .populate({
                path: 'id_solicitante',
                select:'username'
            })
            .exec();
            const totalSolicitudes = await SolicitudReporte.countDocuments();
            
            return {
                message: 'Solictudes encontradas',
                solicitudes,
                totalSolicitudes,
                totalPages: Math.ceil(totalSolicitudes / limit),
                currentPage: page
            };
        }
        catch(error){
            throw  {message:'Error al obtener las solicitudes de reporte'}
        }
    
    }

    async obtenerSolicitudPorId(id){
        try{
            const solicitud = await SolicitudReporte.findById(id)
            .populate({
                path: 'id_solicitante',
                select:'username'
            })
            .lean()
            if(!solicitud){
                throw {status:404,message:'Solicitud no encontrada'}
            }
            return {message:'Solicitud encontrada',solicitud}
        }catch(error){
            throw {status:500,message:'Error al obtener la solicitud'}
        }
    }
    async actualizarSolicitud(id,solicitud){
        const solicitudValida = actualizarRegistroSolicitudReporteSchema.parse(solicitud);
        try{
            const solicitudActualizada = await SolicitudReporte.findByIdAndUpdate(id,solicitudValida,{new:true})
            if(!solicitudActualizada){
                throw {status:404,message:'Solicitud no encontrada'}
            }
            return {message:'Solicitud actualizada',solicitudActualizada}
        }catch(error){
            throw {status:500,message:'Error al actualizar la solicitud'}
        }
    }
    async obtenreSolicitudByUserId(id){
        try{
            const solicitud = await SolicitudReporte.find({id_solicitante:id}).lean()
            if(!solicitud){
                throw {status:404,message:'Solicitud no encontrada'}
            }
            return {message:'Solicitud encontrada',solicitud}
        }catch(error){
            throw {status:500,message:'Error al obtener la solicitud'}
        }
    }
}
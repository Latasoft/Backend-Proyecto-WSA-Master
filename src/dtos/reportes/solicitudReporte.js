import {z} from 'zod'

const estadoSolicitud = ['PENDIENTE','ACEPTADO','RECHAZADO']
const RegistroSolicitudReporteSchema = z.object({
    id_solicitante: z.string().min(1,'el id del solicitante es requerido'),
    rango_fecha_inicio: z.preprocess(
        (arg) => {
          if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
          return arg;
        },
        z.date()
      ),
    rango_fecha_termino: z.preprocess(
        (arg) => {
          if (typeof arg === "string" || arg instanceof Date) return new Date(arg);
          return arg;
        },
        z.date()
      ),
    estado_solicutud:z.enum(estadoSolicitud).default('PENDIENTE'),
    documento_reporte:z.string().default(null).optional()
})


const actualizarRegistroSolicitudReporteSchema = z.object({
    
    estado_solicutud:z.enum(estadoSolicitud).optional(),
    documento_reporte:z.string().default(null).optional()
})

export {RegistroSolicitudReporteSchema,actualizarRegistroSolicitudReporteSchema}
import {z} from 'zod'
const crearRegistroDescargaReporteSchema = z.object({
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
      )

})

export {crearRegistroDescargaReporteSchema}
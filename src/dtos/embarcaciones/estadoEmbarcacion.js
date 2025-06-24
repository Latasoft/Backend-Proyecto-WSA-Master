import { z } from 'zod';

export const EstadoEmbarcacionDto = z.object({
  estado_actual: z.string().optional(),
  comentario_general: z.string().optional(),
  servicio: z.string().optional(),
  subservicio: z.string().optional(),

  servicio_relacionado: z.string().optional(),
  nota_servicio_relacionado: z.string().optional(),

  fecha_servicio_relacionado: z.preprocess(
    (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
    z.date().optional()
  ),

  fecha_estimada_zarpe: z.preprocess(
  (arg) => {
    if (arg === null || arg === undefined || arg === '') return null;
    return typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg;
  },
  z.date().nullable().optional()
  ),

  fecha_arribo: z.preprocess(
    (arg) => {
      if (arg === null || arg === undefined || arg === '') return null;
      return typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg;
    },
    z.date().nullable().optional()
  ),

  fecha_zarpe: z.preprocess(
    (arg) => {
      if (arg === null || arg === undefined || arg === '') return null;
      return typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg;
    },
    z.date().nullable().optional()
  ),


  servicios_relacionados: z.array(
  z.object({
    nombre: z.string(),
    fecha: z.string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, { message: "La fecha debe ser YYYY-MM-DD" })
      .optional(),
    nota: z.string().optional(),
    estado: z.string().optional(),
    fecha_modificacion: z.preprocess(
      (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
      z.date().optional()
    )
  })
).optional()

});

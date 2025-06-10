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
    (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
    z.date().optional()
  ),

  servicios_relacionados: z.array(
    z.object({
      nombre: z.string(),
      fecha: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
        z.date().optional()
      ),
      nota: z.string().optional(),
      estado: z.string().optional(),
      fecha_modificacion: z.preprocess(
        (arg) => (typeof arg ==='string' || arg instanceof Date ? new Date(arg) : arg),
        z.date().optional()
      )
    })
  ).optional(),

  eta: z.preprocess(
    (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
    z.date().optional()
  ),
  etb: z.preprocess(
    (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
    z.date().optional()
  ),
  etd: z.preprocess(
    (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
    z.date().optional()
  )
});

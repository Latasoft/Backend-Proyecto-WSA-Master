import { z } from 'zod';

export const EstadoEmbarcacionDto = z.object({
  estado_actual: z.string(),
  comentario_general: z.string(),
  servicio: z.string(),
  subservicio: z.string(),
  servicio_relacionado: z.string().optional(), 
  fecha_servicio_relacionado: z.preprocess(
  (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : arg),
  z.date().optional()
),
 
  nota_servicio_relacionado: z.string().optional() 
});

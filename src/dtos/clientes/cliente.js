import { z } from 'zod';

export const ClienteSchema = z.object({
  rut_cliente: z.string().nonempty(),
  nombre_cliente: z.string().nonempty(),
  apellido_cliente: z.string().nonempty(),
  
});

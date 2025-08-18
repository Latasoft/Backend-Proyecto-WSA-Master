import { z } from 'zod';

export const ClienteSchema = z.object({
  nombre_cliente: z.string().optional(),
  dato_contacto_cliente: z.string().optional(),
  pais_cliente: z.string().optional(),
  empresa_cliente_id: z.string().optional(),
});
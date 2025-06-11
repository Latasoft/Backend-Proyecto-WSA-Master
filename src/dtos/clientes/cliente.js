import { z } from 'zod';

export const ClienteSchema = z.object({
  nombre_cliente: z.string().nonempty('El nombre del cliente es requerido'),
  dato_contacto_cliente: z.string().nonempty('El dato de contacto es requerido'),
  pais_cliente: z.string().nonempty('El país es requerido'),
});
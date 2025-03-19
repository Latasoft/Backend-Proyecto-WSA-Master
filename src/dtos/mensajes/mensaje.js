// dtos/mensaje.dto.js
import { z } from 'zod';

export const createMessageSchema = z.object({
  group: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de grupo inválido"),
  sender: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID del remitente inválido"),
  content: z.string().nonempty("El contenido es obligatorio")
});

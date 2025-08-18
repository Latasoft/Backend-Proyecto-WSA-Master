import { z } from 'zod';

// Esquema para contacto (más flexible)
const ContactoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  cargo: z.string().min(1, 'El cargo es requerido'),
  correo: z.string().email('Formato de email inválido').optional().or(z.literal('')),
  telefono: z.string().min(1, 'El teléfono es requerido')
});

// Esquema para empresa (campos más flexibles)
export const EmpresaSchema = z.object({
  nombre_empresa: z.string().min(1, 'El nombre de la empresa es requerido'),
  pais: z.string().optional(),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  correo: z.string().optional(),
  imagen_empresa: z.string().optional(),
  contacto_operativo: ContactoSchema.optional(),
  contacto_da: ContactoSchema.optional()
});

// Esquema para actualización (todos los campos opcionales)
export const EmpresaUpdateSchema = EmpresaSchema.partial();

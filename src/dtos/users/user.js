import {z} from 'zod'

const ROLES=['ADMINISTRADOR','TRABAJADOR','CLIENTE','ASISTENTE','ADMINISTRATIVO']

const UserSchema = z.object({
    username:z.string().min(5,'el nombre de usuario debe ser de minimo 5 caracteres'),
    password: z.string().min(8, 'Password mínimo 8 caracteres'),
    tipo_usuario:z.enum(ROLES,'El rol debe ser uno de los valores validos: ADMINISTRADOR,TRABAJADOR,CLIENTE,ASISTENTE,ADMINISTRATIVO'),
    email:z.string().email('El email no es válido'),
    nombre_completo: z.string().min(1, 'El nombre completo es requerido'),
    imagen_usuario: z.string().optional(),
    empresa_cliente: z.string().optional(),
    pais_asignado: z.string().optional(),
    // Campos específicos para cliente
    pais_cliente: z.string().optional(),
    dato_contacto_cliente: z.string().optional(),
    foto_cliente: z.string().optional(),
    empresa_cliente_id: z.string().optional(),
}).refine((data) => {
    if (data.tipo_usuario === 'CLIENTE') {
        return data.dato_contacto_cliente;
    }
    return true;
}, {
    message: "Para usuarios tipo CLIENTE, dato_contacto_cliente es requerido",
    path: ["dato_contacto_cliente"]
})

// Esquema para actualizar el usuario, donde la contraseña es opcional
const UpdateUserSchema = z.object({
  username: z.string().min(1, 'El nombre de usuario es requerido'),
  password: z.preprocess(
    (val) => {
      if (typeof val === 'string' && val.trim() === '') {
        // Si es cadena vacía, se transforma en undefined
        return undefined;
      }
      return val;
    },
    z.string().min(6, 'Password mínimo 6 caracteres').optional(),
  ),
  tipo_usuario: z.enum(ROLES).optional(),
  email:z.string().email('El email no es válido').optional(),
  nombre_completo: z.string().min(1, 'El nombre completo es requerido').optional(),
  imagen_usuario: z.string().optional(),
  empresa_cliente: z.string().optional(),
  pais_asignado: z.string().optional(),
  pais_cliente: z.string().optional(),
  dato_contacto_cliente: z.string().optional(),
  foto_cliente: z.string().optional(),
  empresa_cliente_id: z.string().optional(),
    activo: z.boolean().optional(),

});

export { UserSchema, UpdateUserSchema };

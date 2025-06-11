import {z} from 'zod'
const ROLES=['ADMINISTRADOR','TRABAJADOR','CLIENTE']
const UserSchema = z.object({
    username:z.string().min(5,'el nombre de usuario debe ser de minimo 5 caracteres'),
    password: z.string().min(8, 'Password mínimo 8 caracteres'), // Cambiado de hashed_password a password
    tipo_usuario:z.enum(ROLES,'El rol debe ser uno de los valores validos: ADMINISTRADOR,CLIENTE,TRABAJADOR'),
    email:z.string().email('El email no es válido').optional(), // Email opcional
    empresa_cliente: z.string().optional(),

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
  // Puedes validar el rol con enum o dejarlo opcional
  tipo_usuario: z.enum(ROLES).optional(),
  email:z.string().email('El email no es válido').optional(), // Email opcional
  empresa_cliente: z.string().optional(),
});

export { UserSchema, UpdateUserSchema };

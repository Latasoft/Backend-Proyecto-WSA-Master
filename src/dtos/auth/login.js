import {z} from 'zod'
const AuthSchema = z.object({
    username:z.string(),
    password: z.string() // Cambiado de hashed_password a password

})

export { AuthSchema };
import { User } from "../model/user.js";
import { AuthSchema } from "../dtos/auth/login.js";
import { comparePassword } from "../utils/bcryptUtil.js";
import { generateToken } from "../utils/jwtUtil.js";  // Asegúrate de que 'generateToken' esté importado correctamente

export class AuthService {
    async login(data) {
        const loginParsed = AuthSchema.parse(data);

        // Asegúrate de que la llamada a findOne sea asíncrona
        const user = await User.findOne({ username: loginParsed.username });

        if (!user) {
            return { message: 'Nombre de usuario no encontrado' };
        }

        // Verificar la contraseña usando bcrypt
        const isPasswordValid = await comparePassword(loginParsed.password, user.password);

        if (!isPasswordValid) {
            return { message: 'Credenciales incorrectas' };
        }

        // Generación del token JWT
        const token = generateToken({ _id: user._id, role: user.tipo_usuario });

        return { message: 'Sesión iniciada con éxito', token };
    }
}

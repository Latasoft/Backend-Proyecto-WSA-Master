import { User } from "../model/user.js";
import { AuthSchema } from "../dtos/auth/login.js";
import { comparePassword, hashPassword } from "../utils/bcryptUtil.js";
import { generateResetToken, generateToken, verifyToken } from "../utils/jwtUtil.js";  // Asegúrate de que 'generateToken' esté importado correctamente
import { FRONTEND_URL } from "../config/config.js";
import { EmailService } from "../service/email.js";

export class AuthService {
    async login(data) {
        const loginParsed = AuthSchema.parse(data);

        // Asegúrate de que la llamada a findOne sea asíncrona
        const user = await User.findOne({ username: loginParsed.username });

        if (!user) {
            throw { status: 401, message: 'Nombre de usuario no encontrado' };
        }

        // Verificar la contraseña usando bcrypt
        const isPasswordValid = await comparePassword(loginParsed.password, user.password);

        if (!isPasswordValid) {
            throw { status: 401, message: 'Credenciales incorrectas' };
        }

        // Generación del token JWT
        const token = generateToken({ _id: user._id, role: user.tipo_usuario });

        return { message: 'Sesión iniciada con éxito', token };
    }

    async resetPassword(email){
        
        const cleanedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email:cleanedEmail}).lean();
        if (!user) {
            throw { status: 404, message: 'Usuario no encontrado' };
        }
        
        const token = generateResetToken(user._id);

        const resetLink= `${FRONTEND_URL}/change-password?token=${token}`;

        await EmailService.enviarCorreo(email, "Recuperar contraseña", `Haz clic aquí para recuperar tu cuenta: ${resetLink}`);
        return {status:201, message:'Correo de recuperación enviado'}
    }

    async changePassword(token, newPassword) {
        const decode= verifyToken(token)
        if (!decode) {
            throw { status: 401, message: 'Token inválido' };
        }
        const user = await User.findById(decode._id);
        if (!user) {
            throw { status: 404, message: 'Usuario no encontrado' };
        }

        if (decode.type && decode.type !== 'password_reset') {
            throw { status: 403, message: 'Token inválido para esta operación' };
          }

        // Aquí puedes usar bcrypt para encriptar la nueva contraseña antes de guardarla
        const newHashedPassword= await hashPassword(newPassword);

        user.password= newHashedPassword;
        await user.save();
        return {status:201, message:'Contraseña actualizada con éxito'}
    }
}

import { User } from "../model/user.js";
import { AuthSchema } from "../dtos/auth/login.js";
import { comparePassword, hashPassword } from "../utils/bcryptUtil.js";
import { generateResetToken, generateToken, verifyToken } from "../utils/jwtUtil.js";
import { FRONTEND_URL } from "../config/config.js";
import { EmailService } from "../service/email.js";

export class AuthService {
  // Login de usuario
  async login(data) {
    // Validar entrada con Zod (u otro esquema)
    const loginParsed = AuthSchema.parse(data);

    // Buscar usuario por username
    const user = await User.findOne({ username: loginParsed.username });
    if (!user) {
      throw { status: 401, message: 'Nombre de usuario no encontrado' };
    }

    // Verificar contraseña
    const isPasswordValid = await comparePassword(loginParsed.password, user.password);
    if (!isPasswordValid) {
      throw { status: 401, message: 'Credenciales incorrectas' };
    }

    // Generar JWT con datos importantes
    const token = generateToken({
      _id: user._id,
      role: user.tipo_usuario,
      puede_crear_nave: user.puede_crear_nave,
    });

    return { message: 'Sesión iniciada con éxito', token };
  }

  // Enviar email para restablecer contraseña
  async resetPassword(email) {
    const cleanedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanedEmail }).lean();
    if (!user) {
      throw { status: 404, message: 'Usuario no encontrado' };
    }

    const token = generateResetToken(user._id);
    const resetLink = `${FRONTEND_URL}/change-password?token=${token}`;

    // Email HTML con diseño básico
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f5f6f8; color: #333;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <h2 style="color: #14345b; text-align: center;">Recuperación de Contraseña</h2>
          <p>Hola ${user.username},</p>
          <p>Recibimos una solicitud para restablecer tu contraseña. Si fuiste tú, haz clic en el botón de abajo:</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${resetLink}" style="background: #14345b; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Cambiar Contraseña
            </a>
          </div>
          <p>Si no realizaste esta solicitud, simplemente ignora este correo.</p>
          <hr style="margin: 32px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">
            © ${new Date().getFullYear()} WSA Agencies. Todos los derechos reservados.
          </p>
        </div>
      </div>
    `;

    await EmailService.enviarCorreo(
      email,
      "Recuperar contraseña",
      `Haz clic aquí para recuperar tu cuenta: ${resetLink}`,
      html
    );

    return { status: 201, message: 'Correo de recuperación enviado' };
  }

  // Cambiar contraseña con token válido
  async changePassword(token, newPassword) {
    const decoded = verifyToken(token);
    if (!decoded) {
      throw { status: 401, message: 'Token inválido' };
    }

    // Validar tipo de token si aplica
    if (decoded.type && decoded.type !== 'password_reset') {
      throw { status: 403, message: 'Token inválido para esta operación' };
    }

    const user = await User.findById(decoded._id);
    if (!user) {
      throw { status: 404, message: 'Usuario no encontrado' };
    }

    // Encriptar y guardar nueva contraseña
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return { status: 201, message: 'Contraseña actualizada con éxito' };
  }
}

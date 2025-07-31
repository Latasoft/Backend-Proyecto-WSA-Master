import { transporter } from "../config/nodeMailConfig.js";
import { EMAIL_USER } from "../config/config.js";

// Servicio centralizado para notificaciones
export class EmailService {
  // ✅ Este es el método que FALTABA
  static async enviarCorreo(destinatario, asunto, textoPlano, html) {
    try {
      await transporter.sendMail({
        from: EMAIL_USER,
        to: destinatario,
        subject: asunto,
        text: textoPlano,
        html: html
      });
    } catch (error) {
      console.error("❌ Error al enviar correo:", error);
      throw error;
    }
  }

  // Ya tenías este: lo dejamos igual
  static async enviarCorreoCreacionUsuarioYUpdatePassword(destinatario, username, password, linkCambioPassword) {
    try {
      const asunto = "¡Bienvenido! Información de tu cuenta";
      const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Hola ${username},</h2>
          <p>Tu cuenta ha sido creada exitosamente.</p>
          <p><strong>Usuario:</strong> ${username}</p>
          <p><strong>Contraseña:</strong> ${password}</p>
          <p>Para actualizar tu contraseña, haz clic en el siguiente enlace:</p>
          <p><a href="${linkCambioPassword}" style="color: #1a73e8;">Actualizar contraseña</a></p>
          <br>
          <p>Si no solicitaste este registro, por favor ignora este correo.</p>
          <p>Saludos,<br>Equipo de Soporte WSA</p>
        </div>
      `;

      const text = `
Hola ${username},

Tu cuenta ha sido creada exitosamente.
Usuario: ${username}
Contraseña: ${password}

Puedes cambiar tu contraseña en este enlace:
${linkCambioPassword}

Saludos,
Equipo de Soporte WSA
      `;

      await EmailService.enviarCorreo(destinatario, asunto, text, html);
    } catch (error) {
      console.error('❌ Error al enviar correo:', error);
      // No lanzamos error para que no interrumpa la creación del usuario
      // throw { status: 500, message: 'Error al enviar correo de bienvenida' };
    }
  }
}
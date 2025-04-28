import { transporter } from "../config/nodeMailConfig.js";
import { EMAIL_USER } from "../config/config.js";

// Servicio centralizado para notificaciones
export class EmailService {
    static async enviarCorreo(destinatario, asunto,text, html ) {
        try {
          const info = await transporter.sendMail({
            from: `"Soporte" <${EMAIL_USER}>`,
            to: destinatario,
            subject: asunto,
            text:text,
            html: html , // También podrías agregar un campo `html` si deseas
          });
    
          console.log("Correo enviado:", info.messageId);
        } catch (error) {
          console.error("Error al enviar correo:", error);
          throw { status: 404, message: 'Error al enviar correo' };
        }
      }
      static async enviarCorreoCreacionUsuarioYUpdatePassword(destinatario, username, linkCambioPassword) {
        try {
          const asunto = "¡Bienvenido! Información de tu cuenta";
          const html = `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <h2>Hola ${username},</h2>
              <p>Tu cuenta ha sido creada exitosamente.</p>
              <p>Usuario: <strong>${username}</strong></p>
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
    
            Para actualizar tu contraseña, visita el siguiente enlace:
            ${linkCambioPassword}
    
            Si no solicitaste este registro, ignora este correo.
    
            Equipo de Soporte WSA
          `;
    
          // Reutilizamos el método general
          await EmailService.enviarCorreo(destinatario, asunto, text, html);
        } catch (error) {
          console.error('❌ Error al enviar correo de creación de usuario:', error);
          throw { status: 500, message: 'Error al enviar correo de bienvenida' };
        }
      }
}


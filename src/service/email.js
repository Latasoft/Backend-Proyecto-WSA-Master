import { transporter } from "../config/nodeMailConfig.js";
import { EMAIL_USER } from "../config/config.js";

// Servicio centralizado para notificaciones
export class EmailService {
    static async enviarCorreo(destinatario, asunto, cuerpoTexto) {
        try {
          const info = await transporter.sendMail({
            from: `"Soporte" <${EMAIL_USER}>`,
            to: destinatario,
            subject: asunto,
            text: cuerpoTexto, // También podrías agregar un campo `html` si deseas
          });
    
          console.log("Correo enviado:", info.messageId);
        } catch (error) {
          console.error("Error al enviar correo:", error);
          throw { status: 404, message: 'Error al enviar correo' };
        }
      }
}


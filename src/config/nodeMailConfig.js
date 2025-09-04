import nodemailer from 'nodemailer';
import {EMAIL_PASSWORD, EMAIL_USER, NODE_ENV} from'./config.js';

let transporter;

// Configurar según el entorno
if (NODE_ENV === 'production') {
  // Configuración para producción usando Gmail
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });

  // Verificar la conexión con el servicio de correo
  transporter.verify((error, success) => {
    if (error) {
      console.error('Error al configurar Nodemailer:', error);
    } else {
      console.log('Nodemailer configurado correctamente');
    }
  });
} else {
  // Configuración para desarrollo - usar un mock
  console.log('Configurando Nodemailer en modo desarrollo (mock)');
  
  // Mock del transportador para desarrollo
  transporter = {
    sendMail: (mailOptions) => {
      console.log('📧 [MOCK] Correo que se enviaría:');
      console.log(`De: ${mailOptions.from}`);
      console.log(`Para: ${mailOptions.to}`);
      console.log(`Asunto: ${mailOptions.subject}`);
      console.log(`Texto: ${mailOptions.text?.substring(0, 150)}...`);
      return Promise.resolve({ response: 'Email simulado en modo desarrollo' });
    },
    verify: (callback) => {
      callback(null, true);
      console.log('Nodemailer (mock) configurado correctamente');
    }
  };
}

export { transporter };
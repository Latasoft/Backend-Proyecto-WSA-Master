// utils/sendNotification.js
import { admin } from "../config/firebaseConfig.js";
import * as config from '../config/config.js';

export const sendNotification = async (token, title, body, data = {}) => {
  try {
    // En modo desarrollo, simular envío de notificaciones
    if (config.NODE_ENV === 'development') {
      console.log('Modo desarrollo: Simulando envío de notificación');
      console.log('Token:', token);
      console.log('Título:', title);
      console.log('Cuerpo:', body);
      console.log('Datos:', data);
      return { success: true };
    }
    
    const message = {
      token,
      notification: {
        title,
        body
      },
      data: {
        ...data,
        click_action: 'FLUTTER_NOTIFICATION_CLICK' // necesario si usas notificaciones en background
      }
    };

    const response = await admin.messaging().send(message);
    console.log('Notificación enviada:', response);
    return { success: true, response };
  } catch (error) {
    console.error('Error al enviar notificación:', error);
  }
};

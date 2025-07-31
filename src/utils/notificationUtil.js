// utils/sendNotification.js
import { admin } from "../config/firebaseConfig.js";

export const sendNotification = async (token, title, body, data = {}) => {
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

  try {
    const response = await admin.messaging().send(message);
    console.log('Notificación enviada:', response);
  } catch (error) {
    console.error('Error al enviar notificación:', error);
  }
};

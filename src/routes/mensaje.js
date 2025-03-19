// routes/mensajeRoutes.js
import express from 'express';
import { createMensajeController, listMessagesController } from '../controller/mensaje.js';

const router = express.Router();

// Endpoint para crear un mensaje
router.post('/', createMensajeController);

// Endpoint para listar mensajes de un grupo
router.get('/:groupId', listMessagesController);

export default router;

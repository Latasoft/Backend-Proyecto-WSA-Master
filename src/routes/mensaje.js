// routes/mensajeRoutes.js
import express from 'express';
import { createMensajeController, listMessagesController } from '../controller/mensaje.js';
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();

// Endpoint para crear un mensaje
router.post('/',authMiddleware, createMensajeController);

// Endpoint para listar mensajes de un grupo
router.get('/:groupId',authMiddleware, listMessagesController);

export default router;

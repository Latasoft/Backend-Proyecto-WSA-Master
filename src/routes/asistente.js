import express from 'express';
import {
    getEmbarcacionesByAsistenteId,
    getAllAsistentes
} from '../controller/asistente.js';

import { verifyRoles } from '../middleware/verifyRoles.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Obtener todas las embarcaciones de un asistente por ID
router.get(
    '/embarcaciones/:asistenteId',
    authMiddleware,
    verifyRoles('ADMINISTRADOR', 'TRABAJADOR', 'ASISTENTE'),
    getEmbarcacionesByAsistenteId
);

// Obtener todos los asistentes disponibles
router.get(
    '/',
    authMiddleware,
    verifyRoles('ADMINISTRADOR', 'TRABAJADOR'),
    getAllAsistentes
);

export default router;
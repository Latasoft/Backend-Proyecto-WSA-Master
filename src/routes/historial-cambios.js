import express from 'express';
import {
    crearHistorialCambio,
    obtenerHistorialCambios
} from '../controller/historial-cambios.js';
import { authMiddleware } from '../middleware/auth.js';
import { verifyRoles } from '../middleware/verifyRoles.js';

const router = express.Router();

// POST /api/historial-cambios - Crear un nuevo registro en el historial
router.post(
    '/',
    authMiddleware,
    verifyRoles('ADMINISTRADOR', 'TRABAJADOR'),
    crearHistorialCambio
);

// GET /api/historial-cambios - Obtener historial con filtros y paginación
router.get(
    '/',
    authMiddleware,
    verifyRoles('ADMINISTRADOR', 'TRABAJADOR'),
    obtenerHistorialCambios
);

export default router;
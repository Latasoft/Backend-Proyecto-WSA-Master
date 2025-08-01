import express from 'express';
import {
    crearEmbarcacion,
    getEmbarcacionById,
    getEmbarcacionByDaNumero,
    getEmbarcacionesByClienteId,
    getEmbarcacionesByTrabajadorId,
    getAllEmbarcaciones,
    updateEmbarcacion,
    updateServiceAccion,
    getEmbarcacionesByIdAndClienteId,
    deleteEmbarcacionById,
    obtenerReporteTodas,
    actualizarEstadoYComentario,
    getEmbarcaciones,
    getEmbarcacionesFiltradas
} from '../controller/embarcacion.js';

import { verifyRoles } from '../middleware/verifyRoles.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', crearEmbarcacion);

router.put(
    '/estado/da/:da_numero',
    authMiddleware,
    verifyRoles('ADMINISTRADOR', 'TRABAJADOR'),
    actualizarEstadoYComentario
);

router.put(
    '/:_id',
    authMiddleware,
    verifyRoles('ADMINISTRADOR', 'TRABAJADOR'),
    updateEmbarcacion
);

router.put(
    '/agregar-accion/:_id',
    authMiddleware,
    verifyRoles('ADMINISTRADOR', 'TRABAJADOR'),
    updateServiceAccion
);

router.get('/', getAllEmbarcaciones);

router.get('/reporte-todas-embarcaciones', obtenerReporteTodas);

// Nueva ruta para traer embarcaciones filtradas
router.get('/filtradas', getEmbarcacionesFiltradas);

// ✅ AQUÍ corregimos la ruta y la dejamos pública
router.get('/reporte-completo', getEmbarcaciones);

// ✅ NUEVA RUTA para traer por da_numero
router.get('/da/:da_numero', getEmbarcacionByDaNumero);

router.get(
    '/:embarcacionId/cliente/:clienteId',
    authMiddleware,
    verifyRoles('CLIENTE', 'ADMINISTRADOR'),
    getEmbarcacionesByIdAndClienteId
);

router.get(
    '/:_id',
    verifyRoles('ADMINISTRADOR', 'TRABAJADOR', 'CLIENTE', "ASISTENTE"),
    getEmbarcacionById
);

router.get('/trabajador/:_id', getEmbarcacionesByTrabajadorId);

router.get('/cliente/:_id', getEmbarcacionesByClienteId);

router.delete(
    '/:_id',
    authMiddleware,
    verifyRoles('ADMINISTRADOR'),
    deleteEmbarcacionById
);

export default router;

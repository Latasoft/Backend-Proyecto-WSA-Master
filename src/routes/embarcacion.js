import express from 'express';
import {
    crearEmbarcacion,
    getEmbarcacionById,
    getEmbarcacionesByClienteId,
    getEmbarcacionesByTrabajadorId,
    getAllEmbarcaciones,
    updateEmbarcacion,
    updateServiceAccion,
    getEmbarcacionesByIdAndClienteId,
    deleteEmbarcacionById
} from '../controller/embarcacion.js'; // Importa los controladores
import  {verifyRoles} from'../middleware/verifyRoles.js'
import { authMiddleware } from '../middleware/auth.js';
const router = express.Router();

router.post('/',crearEmbarcacion)
router.put('/:_id',authMiddleware,verifyRoles('ADMINISTRADOR','TRABAJADOR'),updateEmbarcacion)
router.put('/agregar-accion/:_id',authMiddleware,verifyRoles('ADMINISTRADOR','TRABAJADOR'),updateServiceAccion)
router.get('/',getAllEmbarcaciones)
router.get('/:_id',verifyRoles('ADMINISTRADOR','TRABAJADOR'),getEmbarcacionById)
router.get('/trabajador/:_id',getEmbarcacionesByTrabajadorId)
router.get('/tracking/:embarcacionId/:userId',getEmbarcacionesByIdAndClienteId)
router.get('/cliente/:_id',getEmbarcacionesByClienteId)
router.delete('/:_id',authMiddleware,verifyRoles('ADMINISTRADOR'),deleteEmbarcacionById)
export default router;


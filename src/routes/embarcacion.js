import express from 'express';
import {
    crearEmbarcacion,
    getEmbarcacionById,
    getEmbarcacionesByClienteId,
    getEmbarcacionesByTrabajadorId,
    getAllEmbarcaciones,
    updateEmbarcacion,
    updateServiceAccion,
    getEmbarcacionesByIdAndClienteId
} from '../controller/embarcacion.js'; // Importa los controladores
import  {verifyRoles} from'../middleware/verifyRoles.js'
const router = express.Router();

router.post('/',crearEmbarcacion)
router.put('/:_id',verifyRoles('ADMINISTRADOR','TRABAJADOR'),updateEmbarcacion)
router.put('/agregar-accion/:_id',verifyRoles('ADMINISTRADOR','TRABAJADOR'),updateServiceAccion)
router.get('/',getAllEmbarcaciones)
router.get('/:_id',verifyRoles('ADMINISTRADOR','TRABAJADOR'),getEmbarcacionById)
router.get('/trabajador/:_id',getEmbarcacionesByTrabajadorId)
router.get('/tracking/:embarcacionId/:cliente_id',getEmbarcacionesByIdAndClienteId)
router.get('/cliente/:_id',getEmbarcacionesByClienteId)
export default router;


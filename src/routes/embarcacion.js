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
import { obtenerReporteTodas } from '../controller/embarcacion.js';


//IMPORTACION PARA ESTADO Y COMENTARIO
import { actualizarEstadoYComentario } from '../controller/embarcacion.js';

const router = express.Router();

router.post('/',crearEmbarcacion)
router.put('/estado/:_id',authMiddleware, verifyRoles('ADMINISTRADOR','TRABAJADOR'),actualizarEstadoYComentario)
router.put('/:_id',authMiddleware,verifyRoles('ADMINISTRADOR','TRABAJADOR'),updateEmbarcacion)
router.put('/agregar-accion/:_id',authMiddleware,verifyRoles('ADMINISTRADOR','TRABAJADOR'),updateServiceAccion)
router.get('/',getAllEmbarcaciones)
router.get('/reporte-todas-embarcaciones', obtenerReporteTodas);


// para cleinte quizas
router.get(
  '/:embarcacionId/cliente/:clienteId',
  authMiddleware,
  verifyRoles('CLIENTE', 'ADMINISTRADOR'),
  getEmbarcacionesByIdAndClienteId
);
// ruta apra poder ver el modal de la embarcaciones
router.get('/:_id',verifyRoles('ADMINISTRADOR','TRABAJADOR','CLIENTE'),getEmbarcacionById)
router.get('/trabajador/:_id',getEmbarcacionesByTrabajadorId)

router.get('/cliente/:_id',getEmbarcacionesByClienteId)
router.delete('/:_id',authMiddleware,verifyRoles('ADMINISTRADOR'),deleteEmbarcacionById)

export default router;


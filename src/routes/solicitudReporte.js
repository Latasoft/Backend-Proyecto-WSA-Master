import express from 'express';
import {crearSolicitudReporte,obtenerTodasLasSolicitudes
    ,obtenerSolicitudPorId,actualizarSolicitud,
    obtenerSolicitudesPorUsuario
} from '../controller/solicitudReporte.js';

import { authMiddleware } from '../middleware/auth.js';
import { verifyRoles } from '../middleware/verifyRoles.js';

const router = express.Router();

router.post('/',authMiddleware,verifyRoles('CLIENTE'),crearSolicitudReporte)
router.get('/',authMiddleware,verifyRoles('ADMINISTRADOR'),obtenerTodasLasSolicitudes)
router.get('/:_id',authMiddleware,verifyRoles('ADMINISTRADOR'),obtenerSolicitudPorId)
router.get('/usuario/:id',authMiddleware,verifyRoles('CLIENTE'),obtenerSolicitudesPorUsuario)
router.put('/:_id',authMiddleware,verifyRoles('ADMINISTRADOR'),actualizarSolicitud)


export default router;
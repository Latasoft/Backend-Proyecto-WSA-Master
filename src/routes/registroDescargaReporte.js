import express from 'express';
import { crearRegistroDescargaReporte,  obtenerTodasLasSolicitudes} from '../controller/registroDescargaReporte.js';
import { authMiddleware } from '../middleware/auth.js';
import { verifyRoles } from '../middleware/verifyRoles.js';

const router = express.Router();

router.post('/', authMiddleware,  crearRegistroDescargaReporte);
router.get('/', authMiddleware, verifyRoles('ADMINISTRADOR'), obtenerTodasLasSolicitudes);


export default router;
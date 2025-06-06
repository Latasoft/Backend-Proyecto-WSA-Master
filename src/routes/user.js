import express from 'express';
import { actualizarCampo } from '../controller/user.js';
import {
    createUser,
    updateUser,
    findUserById,
    getAllUsersPaginated,
    getAllEmployes,
    saveFcmTokenController,
    deleteUserById
} from '../controller/user.js'; // Importa los controladores

import { authMiddleware } from '../middleware/auth.js';
import { verifyRoles } from '../middleware/verifyRoles.js';
const router = express.Router();

router.post('/', authMiddleware, verifyRoles('ADMINISTRADOR'),createUser)
router.post('/fcm-token', authMiddleware, saveFcmTokenController);
router.get('/',getAllUsersPaginated)
router.get('/trabajadores',getAllEmployes)
router.get('/:_id',findUserById)
router.put('/:_id',updateUser)
router.delete('/:_id',authMiddleware,verifyRoles('ADMINISTRADOR'),deleteUserById)
router.put('/permiso-crear-nave/:_id', actualizarCampo);

export default router;


import express from 'express';
import { actualizarCampo } from '../controller/user.js';
import {
    createUser,
    updateUser,
    findUserById,
    getAllUsersPaginated,
    getAllEmployes,
    saveFcmTokenController,
    deleteUserById,
    toggleUserStatus
} from '../controller/user.js';
import { uploadAnyImage, handleMulterError } from '../middleware/uploadFile.js';
import { authMiddleware } from '../middleware/auth.js';
import { verifyRoles } from '../middleware/verifyRoles.js';
const router = express.Router();

router.post('/', authMiddleware, verifyRoles('ADMINISTRADOR'), uploadAnyImage, handleMulterError, createUser)
router.post('/fcm-token', authMiddleware, saveFcmTokenController);
router.get('/',getAllUsersPaginated)
router.get('/trabajadores',getAllEmployes)
router.get('/:_id',findUserById)
router.put('/:_id', uploadAnyImage, handleMulterError, updateUser)
router.patch('/:_id', actualizarCampo);
router.delete('/:_id',authMiddleware,verifyRoles('ADMINISTRADOR'),deleteUserById)
router.put('/permiso-crear-nave/:_id', actualizarCampo);
router.patch('/:_id/status', authMiddleware,verifyRoles('ADMINISTRADOR'), toggleUserStatus);

export default router;


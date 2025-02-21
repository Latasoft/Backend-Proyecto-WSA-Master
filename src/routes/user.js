import express from 'express';
import {
    createUser,
    updateUser,
    findUserById,
    getAllUsersPaginated,
    getAllEmployes
} from '../controller/user.js'; // Importa los controladores

import { authMiddleware } from '../middleware/auth.js';
import { verifyRoles } from '../middleware/verifyRoles.js';
const router = express.Router();

router.post('/',authMiddleware,verifyRoles('ADMINISTRADOR'),createUser)
router.get('/',getAllUsersPaginated)
router.get('/trabajadores',getAllEmployes)
router.get('/:_id',findUserById)
router.put('/:_id',updateUser)

export default router;


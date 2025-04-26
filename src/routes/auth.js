import express from 'express';
import {
    login,
    changePassword,
    resetPassword
} from '../controller/auth.js'; // Importa los controladores

import { resetTokenMiddleware } from '../middleware/resetToken.js';

const router = express.Router();

router.post('/login',login)
router.post("/reset-password", resetPassword);
router.post("/change-password", resetTokenMiddleware,changePassword);

export default router;

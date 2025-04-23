import express from 'express';
import {
    login,
    changePassword,
    resetPassword
} from '../controller/auth.js'; // Importa los controladores

const router = express.Router();

router.post('/login',login)
router.post("/reset-password", resetPassword);
router.post("/change-password", changePassword);

export default router;

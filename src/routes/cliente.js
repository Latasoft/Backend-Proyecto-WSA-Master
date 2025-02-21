import express from 'express';
import {
    actualizarCliente,buscarById,traerTodosClientesPaginados
} from '../controller/cliente.js'; // Importa los controladores
import { uploadFotosCliente } from '../middleware/uploadFile.js';
const router = express.Router();


router.put('/:_id',uploadFotosCliente,actualizarCliente)
router.get('/',traerTodosClientesPaginados)
router.get('/:_id',buscarById)
export default router;


import express from 'express';
import { crearEmpresaCliente, obtenerEmpresas, eliminarEmpresaCliente,
    actualizarEmpresaCliente, obtenerEmpresaClientePorId
 } from '../controller/empresa-cliente.js';
import { uploadAnyImage, handleMulterError } from '../middleware/uploadFile.js';
import { validateCreateEmpresa, validateUpdateEmpresa } from '../middleware/validateEmpresa.js';

const router = express.Router();

router.post('/', uploadAnyImage, handleMulterError, validateCreateEmpresa, crearEmpresaCliente); 
router.get('/', obtenerEmpresas);
router.delete('/:id', eliminarEmpresaCliente);
router.put('/:id', uploadAnyImage, handleMulterError, validateUpdateEmpresa, actualizarEmpresaCliente);
router.get('/:id', obtenerEmpresaClientePorId);

export default router;

import express from 'express';
import { crearEmpresaCliente, obtenerEmpresas, eliminarEmpresaCliente,
    actualizarEmpresaCliente, obtenerEmpresaClientePorId
 } from '../controller/empresa-cliente.js';



const router = express.Router();

router.post('/', crearEmpresaCliente); 
router.get('/', obtenerEmpresas);
router.delete('/:id', eliminarEmpresaCliente);
router.put('/:id', actualizarEmpresaCliente);
router.get('/:id', obtenerEmpresaClientePorId);

export default router;

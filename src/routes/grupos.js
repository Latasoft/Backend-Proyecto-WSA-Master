import express from 'express';
import {addMemberController,createGrupo,removeMemberController,listEmployeesInGrouop} from '../controller/grupos.js'
import { authMiddleware } from '../middleware/auth.js';
import { verifyRoles } from '../middleware/verifyRoles.js';

const router= express.Router();

router.post('/',createGrupo)
router.put('/:_id/add', addMemberController);
router.put('/:_id/remove', removeMemberController);
router.get('/:_id/members', listEmployeesInGrouop); // Nueva ruta para listar miembros


export default router;

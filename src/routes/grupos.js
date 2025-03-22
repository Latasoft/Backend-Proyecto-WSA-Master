import express from 'express';
import {addMemberController,createGrupo,
    removeMemberController,listGroupsForAdmin,
getGruposByUserId,getGrupoById} from '../controller/grupos.js'
import { authMiddleware } from '../middleware/auth.js';
import { verifyRoles } from '../middleware/verifyRoles.js';

const router= express.Router();

router.post('/',createGrupo)
router.get('/', listGroupsForAdmin); // Nueva ruta para listar miembros
router.get('/:_id',getGrupoById)
router.get('/user/:_id',getGruposByUserId)
router.put('/:_id/add', addMemberController);
router.put('/:_id/remove', removeMemberController);



export default router;

import express from 'express';
import { generarReportePDF } from '../controller/reporte.js';

const router = express.Router();

router.get('/pdf/:clienteId', generarReportePDF);

export default router;

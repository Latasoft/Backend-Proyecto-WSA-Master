import express from "express";
import { obtenerReporteTodas , obtenerCantidadEmbarcaciones} from "../controller/reporte-todas-embarcaciones.controller.js";

const router = express.Router();

router.get("/", obtenerReporteTodas);
router.get("/cantidad", obtenerCantidadEmbarcaciones);

export default router;

import express from "express";
import {
  getAllEmbarcaciones,
  countEmbarcaciones,
  reportEmbarcacionesByEmpresa
} from "../controller/reportesCustoms.js";

const router = express.Router();

router.get("/embarcaciones", getAllEmbarcaciones);
router.get("/embarcaciones/count", countEmbarcaciones);
router.get("/embarcaciones/report/by-country", reportEmbarcacionesByEmpresa);

export default router;

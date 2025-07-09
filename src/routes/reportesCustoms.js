import express from "express";
import {
  getAllEmbarcaciones,
  countEmbarcaciones,
  reportEmbarcacionesByCountry
} from "../controller/reportesCustoms.js";

const router = express.Router();

router.get("/embarcaciones", getAllEmbarcaciones);
router.get("/embarcaciones/count", countEmbarcaciones);
router.get("/embarcaciones/report/by-country", reportEmbarcacionesByCountry);

export default router;

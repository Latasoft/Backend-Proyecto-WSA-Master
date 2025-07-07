import { EmbarcacionService } from "../service/embarcacion.js";

const embarcacionService = new EmbarcacionService();

export const obtenerReporteTodas = async (req, res) => {
  try {
    const { country } = req.query;

    const response = await embarcacionService.obtenerReporteTodas(country);

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error en obtenerReporteTodas:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

export const obtenerCantidadEmbarcaciones = async (req, res) => {
  try {
    const { country } = req.query;

    const response = await embarcacionService.obtenerCantidadEmbarcaciones(country);

    res.status(200).json(response);
  } catch (error) {
    console.error("❌ Error en obtenerCantidadEmbarcaciones:", error);
    res.status(error.status || 500).json({ message: error.message });
  }
};

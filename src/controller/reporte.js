import { ReporteService } from '../service/reporte.js';

const reporteService = new ReporteService();

export const generarReportePDF = async (req, res) => {
  try {
    const {  fecha_inicio, fecha_fin } = req.query;

    const {clienteId}=req.params;
    // Validación básica
    if (!clienteId || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({
        message: 'Faltan parámetros obligatorios.'
      });
    }

    // Generar PDF desde el servicio
    const pdfBuffer = await reporteService.generarPDFServiciosPorCliente(
        clienteId,
      fecha_inicio,
      fecha_fin
    );

    // Enviar PDF como respuesta
    res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="reporte-usuario.pdf"',
        'Content-Length': pdfBuffer.length
      });
      
      res.end(pdfBuffer);
  } catch (error) {
    console.error('❌ Error al generar el PDF:', error.message);

    if (error.message.includes('No se encontraron embarcaciones')) {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error interno al generar el PDF' });
  }
};

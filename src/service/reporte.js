import { Embarcacion } from "../model/embarcacion.js";
import puppeteer from 'puppeteer';
import mongoose from "mongoose"; // Asegúrate de importar esto
export class ReporteService {
    async generarPDFServiciosPorCliente(clienteId, fecha_inicio, fecha_fin) {
      console.log(clienteId, fecha_inicio, fecha_fin);
      const desde = new Date(fecha_inicio);
      desde.setUTCHours(0, 0, 0, 0); // 00:00 UTC
      
      const hasta = new Date(fecha_fin);
      hasta.setUTCHours(23, 59, 59, 999); // 23:59 UTC

      const clienteObjectId = new mongoose.Types.ObjectId(clienteId);
        const embarcaciones = await Embarcacion.find({
            'clientes.cliente_id': clienteObjectId,
            fecha_creacion: { $gte: desde, $lte: hasta }
        }).populate('clientes.cliente_id', 'nombre_cliente apellido_cliente');


        if (embarcaciones.length === 0) {
          throw new Error('No se encontraron embarcaciones para ese cliente y rango de fechas.');
        } else {
            embarcaciones.forEach((e, i) => {
                console.log(`📄 Embarcación ${i + 1}:`, {
                    titulo: e.titulo_embarcacion,
                    destino: e.destino_embarcacion,
                    servicios: e.servicios?.map(s => s.nombre_servicio)
                });
            });
        }
        const htmlContent = `
      <html>
        <head>
        <meta charset="UTF-8">
          <title>Reporte de Servicios por Embarcación</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1, h2 { text-align: center; color: #003366; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; vertical-align: top; }
            th { background-color: #f0f0f0; }
          </style>
        </head>
        <body>
          <h1>WSA Agencies</h1>
          <h2>Servicios por Embarcación</h2>
          <p style="text-align: center;">
            <strong>Rango de fechas:</strong> ${desde.toLocaleDateString()} - ${hasta.toLocaleDateString()}
          </p>

          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Nombre Embarcaci&oacute;n</th>
                <th>Destino</th>
                <th>Servicios (X / 6)</th>
              </tr>
            </thead>
            <tbody>
              ${embarcaciones.map(e => {
                const clienteData = e.clientes.find(c => c.cliente_id?._id?.toString() === clienteId);
                const clienteNombre = clienteData
                  ? `${clienteData.cliente_id.nombre_cliente} ${clienteData.cliente_id.apellido_cliente}`.trim()
                  : 'Desconocido';

            const serviciosUnicos = e.servicios.map(s => s.nombre_servicio);
            const totalServicios = serviciosUnicos.length;
            const maxServicios = 6;

            return `
                  <tr>
                    <td>${clienteNombre}</td>
                    <td>${e.titulo_embarcacion}</td>
                    <td>${e.destino_embarcacion}</td>
                    <td>
                      <ul style="margin: 0; padding-left: 20px;">
                        ${serviciosUnicos.map(s => `<li>${s}</li>`).join('')}
                      </ul>
                      <strong>Total:</strong> ${totalServicios} / ${maxServicios}
                    </td>
                  </tr>
                `;
        }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();
        // Bloquear recursos innecesarios
        await page.setRequestInterception(true);
        page.on('request', req => {
            if (['stylesheet', 'image', 'font'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });
        const htmlBase64 = Buffer.from(htmlContent).toString('base64');
        await page.goto(`data:text/html;base64,${htmlBase64}`, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        return pdfBuffer;
    }
}

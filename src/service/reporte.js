import { Embarcacion } from "../model/embarcacion.js";
import puppeteer from 'puppeteer';

export class ReporteService {
    async generarPDFServiciosPorCliente(clienteId, fecha_inicio, fecha_fin) {
        const desde = new Date(fecha_inicio);
        const hasta = new Date(fecha_fin);


        console.log('📅 Rango de fechas:', desde, hasta);
        console.log('👤 Cliente ID:', clienteId);

        const embarcaciones = await Embarcacion.find({
            'clientes.cliente_id': clienteId,
            fecha_creacion: { $gte: desde, $lte: hasta }
        }).populate('clientes.cliente_id', 'nombre_cliente apellido_cliente');

        console.log('🚢 Embarcaciones encontradas:', embarcaciones.length);

        if (embarcaciones.length === 0) {
            console.warn('⚠️ No se encontraron embarcaciones con esos criterios');
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
            const clienteNombre = `${e.clientes?.[0]?.cliente_id?.nombre_cliente ?? 'Desconocido'} ${e.clientes?.[0]?.cliente_id?.apellido_cliente ?? ''}`.trim();

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

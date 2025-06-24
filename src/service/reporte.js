import { Embarcacion } from "../model/embarcacion.js";
import mongoose from "mongoose";
import { generatePdf } from 'html-pdf-node';
import fs from 'fs';
import path from 'path';
export class ReporteService {
  
    async generarPDFServiciosPorCliente(clienteId, fecha_inicio, fecha_fin) {
      const fmtDMYFromDate = (date) => {
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;
      };
      
  
      console.log(clienteId, fecha_inicio, fecha_fin);
      const desde = new Date(fecha_inicio);
      desde.setUTCHours(0, 0, 0, 0); // 00:00 UTC
      
      const hasta = new Date(fecha_fin);
      hasta.setUTCHours(23, 59, 59, 999); // 23:59 UTC

      const clienteObjectId = new mongoose.Types.ObjectId(clienteId);
      
      // Consulta modificada para evitar duplicados usando aggregate
      const embarcaciones = await Embarcacion.aggregate([
        // Match por cliente y rango de fechas
        {
            $match: {
                'clientes.cliente_id': clienteObjectId,
                fecha_creacion: { $gte: desde, $lte: hasta }
            }
        },
        // Group para eliminar duplicados
        {
            $group: {
                _id: '$_id',
                titulo_embarcacion: { $first: '$titulo_embarcacion' },
                destino_embarcacion: { $first: '$destino_embarcacion' },
                servicios: { $first: '$servicios' },
                clientes: { $first: '$clientes' },
                fecha_creacion: { $first: '$fecha_creacion' },
                fecha_arribo: { $first: '$fecha_arribo' },
                fecha_zarpe: { $first: '$fecha_zarpe' }
            }
        }
      ])
      .exec()
      .then(async (results) => {
          // Repoblar manualmente ya que aggregate no soporta populate
          const populatedResults = await Embarcacion.populate(results, {
              path: 'clientes.cliente_id',
              select: 'nombre_cliente apellido_cliente'
          });
          return populatedResults;
      });

      if (embarcaciones.length === 0) {
        throw {status:404,message:'No se encontraron embarcaciones para ese cliente y rango de fechas.'};
      } else {
        embarcaciones.forEach((e, i) => {
          console.log(`📄 Embarcación ${i + 1}:`, {
              titulo: e.titulo_embarcacion,
              destino: e.destino_embarcacion,
              fecha_arribo:e.fecha_arribo,
              fecha_zarpe:e.fecha_zarpe,
              servicios: e.servicios?.map(s => s.nombre_servicio)
          });
        });
      }

      

      // En tu función generarPDFServiciosPorCliente:
      const logoPath = path.resolve('src/assets/logoWSA.svg');
      const logoSvg = fs.readFileSync(logoPath, 'utf8');
      const desdeStr = fmtDMYFromDate(desde);
      const hastaStr = fmtDMYFromDate(hasta);
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
          <div class="header">
            ${logoSvg}
          </div>
          <h1>WSA Agencies</h1>
          <h2>Servicios por Embarcación</h2>
          <p style="text-align: center;">
            <strong>Rango de fechas:</strong> ${desdeStr} - ${hastaStr}
          </p>
          <p style="text-align: center;">
            <strong>Cantidad total de naves:</strong> ${embarcaciones.length}
          </p>


          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Nombre Embarcaci&oacute;n</th>
                <th>Destino</th>
                <th>Fecha de Arribo</th>
                <th>Fecha de Zarpe</th>
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

                const fechaArribo = e.fecha_arribo ? fmtDMYFromDate(new Date(e.fecha_arribo)) : 'Sin fecha';
                const fechaZarpe = e.fecha_zarpe ? fmtDMYFromDate(new Date(e.fecha_zarpe)) : 'Sin fecha';
      
                console.log(`📄 Embarcación ${e.titulo_embarcacion}:`, {
                  cliente: clienteNombre,
                  destino: e.destino_embarcacion,
                  fechaArribo,
                  fechaZarpe,
                  servicios: serviciosUnicos
                });
                return `
                  <tr>
                    <td>${clienteNombre}</td>
                    <td>${e.titulo_embarcacion}</td>
                    <td>${e.destino_embarcacion}</td>
                    <td>${fechaArribo}</td>
                    <td>${fechaZarpe}</td>
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

      // Generar PDF con html-pdf-node
      const file = { content: htmlContent };
      const options = {
        format: 'A4',
        margin: { top: '40px', bottom: '40px', left: '40px', right: '40px' }
      };
      
      const pdfBuffer = await generatePdf(file, options);
      return pdfBuffer;
    }
}

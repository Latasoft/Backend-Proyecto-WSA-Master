import express from 'express'
import { corsMiddleware } from './config/cors.js'
import { connectMongoDB } from './config/mongoConfig.js'
import { User } from './model/user.js' // Importar modelo User para registrarlo
import userRoutes from './routes/user.js'
import authRoutes from './routes/auth.js'
import clienteRoutes from './routes/cliente.js'
import embarcacionRoutes from './routes/embarcacion.js'
import grupoRoutes from './routes/grupos.js'
import mensajeRoutes from './routes/mensaje.js'
import reporteRoutes from './routes/reporte.js'
import solicitudReporteRoutes from './routes/solicitudReporte.js'
import registroSolicitudRoutes from './routes/registroDescargaReporte.js'
import estructuraServicioRoutes from './routes/estructura-servicios.js'
import empresaClienteRoutes from './routes/empresa-cliente.js'
import reporteTodasEmbarcacionesRoutes from "./routes/reporte-todas-embarcaciones.routes.js";
import reportesCustomsRoutes from "./routes/reportesCustoms.js"; // ✅ ✅ NUEVA LÍNEA
import historialCambiosRoutes from "./routes/historial-cambios.js";
import asistenteRoutes from "./routes/asistente.js";

const app = express();

app.use(corsMiddleware);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

await connectMongoDB();

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/embarcaciones', embarcacionRoutes);
app.use('/api/grupos', grupoRoutes);
app.use('/api/mensajes', mensajeRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/solicitud-reportes', solicitudReporteRoutes);
app.use('/api/registro-descargas-reportes', registroSolicitudRoutes);
app.use('/api/estructura-servicios', estructuraServicioRoutes);
app.use('/api/empresa-cliente', empresaClienteRoutes);
app.use('/api/embarcaciones/reporte-todas-embarcaciones', reporteTodasEmbarcacionesRoutes);

// ✅ ✅ NUEVA RUTA DE REPORTES CUSTOMS
app.use('/api/reportes-customs', reportesCustomsRoutes);

// Ruta para historial de cambios
app.use('/api/historial-cambios', historialCambiosRoutes);

// Ruta para asistentes
app.use('/api/asistentes', asistenteRoutes);

export default app;

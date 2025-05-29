import express from 'express'
import { corsMiddleware } from './config/cors.js'
import { connectMongoDB } from './config/mongoConfig.js'
import userRoutes from './routes/user.js'
import authRoutes from './routes/auth.js'
import clienteRoutes from './routes/cliente.js'
import embarcacionRoutes from './routes/embarcacion.js'
import grupoRoutes from './routes/grupos.js'
import mensajeRoutes from './routes/mensaje.js'
import reporteRoutes from './routes/reporte.js'
import solicitudReporteRoutes from './routes/solicitudReporte.js'
import registroSolicitudRoutes from './routes/registroDescargaReporte.js'
import estructuraServicioRoutes from './routes/estructura-servicio.js'
const app = express();

app.use(corsMiddleware)
app.use(express.json())

await connectMongoDB();

app.use('/api/users',userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/clientes',clienteRoutes)
app.use('/api/embarcaciones',embarcacionRoutes)
app.use('/api/grupos',grupoRoutes)
app.use('/api/mensajes',mensajeRoutes)
app.use('/api/reportes',reporteRoutes)
app.use('/api/solicitud-reportes',solicitudReporteRoutes)
app.use('/api/registro-descargas-reportes',registroSolicitudRoutes)
app.use('/api/estructura-servicios', estructuraServicioRoutes)
export default app; 
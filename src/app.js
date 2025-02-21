import express from 'express'
import { corsMiddleware } from './config/cors.js'
import { connectMongoDB } from './config/mongoConfig.js'
import userRoutes from './routes/user.js'
import authRoutes from './routes/auth.js'
import clienteRoutes from './routes/cliente.js'
import embarcacionRoutes from './routes/embarcacion.js'
const app = express();

app.use(corsMiddleware)
app.use(express.json())

await connectMongoDB();

app.use('/api/users',userRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/clientes',clienteRoutes)
app.use('/api/embarcaciones',embarcacionRoutes)

export default app; 
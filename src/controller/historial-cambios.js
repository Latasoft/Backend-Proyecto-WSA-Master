import { HistorialCambios } from '../model/historial-cambios.js';
import { User } from '../model/user.js';

// Crear un nuevo registro en el historial
export const crearHistorialCambio = async (req, res) => {
    try {
        const {
            usuario_id,
            usuario_nombre,
            entidad_tipo,
            entidad_id,
            entidad_nombre,
            accion,
            campos_modificados,
            fecha_cambio
        } = req.body;

        // Verificar que el usuario existe
        const usuarioExiste = await User.findById(usuario_id);
        if (!usuarioExiste) {
            return res.status(404).json({
                message: 'Usuario no encontrado'
            });
        }

        // Obtener IP y User Agent del request
        const ip_usuario = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
        const user_agent = req.get('User-Agent');

        const nuevoHistorial = new HistorialCambios({
            usuario_id,
            usuario_nombre,
            entidad_tipo,
            entidad_id,
            entidad_nombre,
            accion,
            campos_modificados,
            fecha_cambio: fecha_cambio || new Date(),
            ip_usuario,
            user_agent
        });

        const historialGuardado = await nuevoHistorial.save();

        res.status(201).json({
            message: 'Cambio registrado exitosamente',
            cambio: historialGuardado
        });

    } catch (error) {
        console.error('Error al crear historial de cambios:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Obtener historial de cambios con filtros y paginación
export const obtenerHistorialCambios = async (req, res) => {
    try {
        const {
            entidad_tipo,
            entidad_id,
            usuario_id,
            accion,
            fecha_inicio,
            fecha_fin,
            page = 1,
            limit = 20
        } = req.query;

        // Construir filtros
        const filtros = {};

        if (entidad_tipo) {
            filtros.entidad_tipo = entidad_tipo;
        }

        if (entidad_id) {
            filtros.entidad_id = entidad_id;
        }

        if (usuario_id) {
            filtros.usuario_id = usuario_id;
        }

        if (accion) {
            filtros.accion = accion;
        }

        // Filtro por rango de fechas
        if (fecha_inicio || fecha_fin) {
            filtros.fecha_cambio = {};
            if (fecha_inicio) {
                filtros.fecha_cambio.$gte = new Date(fecha_inicio);
            }
            if (fecha_fin) {
                filtros.fecha_cambio.$lte = new Date(fecha_fin);
            }
        }

        // Configurar paginación
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Obtener total de registros
        const totalRegistros = await HistorialCambios.countDocuments(filtros);
        const totalPages = Math.ceil(totalRegistros / limitNumber);

        // Obtener historial con populate del usuario
        const historial = await HistorialCambios.find(filtros)
            .populate('usuario_id', 'username email')
            .sort({ fecha_cambio: -1 })
            .skip(skip)
            .limit(limitNumber)
            .lean();

        // Formatear respuesta
        const historialFormateado = historial.map(item => ({
            _id: item._id,
            usuario: {
                username: item.usuario_id?.username || item.usuario_nombre,
                email: item.usuario_id?.email || 'N/A'
            },
            entidad_tipo: item.entidad_tipo,
            entidad_id: item.entidad_id,
            entidad_nombre: item.entidad_nombre,
            accion: item.accion,
            campos_modificados: item.campos_modificados,
            fecha_cambio: item.fecha_cambio,
            ip_usuario: item.ip_usuario
        }));

        res.status(200).json({
            message: 'Historial obtenido exitosamente',
            historial: historialFormateado,
            totalRegistros,
            totalPages,
            currentPage: pageNumber
        });

    } catch (error) {
        console.error('Error al obtener historial de cambios:', error);
        res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message
        });
    }
};

// Función auxiliar para registrar cambios automáticamente
export const registrarCambioAutomatico = async ({
    usuario_id,
    usuario_nombre,
    entidad_tipo,
    entidad_id,
    entidad_nombre,
    accion,
    campos_modificados,
    ip_usuario,
    user_agent
}) => {
    try {
        const nuevoHistorial = new HistorialCambios({
            usuario_id,
            usuario_nombre,
            entidad_tipo,
            entidad_id,
            entidad_nombre,
            accion,
            campos_modificados,
            fecha_cambio: new Date(),
            ip_usuario,
            user_agent
        });

        await nuevoHistorial.save();
        return true;
    } catch (error) {
        console.error('Error al registrar cambio automático:', error);
        return false;
    }
};
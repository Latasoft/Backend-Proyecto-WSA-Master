/**
 * Middleware para capturar datos necesarios para el historial de cambios
 */
export const captureHistorialData = (req, res, next) => {
    // Capturar IP del usuario
    req.historialData = {
        ip_usuario: req.ip || 
                   req.connection?.remoteAddress || 
                   req.socket?.remoteAddress || 
                   req.headers['x-forwarded-for']?.split(',')[0] ||
                   'IP no disponible',
        user_agent: req.get('User-Agent') || 'User-Agent no disponible',
        fecha_cambio: new Date()
    };
    
    next();
};

/**
 * Función auxiliar para extraer datos del usuario autenticado
 * @param {Object} req - Request object
 * @returns {Object} - Datos del usuario
 */
export const extraerDatosUsuario = (req) => {
    return {
        usuario_id: req.user?.id || req.user?._id,
        usuario_nombre: req.user?.username || req.user?.nombre || 'Usuario desconocido'
    };
};

/**
 * Función auxiliar para crear el objeto completo de historial
 * @param {Object} req - Request object
 * @param {Object} datosEntidad - Datos de la entidad
 * @returns {Object} - Objeto completo para historial
 */
export const crearDatosHistorial = (req, datosEntidad) => {
    const datosUsuario = extraerDatosUsuario(req);
    const datosCapturados = req.historialData || {};
    
    return {
        ...datosUsuario,
        ...datosEntidad,
        ...datosCapturados
    };
};
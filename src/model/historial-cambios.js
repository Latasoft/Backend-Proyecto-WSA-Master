import mongoose from 'mongoose';

const historialCambiosSchema = new mongoose.Schema({
    usuario_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    usuario_nombre: {
        type: String,
        required: true
    },
    entidad_tipo: {
        type: String,
        required: true,
        enum: ['embarcacion', 'usuario', 'cliente', 'servicio']
    },
    entidad_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    entidad_nombre: {
        type: String,
        required: true
    },
    accion: {
        type: String,
        required: true,
        enum: ['crear', 'editar', 'eliminar', 'activar', 'desactivar']
    },
    campos_modificados: [{
        campo: {
            type: String,
            required: true
        },
        valor_anterior: {
            type: mongoose.Schema.Types.Mixed
        },
        valor_nuevo: {
            type: mongoose.Schema.Types.Mixed
        },
        tipo_campo: {
            type: String
        }
    }],
    fecha_cambio: {
        type: Date,
        required: true,
        default: Date.now
    },
    ip_usuario: {
        type: String
    },
    user_agent: {
        type: String
    },
    comentario_cambios: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Índices para optimizar consultas
historialCambiosSchema.index({ entidad_tipo: 1, entidad_id: 1 });
historialCambiosSchema.index({ usuario_id: 1 });
historialCambiosSchema.index({ fecha_cambio: -1 });
historialCambiosSchema.index({ entidad_tipo: 1, fecha_cambio: -1 });

export const HistorialCambios = mongoose.model('HistorialCambios', historialCambiosSchema);
import { HistorialCambios } from '../model/historial-cambios.js';

/**
 * Servicio para gestionar el historial de cambios
 */
export class HistorialCambiosService {
    
    /**
     * Registra un cambio en el historial automáticamente
     * @param {Object} datos - Datos del cambio
     * @param {string} datos.usuario_id - ID del usuario que realizó el cambio
     * @param {string} datos.usuario_nombre - Nombre del usuario
     * @param {string} datos.entidad_tipo - Tipo de entidad (embarcacion, usuario, etc.)
     * @param {string} datos.entidad_id - ID de la entidad modificada
     * @param {string} datos.entidad_nombre - Nombre de la entidad
     * @param {string} datos.accion - Acción realizada (crear, editar, eliminar, etc.)
     * @param {Array} datos.campos_modificados - Array de campos modificados
     * @param {string} datos.ip_usuario - IP del usuario
     * @param {string} datos.user_agent - User agent del navegador
     * @returns {Promise<boolean>} - True si se registró correctamente
     */
    static async registrarCambio(datos) {
        try {
            const nuevoHistorial = new HistorialCambios({
                usuario_id: datos.usuario_id,
                usuario_nombre: datos.usuario_nombre,
                entidad_tipo: datos.entidad_tipo,
                entidad_id: datos.entidad_id,
                entidad_nombre: datos.entidad_nombre,
                accion: datos.accion,
                campos_modificados: datos.campos_modificados || [],
                fecha_cambio: new Date(),
                ip_usuario: datos.ip_usuario,
                user_agent: datos.user_agent
            });

            await nuevoHistorial.save();
            console.log(`Historial registrado: ${datos.accion} en ${datos.entidad_tipo} ${datos.entidad_nombre}`);
            return true;
        } catch (error) {
            console.error('Error al registrar cambio en historial:', error);
            return false;
        }
    }

    /**
     * Compara dos objetos y genera el array de campos modificados
     * @param {Object} objetoAnterior - Estado anterior del objeto
     * @param {Object} objetoNuevo - Estado nuevo del objeto
     * @param {Array} camposExcluidos - Campos a excluir de la comparación
     * @returns {Array} - Array de campos modificados
     */
    static compararObjetos(objetoAnterior, objetoNuevo, camposExcluidos = ['_id', '__v', 'updatedAt', 'createdAt']) {
        const camposModificados = [];
        
        // Obtener todas las claves de ambos objetos
        const todasLasClaves = new Set([
            ...Object.keys(objetoAnterior || {}),
            ...Object.keys(objetoNuevo || {})
        ]);

        for (const clave of todasLasClaves) {
            // Saltar campos excluidos
            if (camposExcluidos.includes(clave)) {
                continue;
            }

            const valorAnterior = objetoAnterior?.[clave];
            const valorNuevo = objetoNuevo?.[clave];

            // Comparar valores (considerando tipos diferentes)
            if (JSON.stringify(valorAnterior) !== JSON.stringify(valorNuevo)) {
                camposModificados.push({
                    campo: clave,
                    valor_anterior: valorAnterior,
                    valor_nuevo: valorNuevo,
                    tipo_campo: typeof valorNuevo
                });
            }
        }

        return camposModificados;
    }

    /**
     * Registra la creación de una nueva entidad
     * @param {Object} datos - Datos de la creación
     * @returns {Promise<boolean>}
     */
    static async registrarCreacion(datos) {
        return await this.registrarCambio({
            ...datos,
            accion: 'crear',
            campos_modificados: [{
                campo: 'entidad_completa',
                valor_anterior: null,
                valor_nuevo: 'Entidad creada',
                tipo_campo: 'string'
            }]
        });
    }

    /**
     * Registra la eliminación de una entidad
     * @param {Object} datos - Datos de la eliminación
     * @returns {Promise<boolean>}
     */
    static async registrarEliminacion(datos) {
        return await this.registrarCambio({
            ...datos,
            accion: 'eliminar',
            campos_modificados: [{
                campo: 'entidad_completa',
                valor_anterior: 'Entidad existente',
                valor_nuevo: null,
                tipo_campo: 'string'
            }]
        });
    }

    /**
     * Registra la edición de una entidad
     * @param {Object} datos - Datos de la edición
     * @param {Object} objetoAnterior - Estado anterior
     * @param {Object} objetoNuevo - Estado nuevo
     * @returns {Promise<boolean>}
     */
    static async registrarEdicion(datos, objetoAnterior, objetoNuevo) {
        const camposModificados = this.compararObjetos(objetoAnterior, objetoNuevo);
        
        if (camposModificados.length === 0) {
            console.log('No hay cambios para registrar en el historial');
            return true;
        }

        return await this.registrarCambio({
            ...datos,
            accion: 'editar',
            campos_modificados: camposModificados
        });
    }
}
// backend/controllers/estadisticas.controller.js
const estadisticasService = require('./estadisticas.service');

/**
 * Controlador para obtener las estadísticas del viñedo.
 * Espera parámetros de consulta para filtrar por fecha, sector y plantación.
 */
exports.getEstadisticas = async (req, res) => {
    try {
        const { fechaInicio, fechaFin, sector, plantacion } = req.query;

        // Validaciones básicas de los parámetros
        if (!fechaInicio || !fechaFin) {
            return res.status(400).json({ message: 'Las fechas de inicio y fin son requeridas.' });
        }

        const estadisticas = await estadisticasService.getEstadisticas(
            fechaInicio,
            fechaFin,
            sector,
            plantacion
        );

        if (estadisticas.length === 0) {
            return res.status(404).json({ message: 'No se encontraron estadísticas para los filtros proporcionados.' });
        }

        res.status(200).json(estadisticas);
    } catch (error) {
        console.error('Error en el controlador al obtener estadísticas:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener estadísticas.' });
    }
};

// Puedes añadir controladores para crear, actualizar, eliminar si es necesario

// backend/src/estadisticas/estadisticas.service.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Obtiene datos de estadísticas del viñedo filtrados por rango de fechas, sector y plantación.
 * @param {string} fechaInicio - Fecha de inicio en formato YYYY-MM-DD.
 * @param {string} fechaFin - Fecha de fin en formato YYYY-MM-DD.
 * @param {string} sector - Opcional. Filtra por sector. 'todos' para no filtrar.
 * @param {string} plantacion - Opcional. Filtra por plantación. 'todos' para no filtrar.
 * @returns {Promise<Array>} Lista de objetos de estadísticas.
 */
exports.getEstadisticas = async (fechaInicio, fechaFin, sector, plantacion) => {
    try {
        const whereClause = {
            fecha: {
                gte: new Date(fechaInicio),
                lte: new Date(fechaFin)
            }
        };

        if (sector && sector !== 'todos') {
            whereClause.sector = sector;
        }
        if (plantacion && plantacion !== 'todos') {
            whereClause.plantacion = plantacion;
        }

        const estadisticas = await prisma.estadisticas_vinedo.findMany({
            where: whereClause,
            orderBy: {
                fecha: 'asc' // Ordenar por fecha ascendente para los gráficos
            }
        });
        return estadisticas;
    } catch (error) {
        console.error("Error al obtener estadísticas del viñedo:", error);
        throw error;
    }
};

/**
 * Inserta un nuevo registro de estadística en la base de datos.
 * Esta función es útil para un script de importación o para futuras inserciones manuales.
 * @param {object} data - Objeto con los datos de la estadística.
 * @returns {Promise<object>} El registro de estadística creado.
 */
exports.createEstadistica = async (data) => {
    try {
        const newEstadistica = await prisma.estadisticas_vinedo.create({
            data: {
                fecha: new Date(data.fecha), // Asegúrate de que la fecha sea un objeto Date
                humedad_med: parseFloat(data.humedad_med),
                temperatura_med: parseFloat(data.temperatura_med),
                temperatura_max: parseFloat(data.temperatura_max),
                temperatura_min: parseFloat(data.temperatura_min),
                precipitacion_mm: parseFloat(data.precipitacion_mm),
                sector: data.sector,
                plantacion: data.plantacion
            }
        });
        return newEstadistica;
    } catch (error) {
        console.error("Error al crear estadística:", error);
        throw error;
    }
};

// Puedes añadir más funciones como update, delete si las necesitas

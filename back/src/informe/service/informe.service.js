const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.getInforme = async () => {
    try {
        return await prisma.informe.findMany()
    } catch (error) {
        console.error("Error al consultar el informe:", error);
        throw error;
    }
}
exports.getInformeId = async (idInforme) => {
    try {
        return await prisma.informe.findFirst({
            where: { id: idInforme }
        });
    } catch (error) {
        console.error("Error al consultar el informe:", error);
        throw error;
    }
}
exports.createIforme = async (valores) => {
    try {
        // Función para convertir 'DD-MM-YYYY' a 'YYYY-MM-DD'
        function convertirFecha(fecha) {
            if (!fecha) {
                throw new Error("La fecha no puede ser undefined");
            }

            // Asumiendo que la fecha es una cadena en formato 'YYYY-MM-DD'
            const partes = fecha.split("-");
            const año = partes[0];
            const mes = partes[1];
            const dia = partes[2];

            return new Date(año, mes - 1, dia); // Devolver un objeto Date
        }

        // Convertir las fechas
        const fechaInicio = new Date(convertirFecha(valores.fecha_inicio));
        const fechaFinal = new Date(convertirFecha(valores.fecha_final));

        // Validar si las fechas son válidas
        if (isNaN(fechaInicio.getTime()) || isNaN(fechaFinal.getTime())) {
            throw new Error("Fechas inválidas: Por favor asegúrate de que las fechas están en formato correcto.");
        }

        const nuevoInforme = await prisma.informe.create({
            data: {
                titulo: valores.titulo,
                contenido: valores.contenido,
                fecha_inicio: fechaInicio,
                fecha_final: fechaFinal,
            }
        });

        return nuevoInforme;
    } catch (error) {
        console.error("Error al crear el informe:", error);
        throw error;
    }
}

exports.deleteInforme = async (idInforme) => {
    try {
        return await prisma.informe.delete({
            where: {
                ["id"]: idInforme,
            },
        });
    } catch (error) {
        console.error("Error al eliminar el informe:", error);
        throw error;
    }
}
exports.updateInforme = async (idInforme, valor) => {
    try {
        const informeUpdate = await prisma.informe.update({
            where: {
                ["id"]: idInforme,
            },
            data: {
                titulo: valor.titulo,
                contenido: valor.contenido,
                fecha_final: new Date(valor.fecha_final),
            }
        });

        return informeUpdate
    } catch (error) {
        console.error("Error al actualizar el informe:", error);
        throw error;
    }
}

exports.searchInforme = async (termino) => {
    try {
        const isDate = (str) => {
            // Detectar y convertir fechas en formato "DD-MM-YYYY" a "YYYY-MM-DD"
            const [day, month, year] = str.split('-').map(Number);
            if (day && month && year) {
                const isoDate = new Date(`${year}-${month}-${day}`);
                return !isNaN(isoDate.getTime()) ? isoDate : null;
            }
            return null;
        };

        // Función para verificar si el término tiene formato "YYYY-MM"
        const isMonth = (str) => {
            if (typeof str !== 'string') return false; // Asegurarse de que es una cadena
            const [year, month] = str.split('-').map(Number);
            return year && month && month >= 1 && month <= 12;
        };

        // Construir el objeto de búsqueda
        const whereConditions = {
            OR: [
                {
                    titulo: {
                        contains: termino,
                    },
                },
            ],
        };

        // Si es una fecha válida, buscar por fecha exacta (ignorando la hora)
        const parsedDate = isDate(termino);
        if (parsedDate) {
            const startOfDay = new Date(parsedDate);
            startOfDay.setHours(0, 0, 0, 0); // Establecer la hora al inicio del día

            const endOfDay = new Date(parsedDate);
            endOfDay.setHours(23, 59, 59, 999); // Establecer la hora al final del día

            whereConditions.OR = [
                {
                    fecha_inicio: {
                        gte: startOfDay, // Mayor o igual al inicio del día
                        lt: endOfDay,    // Menor al final del día
                    },
                },
                {
                    fecha_final: {
                        gte: startOfDay,
                        lt: endOfDay,
                    },
                }
            ];
        } 
        // Si es un mes en formato "YYYY-MM", buscar dentro de ese mes
        else if (isMonth(termino)) {
            const [year, month] = termino.split('-').map(Number);
            const startOfMonth = new Date(year, month - 1, 1); // Primer día del mes
            const startOfNextMonth = new Date(year, month, 1); // Primer día del mes siguiente

            whereConditions.OR = [
                {
                    fecha_inicio: {
                        gte: startOfMonth, // Mayor o igual al primer día del mes
                        lt: startOfNextMonth // Menor al primer día del mes siguiente
                    },
                },
                {
                    fecha_final: {
                        gte: startOfMonth,
                        lt: startOfNextMonth
                    },
                }
            ];
        }
        // Si es un año, agregar condiciones de búsqueda por año
        else {
            const year = parseInt(termino, 10);
            const isYear = !isNaN(year) && year > 0;

            if (isYear) {
                const startOfYear = new Date(year, 0, 1); // 1 de enero del año
                const startOfNextYear = new Date(year + 1, 0, 1); // 1 de enero del siguiente año

                whereConditions.OR = [
                    {
                        fecha_inicio: {
                            gte: startOfYear, // Mayor o igual a 1 de enero del año
                            lt: startOfNextYear // Menor a 1 de enero del siguiente año
                        },
                    },
                    {
                        fecha_final: {
                            gte: startOfYear,
                            lt: startOfNextYear
                        },
                    }
                ];
            }
        }

        // Ejecutar la búsqueda con las condiciones construidas
        return await prisma.informe.findMany({
            where: whereConditions,
        });
    } catch (error) {
        console.error(error); // Manejar el error de forma adecuada
        throw new Error("Error al buscar informes"); // Lanzar un error amigable
    }
}

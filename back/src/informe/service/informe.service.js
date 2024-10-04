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
        const isDate = (str) => !isNaN(Date.parse(str));

        // Construir el objeto de búsqueda
        const whereConditions = {
            OR: [
                {
                    titulo: {
                        contains: termino,
                    },
                },
                {
                    contenido: {
                        contains: termino,
                        
                    },
                },
            ],
        };
        const year = parseInt(termino, 10);
        const isYear = !isNaN(year) && year > 0;

        // Si es un año, agregar condiciones de fecha
        if (isYear) {
            const startOfYear = new Date(year, 0, 1); // 1 de enero del año
            const startOfNextYear = new Date(year + 1, 0, 1); // 1 de enero del siguiente año

            whereConditions.OR.push(
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
            );
        } else if (isDate(termino)) {
            // Si es una fecha válida, agregar condiciones de fecha exactas
            const fecha = new Date(termino);
            whereConditions.OR.push(
                {
                    fecha_inicio: {
                        equals: fecha,
                    },
                },
                {
                    fecha_final: {
                        equals: fecha,
                    },
                }
            );
        }

        // Ejecutar la búsqueda con las condiciones construidas
        return await prisma.informe.findMany({
            where: whereConditions,
        });
    } catch (error) {
        console.error(error); // Manejar el error de forma adecuada
        throw new Error("Error al buscar informes"); // Lanzar un error amigable
    }
};

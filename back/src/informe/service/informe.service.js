const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getInforme = async () => {
    try {
        return await prisma.informe.findMany({
            include: {
                planDeRiego: true,
                imagenes: true,
            },
        });
    } catch (error) {
        console.error("Error al consultar los informes:", error);
        throw error;
    }
}

// *** INICIO DE LA CORRECCIÓN: Log de depuración del ID ***
exports.getInformeId = async (idInforme) => {
    try {
        console.log("informe.service.js: ID recibido para getInformeId:", idInforme); // Log del ID
        return await prisma.informe.findFirst({
            where: { id: idInforme },
            include: {
                imagenes: true,
                planDeRiego: {
                    include: {
                        diaPlan: true
                    }
                }
            },
        });
    } catch (error) {
        console.error("Error al consultar el informe por ID en el servicio:", error); // Mensaje más específico
        throw error;
    }
}
// *** FIN DE LA CORRECCIÓN ***

exports.createIforme = async (valores) => {
    try {
        const nuevoInforme = await prisma.informe.create({
            data: {
                titulo: valores.titulo,
                contenido: valores.contenido,
                fecha_inicio: valores.fecha_inicio,
                fecha_final: valores.fecha_final,
            }
        });

        if (valores.imagen_urls && Array.isArray(valores.imagen_urls) && valores.imagen_urls.length > 0) {
            for (const imagenUrl of valores.imagen_urls) {
                await prisma.imagenesInforme.create({
                    data: {
                        url: imagenUrl,
                        idInforme: nuevoInforme.id,
                    }
                });
            }
        }

        return nuevoInforme;
    } catch (error) {
        console.error("Error al crear el informe:", error);
        throw error;
    }
};

exports.deleteInforme = async (idInforme) => {
    try {
        const informe = await prisma.informe.findUnique({
            where: { id: idInforme },
            include: { planDeRiego: true, imagenes: true }
        });

        if (!informe) {
            throw new Error('El Informe no existe.');
        }

        if (informe.planDeRiego) {
            console.log('Eliminando DiaPlan para el PlanDeRiego con ID:', informe.planDeRiego.id);
            await prisma.diaPlan.deleteMany({
                where: { idPlan: informe.planDeRiego.id }
            });

            await prisma.planDeRiego.delete({
                where: { id: informe.planDeRiego.id }
            });
        }

        if (informe.imagenes && Array.isArray(informe.imagenes) && informe.imagenes.length > 0) {
            console.log(`Eliminando ${informe.imagenes.length} ImagenesInforme para el informe con ID:`, idInforme);
            await prisma.imagenesInforme.deleteMany({
                where: { idInforme: idInforme }
            });
        } else {
            console.log('No hay imágenes relacionadas con el informe. Se omite la eliminación de imágenes.');
        }

        await prisma.informe.delete({
            where: { id: idInforme }
        });

        return { message: 'El Informe se eliminó correctamente.' };
    } catch (error) {
        console.error("Error al eliminar el informe:", error);
        throw new Error(`No se pudo eliminar el informe: ${error.message}`);
    }
};

exports.updateInforme = async (idInforme, valor) => {
    try {
        console.log("Valores recibidos para actualizar informe:", valor);

        const informeUpdate = await prisma.informe.update({
            where: {
                id: idInforme,
            },
            data: {
                titulo: valor.titulo,
                contenido: valor.contenido,
                fecha_inicio: valor.fecha_inicio,
                fecha_final: valor.fecha_final,
            }
        });

        if (valor.imagen_urls && Array.isArray(valor.imagen_urls) && valor.imagen_urls.length > 0) {
            for (const imagenUrl of valor.imagen_urls) {
                await prisma.imagenesInforme.create({
                    data: {
                        url: imagenUrl,
                        idInforme: informeUpdate.id,
                    }
                });
            }
        }

        return informeUpdate;
    } catch (error) {
        console.error("Error al actualizar el informe:", error);
        throw error;
    }
}

exports.searchInforme = async (termino) => {
    try {
        const informes = await prisma.informe.findMany({
            where: {
                OR: [
                    {
                        titulo: {
                            contains: termino,
                            mode: 'insensitive'
                        },
                    },
                    {
                        fecha_final: {
                            contains: termino,
                            mode: 'insensitive'
                        },
                    },
                    {
                        fecha_inicio: {
                            contains: termino,
                            mode: 'insensitive'
                        },
                    },
                ],
            },
        });
        return informes;
    } catch (error) {
        console.error("Error al buscar informes:", error);
        throw new Error("Error al buscar informes");
    }
}

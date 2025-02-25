const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
exports.getInforme = async () => {
    try {
        return await prisma.informe.findMany({
            include: {
                planDeRiego: true,
                imagenInforme: true,
            },
        });
    } catch (error) {
        console.error("Error al consultar el informe:", error);
        throw error;
    }
}
exports.getInformeId = async (idInforme) => {
    try {
        return await prisma.informe.findFirst({
            where: { id: idInforme },
            include: {
                imagenInforme: true,
                planDeRiego: {
                    include: {
                        diaPlan: true
                    }
                }
            },
        });
    } catch (error) {
        console.error("Error al consultar el informe:", error);
        throw error;
    }
}
exports.createIforme = async (valores) => {
    try {
        const nuevoInforme = await prisma.informe.create({
            data: {
                titulo: valores.titulo,
                contenido: valores.contenido,
                fecha_inicio: valores.fecha_inicio,
                fecha_final: valores.fecha_inicio,
            }
        });
        if (valores.imagen_urls) {
            for (const imagen of valores.imagen_urls) {
                await prisma.imagenesInforme.create({
                    data: {
                        url: imagen,
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
            include: { planDeRiego: true, imagenInforme: true }
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

        if (informe.imagenInforme) {
            console.log('Eliminando ImagenInforme con ID:', informe.imagenInforme.id);
            await prisma.imagenesInforme.delete({
                where: { id: informe.imagenInforme.id }
            });
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
        console.log(valor); 
        const informeUpdate = await prisma.informe.update({
            where: {
                ["id"]: idInforme,
            },
            data: {
                titulo: valor.titulo,
                contenido: valor.contenido,
                fecha_final: valor.fecha_final,
            }
        });
        if (valor.imagen_url) {
            await prisma.ImagenesInforme.create({
                data: {
                    url: valor.imagen_url,
                    idInforme: nuevoInforme.id, // Asegúrate de que esto coincida con la relación
                }
            });
        }

        return informeUpdate
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
                          // Ignora mayúsculas y minúsculas
                        },
                    },
                    {
                        fecha_final: {
                            contains: termino,
                        },
                    },
                    {
                        fecha_inicio:{
                            contains:termino,
                        }
                    },
                ],
            },
        });
        return informes;
    } catch (error) {
        console.error(error); // Manejar el error de forma adecuada
        throw new Error("Error al buscar informes"); // Lanzar un error amigable
    }
}

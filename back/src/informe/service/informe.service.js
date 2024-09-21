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
        return  await prisma.informe.findFirst({
            where: {  id: idInforme }
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
                fecha_inicio: new Date(valores.fecha_inicio),
                fecha_final: new Date(valores.fecha_final),
            }
        });
        return nuevoInforme;
    } catch (error) {
        console.error("Error al crear el informe:", error);
        throw error;
    }
}

exports.deleteInforme = async ( idInforme) => {
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
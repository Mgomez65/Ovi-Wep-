const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCalendarioId = async (id)=>{
    try {
        return prisma.PlanDeRiego.findUnique({
        where:{
            "id": id,}
        })
    }catch (error) {
        console.error("Error al consultar el calendario:", error);
        throw error;
    }
};

exports.getCalendarios = async ()=>{
    try {
        return prisma.PlanDeRiego.findMany()
    } catch (error) {
        console.error("Error al consultar el calendario:", error);
        throw error;
    }
}

exports.createPlanDeRiego = async (data)=>{
    try {
        const NuevoCalendario =await prisma.PlanDeRiego.create({
            data: {
                inicio: new Date(data.inicio),
                fin: new Date(data.fin),
                idInforme: parseInt(data.idInforme),
                titulo: data.titulo
            },
        });
        return NuevoCalendario;
    } catch (error) {
        console.error("Error al consultar el usuario:", error);
        throw error;
    }
}

exports.deletePlanDeRiego = async (id) => {
    try {
        await prisma.DiaPlan.deleteMany({
            where: {
                idPlan: id,
            },})
        return prisma.PlanDeRiego.delete({
            where: {
                id: id,
            },
    })
    } catch (error) {
        console.error("Error al eliminar el calendario:", error);
        throw error;
    }
};

exports.updateCalendario = async (calendarioId, datos) => {
    try {
        const calendarioUpdate = await prisma.planDeRiego.update({
            where: {
                id: calendarioId,
            },
            data:{
                titulo: datos.titulo,
                fin: new Date(datos.fin),
                color: datos.color,
            }
        });
        return calendarioUpdate
    } catch (error) {
        console.error("Error al actualizar el calendario:", error);
        throw error;
    }
};

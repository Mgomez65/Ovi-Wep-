const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getPlanDiaID = async (data)=>{
    try {
        console.log(data)
        return prisma.DiaPlan.findMany({
        where:{
            "idPlan": data.idPlan,
            "fechaDia":data.fechaDia
        }
        })
    }catch (error) {
        console.error("Error al consultar el calendario:", error);
        throw error;
    }
};

exports.getPlanDia = async (data)=>{
    try {
        return prisma.DiaPlan.findMany({
            where:{
                "idPlan": Number(data)
            }
    })
    } catch (error) {
        console.error("Error al consultar el calendario:", error);
        throw error;
    }
}
exports.createDiaPlan = async (data)=>{
    try {
        const NuevoCalendario =await prisma.DiaPlan.create({
            data: {
                fechaDia: new Date(data.fechaDia).toISOString(),
                titulo: data.titulo,
                color: data.color,
                idPlan:Number(data.idPlan)
            },
        });
        return NuevoCalendario;
    } catch (error) {
        console.error("Error al consultar el usuario:", error);
        throw error;
    }
}
exports.deletePlanDIa = async (id) => {
    try {
        return prisma.DiaPlan.delete({
            where: {
                id: id,
            },
    })
    } catch (error) {
        console.error("Error al eliminar el calendario:", error);
        throw error;
    }
};
exports.allPlanDia = async (data) => {
    const minuto0 = new Date(data);
    minuto0.setHours(0, 0, 0, 0);

    const minuto12 = new Date(data);
    minuto12.setHours(23, 59, 59, 999);

    return prisma.DiaPlan.findMany({
        where: {
            fechaDia: {
                gte: minuto0,
                lte: minuto12
            }
        }
    });
}
exports.UpdataPlanDiaPut = async (id,data) => {
    try {
        return prisma.DiaPlan.update({
            where: {
                id: id
            },
            data: {
                fechaDia: new Date(data.fechaDia).toISOString(),
                titulo: data.titulo,
                color: data.color
            }
        });
    } catch (error) {
        console.error("Error al actualizar el calendario:", error);
        throw error;
    }
}
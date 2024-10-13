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
                "idPlan": data
            }
    })
    } catch (error) {
        console.error("Error al consultar el calendario:", error);
        throw error;
    }
}
exports.createDiaPlan = async (data)=>{
    try {
        console.log(data)
        const NuevoCalendario =await prisma.DiaPlan.create({
            data: {
                fechaDia: new Date(data.fechaDia).toISOString(),
                titulo: data.titulo,
                color: data.color,
                idPlan:data.idPlan
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
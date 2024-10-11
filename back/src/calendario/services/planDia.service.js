exports.getPlanDiaID = async (inicio)=>{
    try {
        return prisma.DiaPlan.findMany({
        where:{
            "inicio": inicio,}       
        })
    }catch (error) {
        console.error("Error al consultar el calendario:", error);
        throw error;
    }
};
exports.getPlanDia = async ()=>{
    try {
        return prisma.DiaPlan.findMany()
    } catch (error) {
        console.error("Error al consultar el calendario:", error);
        throw error;
    }
}
exports.createDiaPlan = async (data)=>{
    try {
        const NuevoCalendario =await prisma.DiaPlan.create({
            data: {
                fechaDia:data.fechaDia,
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
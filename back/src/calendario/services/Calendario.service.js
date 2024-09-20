const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
exports.getCalendarioId = async (inicio)=>{
    try {
        return prisma.calendario.fields({
        where:{
            "inicio": inicio,}       
        })
    }catch (error) {
        console.error("Error al consultar el calendario:", error);
        throw error;
    }
};


exports.getCalendarios = async ()=>{
    try {
        return prisma.calendario.findMany()
    } catch (error) {
        console.error("Error al consultar el calendario:", error);
        throw error;
    }
}





exports.createCalendario = async (calendario)=>{
    try {
        const NuevoCalendario =await prisma.calendario.create({
            data: {
                titulo: calendario.titulo,
                inicio: new Date(calendario.inicio),
                fin: new Date(calendario.fin),
                color: calendario.color,

            },
        });
        return NuevoCalendario;    
    } catch (error) {
        console.error("Error al consultar el usuario:", error);
        throw error;
    }
}
exports.updateCalendario = async (calendarioId, datos) => {
    try {
        const calendarioUpdate = await prisma.calendario.update({
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



exports.deleteCalendario = async (calendarioId) => {
    try {
        return prisma.calendario.delete({
            where: {
                id: calendarioId,
            },
    })      
    } catch (error) {
        console.error("Error al eliminar el calendario:", error);
        throw error;
    }
};
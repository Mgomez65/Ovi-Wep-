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
            // Construir el objeto de datos para Prisma
            const planData = {
                titulo: data.titulo,
                inicio: new Date(data.inicio).toISOString(),
                fin: new Date(data.fin).toISOString(),
            };

            // Si data.idInforme existe y es un número válido, lo añadimos.
            // Si idInforme es opcional en schema.prisma (Int?), Prisma aceptará null/undefined
            // si no se proporciona, o un número si se proporciona.
            if (data.idInforme !== undefined && data.idInforme !== null && !isNaN(parseInt(data.idInforme))) {
                planData.idInforme = parseInt(data.idInforme);
            }
            // Si no se proporciona idInforme, no se añade a planData, y Prisma lo tratará como NULL

            const NuevoCalendario = await prisma.PlanDeRiego.create({
                data: planData,
            });
            return NuevoCalendario;
        } catch (error) {
            console.error("Error al crear el PlanDeRiego:", error);
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
    }

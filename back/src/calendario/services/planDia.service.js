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
        // data.fechaDia ahora es un string ISO UTC (e.g., "2025-07-13T00:00:00.000Z")
        const fechaDiaObj = new Date(data.fechaDia);

        // Validamos si la fecha parseada es válida
        if (isNaN(fechaDiaObj.getTime())) {
            console.error("Fecha inválida recibida para createDiaPlan:", data.fechaDia);
            throw new Error("Fecha de evento inválida.");
        }

        const NuevoCalendario =await prisma.DiaPlan.create({
            data: {
                fechaDia: fechaDiaObj, // Enviar el objeto Date (UTC) directamente a Prisma
                titulo: data.titulo,
                color: data.color,
                idPlan:Number(data.idPlan)
            },
        });
        return NuevoCalendario;
    } catch (error) {
        console.error("Error al crear DiaPlan:", error);
        if (error.name === 'PrismaClientValidationError' || error.message === "Fecha de evento inválida.") {
            throw error;
        }
        throw new Error("Error al crear el plan del día.");
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

exports.allPlanDia = async (fechaInicio, fechaFin, idPlan) => {
    console.log("Service received fechaInicio (raw):", fechaInicio);
    console.log("Service received fechaFin (raw):", fechaFin);
    console.log("Service received idPlan (raw):", idPlan);

    // Estas fechas ya vienen como ISO strings en UTC desde el frontend
    const startOfMonth = new Date(fechaInicio);
    const endOfMonth = new Date(fechaFin);

    // Validar si las fechas son válidas después de la conversión
    if (isNaN(startOfMonth.getTime()) || isNaN(endOfMonth.getTime())) {
        const errorMessage = `Error: Fechas de consulta inválidas. Fecha de inicio: '${fechaInicio}' -> ${startOfMonth}, Fecha de fin: '${fechaFin}' -> ${endOfMonth}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    // Los strings ISO ya deberían representar el inicio/fin del día en UTC,
    // por lo que setUTCHours no debería ser estrictamente necesario si el frontend es preciso.
    // Sin embargo, lo mantengo como una capa de seguridad para asegurar que el rango sea exacto.
    startOfMonth.setUTCHours(0, 0, 0, 0);
    endOfMonth.setUTCHours(23, 59, 59, 999);

    return prisma.DiaPlan.findMany({
        where: {
            idPlan: idPlan,
            fechaDia: {
                gte: startOfMonth,
                lte: endOfMonth
            }
        }
    });
}
exports.UpdataPlanDiaPut = async (id,data) => {
    try {
        // data.fechaDia ahora es un string ISO UTC (e.g., "2025-07-13T00:00:00.000Z")
        const fechaDiaObj = new Date(data.fechaDia);

        if (isNaN(fechaDiaObj.getTime())) {
            console.error("Fecha inválida recibida para UpdataPlanDiaPut:", data.fechaDia);
            throw new Error("Fecha de evento inválida.");
        }

        return prisma.DiaPlan.update({
            where: {
                id: id
            },
            data: {
                fechaDia: fechaDiaObj, // Enviar el objeto Date (UTC) directamente a Prisma
                titulo: data.titulo,
                color: data.color
            }
        });
    } catch (error) {
        console.error("Error al actualizar el calendario:", error);
        if (error.name === 'PrismaClientValidationError' || error.message === "Fecha de evento inválida.") {
            throw error;
        }
        throw new Error("Error al actualizar el plan del día.");
    }
}

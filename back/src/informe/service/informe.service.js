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
    console.log(valores)

    try {
        // Función para convertir 'DD-MM-YYYY' a 'YYYY-MM-DD'
        function convertirFecha(fecha) {
            if (!fecha) {
              throw new Error("La fecha no puede ser undefined");
            }
            
            // Asumiendo que la fecha es una cadena en formato 'YYYY-MM-DD'
            const partes = fecha.split("-");
            const año = partes[0];
            const mes = partes[1];
            const dia = partes[2];
            
            return new Date(año, mes - 1, dia); // Devolver un objeto Date
          }

        // Convertir las fechas
        const fechaInicio = new Date(convertirFecha(valores.fecha_inicio));
        const fechaFinal = new Date(convertirFecha(valores.fecha_final));

        // Validar si las fechas son válidas
        if (isNaN(fechaInicio.getTime()) || isNaN(fechaFinal.getTime())) {
            throw new Error("Fechas inválidas: Por favor asegúrate de que las fechas están en formato correcto.");
        }

        const nuevoInforme = await prisma.informe.create({
            data: {
                titulo: valores.titulo,
                contenido: valores.contenido,
                fecha_inicio: fechaInicio,
                fecha_final: fechaFinal,
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
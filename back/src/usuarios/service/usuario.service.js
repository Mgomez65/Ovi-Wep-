const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.getuserId = async ( columna,dato) => {
    try {
        return prisma.usuario.findFirst({
            where: {
                [columna]: dato,
            },
        })
    } catch (error) {
        console.log('Error en la consulta:', error);
        throw error;
    }
};

exports.getAllUsers = async ( ) => {
    try {
       return prisma.usuario.findMany()
    } catch (error) {
        console.log('Error en la consulta:', error);
        throw error;
    }

};


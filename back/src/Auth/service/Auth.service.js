const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.getSelectUSer = async (columna, valor) => {
    try {
        const resultado = await prisma.usuario.findMany({
            where: { [columna]: valor }
        });
        return resultado.length > 0; 
    } catch (error) {
        console.log(error);
        return null; 
    }
};


exports.createUser = async (datos,passHash)=>{
    try {
        console.log(datos)       
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                Nombre: datos.Nombre,
                Apellido: datos.Apellido,
                CUIL: datos.CUIL,
                Dirrecion: datos.Direccion,
                Email: datos.Email,
                Password: passHash,
                Num_empleado:datos.Num_empleado
            }
        });
        return nuevoUsuario
    }catch (error) {
        console.error("Error al consultar el usuario:", error);
        throw error;
    }}

exports.getuserId = async ( columna,dato) => {
    return prisma.usuario.findFirst(
        { where: { [columna]: dato } } 
    )
};
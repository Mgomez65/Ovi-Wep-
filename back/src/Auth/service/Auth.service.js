const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.getSelectUSer = async (columna, valor) => {
    try {
        const resultado = await prisma.usuario.findMany({
            where: { [columna]: valor }
        });
        return resultado.length > 0; 
    } catch (error) {
        return null; 
    }
};


exports.createUser = async (datos,passHash)=>{
    try {     
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                Nombre: datos.Nombre,
                Apellido: datos.Apellido,
                CUIL: datos.CUIL,
                Dirrecion: datos.Dirrecion,
                Email: datos.Email,
                Password: passHash,
                Num_empleado:parseInt(datos.Num_empleado),
                rol:datos.rol
            }
        });
        return nuevoUsuario
    }catch (error) {
        throw error;
    }}

exports.getuserId = async ( columna,dato) => {
    return prisma.usuario.findFirst(
        { where: { [columna]: dato } } 
    )
};
const conexion = require("../../../dataBase/DB")


exports.getSelectUSer = async (columna, valor) => {
    try {
        const [resultado] = await conexion.query(`SELECT * FROM usuario WHERE ${columna} = ?`, [valor], async (error) => {
            if (error) throw error;});
        return resultado.length > 0; 
    } catch  (error) {
        console.log(error) 
    }
};


exports.createUser = async (data,passHash)=>{
    try {
        
        await conexion.query("INSERT into usuario set ?", {Num_empleado:data.Num_empleado, Username: data.Username, Apellido:data.Apellido,CUIL: data.CUIL, Direccion:data.Direccion, Email: data.Email,Password: passHash })
        const [resultado] = await conexion.query(`SELECT * FROM usuario WHERE Num_empleado = ?`, [data.Num_empleado],async (error) => {
            if (error) throw error;});
        return resultado.length > 0 ; 
    }catch (error) {
        console.error("Error al consultar el usuario:", error);
        throw error;
    }}

exports.getuserId = async ( columna,dato) => {
    try {
        console.log("entre")
        const [respuesta] =  await conexion.query(`select * from usuario where ${columna} = ?`,[dato])
        return respuesta.length > 0 ? respuesta : [];
    } catch (error) {
        console.log('Error en la consulta:', error);
        throw error;
    }
};
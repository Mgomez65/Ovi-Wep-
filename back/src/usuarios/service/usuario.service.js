const conexion = require("../../../dataBase/DB")

exports.getuserId = async ( columna,dato) => {
    try {
        const [respuesta] =  await conexion.query(`select * from usuario where ${columna} = ?`,[dato])
        return respuesta.length > 0 ? respuesta : [];
    } catch (error) {
        console.log('Error en la consulta:', error);
        throw error;
    }
};

exports.getAllUsers = async ( ) => {
    try {
        const [respuesta] =  await conexion.query("select * from usuario")
        if (respuesta.length > 0) {
            return respuesta
        } else {
            return null
        } 
    } catch (error) {
        console.log('Error en la consulta:', error);
        throw error;
    }

};


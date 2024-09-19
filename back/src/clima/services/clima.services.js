const conexion = require("../../../dataBase/DB")

exports.getCalendarioId = async (inicio)=>{
    try {
        const [resultado] = await conexion.query(`SELECT * FROM calendario WHERE inicio = ?`, [inicio]);
        return resultado.length > 0 ? resultado : [];
    } catch (error) {
        console.error("Error al consultar el calendario:", error);
        throw error;
    }
};


exports.getCalendarios = async ()=>{
    try {
        const [respuesta]= await conexion.query("select * from  calendario")
        return  respuesta.length > 0 ? respuesta : [];
    } catch (error) {
        console.error("Error al consultar el calendario:", error);
        throw error;
    }
}





exports.createCalendario = async (calendario)=>{
    try {
        await conexion.query("INSERT into calendario set ?",{ titulo: calendario.titulo, inicio: calendario.inicio, fin:calendario.fin, color:calendario.color} )
        const [resultado] = await conexion.query(`SELECT * FROM calendario WHERE inicio = ?`, [calendario.inicio],async (error) => {
            if (error) throw error;});
        console.log(resultado)
        return resultado.length > 0;      
    } catch (error) {
        console.error("Error al consultar el usuario:", error);
        throw error;
    }
}
exports.updateCalendario = async (calendarioId, datos) => {
    try {
        await conexion.query(`UPDATE calendario SET ? WHERE id = ${calendarioId}`,[datos]);
        const [resultado] = await conexion.query("SELECT * FROM calendario WHERE id = ?", [calendarioId]);
        return resultado.length > 0 ? resultado : [];
    } catch (error) {
        console.error("Error al actualizar el calendario:", error);
        throw error;
    }
};



exports.deleteCalendario = async (calendarioId) => {
    try {
        const [resultado] = await conexion.query("DELETE FROM calendario WHERE id = ?", [calendarioId]);
        return resultado;
    } catch (error) {
        console.error("Error al eliminar el calendario:", error);
        throw error;
    }
};
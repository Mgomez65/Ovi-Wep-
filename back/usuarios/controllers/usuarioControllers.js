
const conexion = require("../../dataBase/DB")
exports.register =  async(req,res )=>{}
exports.login =  async(req,res )=>{}




exports.getUsuarioId = async(req,res) =>{
    const usuarioId = req.params.id;
    conexion.query("select * from usuarios where id = ?  " ,[usuarioId],(error,resultado)=>{
        if(error){
            console.error('Error en la consulta a la base de datos:', error);
            return res.status(500).send('Error interno del servidor');
        }
        if (resultado.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.status(200).json(resultado[0]);
    } )
}
exports.getUsuario = async(req,res) =>{
    conexion.query("select * from usuarios",(error,resultado)=>{
        if(error){
            console.error('Error en la consulta a la base de datos:', error);
            return res.status(500).send('Error interno del servidor');
        }
        if (resultado.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.status(200).json(resultado);
    } )
}
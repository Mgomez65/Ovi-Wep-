const servisioUsuario= require("../service/usuario.service")

exports.getUsuarioId = async (req, res) => {
    try {
        const usuarioId = parseInt(req.params.id, 10);
        const respuesta = await servisioUsuario.getuserId("Num_empleado",usuarioId)
        if (!respuesta) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.status(200).json(respuesta);     
    } catch (error) {
        console.log(error)
    }
}
exports.getUsuario = async (req, res) => {
    try {
        const respuesta = await servisioUsuario.getAllUsers();
        res.status(200).json(respuesta);
    } catch (error) {
        console.log(error)
    }
}

exports.UpdataUsersPut = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}




const servisioUsuario= require("../service/usuario.service")

exports.getUsuarioId = async (req, res) => {
    try {
        const usuarioId = req.params.id;
        const respuesta = await servisioUsuario.getuserId("Num_empleado",usuarioId)
        if (respuesta.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.status(200).json(respuesta[0]);     
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




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
        const userID= req.params.id ;
       
        console.log(userID)
        if (userID === null || isNaN(userID)) {
            return res.status(400).send('ID de usuario no válido');
        }
        const data = req.body
        const respuesta = await servisioUsuario.updateUser(Number(userID), data)
        if (!respuesta) {
            return res.status(404).send('Usuario no encontrado');
        }
        res.status(200).json(respuesta);
        
    } catch (error) {
        console.log(error)
    }
}




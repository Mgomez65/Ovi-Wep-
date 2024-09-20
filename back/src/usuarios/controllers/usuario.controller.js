const bcryptjs = require('bcryptjs')
const servisioUsuario = require("../service/usuario.service")


exports.register = async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        let passHash = await bcryptjs.hash(data.Password, 10)
        if (await servisioUsuario.getSelectUSer("Num_empleado",data.Num_empleado )){
            return res.status(409).send('El Num_empleado ya está en uso');
        }
        if (await servisioUsuario.getSelectUSer("Email",data.Email )){
            return res.status(409).send('El email ya está en uso');
        }
        if (await servisioUsuario.getSelectUSer('CUIL', data.CUIL)) {
            return res.status(409).send('El CUIL ya está en uso');
        }
        if (await servisioUsuario.createUser(data,passHash)) {
            return res.status(200).send('usario registrado');
        }else {
            return res.status(500).send('Error interno del servidor');
        }
            
    } catch (error) {
        console.log(error)
    }
}

exports.login = async (req, res) => {
    try {
        const data = req.body
        console.log(data)
        const respuesta = await servisioUsuario.getuserId("Email", data.Email)
        console.log(respuesta)
        if(respuesta.length  == 0){
            return res.status(404).send('No se ha encontrado un usuario con este email');
        }
        if (!(await bcryptjs.compare(data.password, respuesta.Password))) {
            return res.status(401).send('Contraseña incorrecta');
        }
        console.log("exicto")
        return res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.log(error)
    }
}

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




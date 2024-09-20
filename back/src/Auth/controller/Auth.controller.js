const bcryptjs = require('bcryptjs')
const servisioUsuario = require("../service/Auth.service")


exports.register = async (req, res) => {
    try {
        const data = req.body;    
        const passHash = await bcryptjs.hash(data.Password, 10);
        
        if (await servisioUsuario.getSelectUSer('CUIL', data.CUIL)) {
            return res.status(409).json( {message: 'El CUIL ya esta en uso '});
        }
        
        if (await servisioUsuario.getSelectUSer("Email", data.Email)) {
            return res.status(409).json( {message: 'El Email ya esta en uso '});
        }
        if (await servisioUsuario.getSelectUSer("Num_empleado", data.Num_empleado)) {
            return res.status(409).json( {message: 'El numero de empleado ya esta en uso '});
        }
        await servisioUsuario.createUser(data, passHash);

        return res.status(200).json( {message: 'usuario registrado exitoso'});
        
    } catch (error) {
        console.error('Error en el registro:', error);
        return res.status(500).send('Error interno del servidor');
    }
};
exports.login = async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        const respuesta = await servisioUsuario.getuserId("Email", data.Email);
        if (!respuesta) {
            return res.status(404).send('No se ha encontrado un usuario con este email');
        }   
        const passwordMatch = await bcryptjs.compare(data.password, respuesta.Password);
        if (!passwordMatch) {
            return res.status(401).send('Contraseña incorrecta');
        }
        return res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        return res.status(500).send('Error interno del servidor');
    }
};


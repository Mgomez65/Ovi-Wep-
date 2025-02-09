const bcryptjs = require('bcryptjs')
const servisioUsuario = require("../service/Auth.service")
const jwt = require('jsonwebtoken')

exports.register = async (req, res) => {
    try {
        const data = req.body;   
        if (!data.Password) {
            return res.status(400).json({ message: 'La contraseña es requerida' });
        }
        const passHash = await bcryptjs.hash(data.Password,10);
        
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
        const { Email, password } = req.body;
      
        if (!Email || !password) {
            return res.status(400).json({ message: 'El email y la contraseña son requeridos' });
        }
        
        const respuesta = await servisioUsuario.getuserId("Email", Email);
        if (!respuesta) {
            return res.status(404).json({ message: 'No se encontró un usuario con este email' });
        }   
        const passwordMatch = await bcryptjs.compare(password, respuesta.Password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const usuario = {
            Email: respuesta.Email,
            Num_empleado: respuesta.Num_empleado,
            Rol: respuesta.rol,
        };

        const token = jwt.sign({ usuario }, process.env.SECRET_KEY, { expiresIn: '1h' });

        res.cookie("Acceso_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });

        return res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token
        });

    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};


const bcryptjs = require('bcryptjs')
const conexion = require("../../dataBase/DB")

exports.register = async (req, res) => {
    try {
        const data = req.body;
        conexion.query("select * from usuarios where Email = ? ", [data.Email], async (error, resultado) => {
            if (error) throw error;
            if (resultado.length > 0) {
                return res.status(409).send('El email ya está en uso');
            }
            conexion.query("select * from usuarios where Username = ?", [data.Username], async (error, resultado) => {
                if (error) throw error;
                if (resultado.length > 0) {
                    return res.status(409).send('El nombre de usuario ya está en uso');
                }
                conexion.query("select * from usuarios where DNI = ? ", [data.DNI], async (error, resultado) => {
                    if (error) throw error;
                    if (resultado.length > 0) {
                        return res.status(409).send('El DNI ya está en uso');
                    }
                    let passHash = await bcryptjs.hash(data.Password, 10)
                    conexion.query("INSERT into usuarios set ?", { Username: data.Username, Password: passHash, Email: data.Email, DNI: data.DNI }, async (error, resultado) => {
                        if (error) {
                            console.log(error)
                            return res.status(500).send('Error interno del servidor');
                        } else {
                            res.status(200).json({ message: 'Usuario registrado exitosamente', });
                        }
                    })
                })
            })
        })
    } catch (error) {
        console.log(error)

    }
}

exports.login = async (req, res) => {
    try {
        const data = req.body;
        console.log(data)
        conexion.query("select * from usuarios where Email =? ", [data.Email], async (error, resultado) => {
            if (error) throw error;
            if (resultado.length === 0) {
                return res.status(404).send('No se ha encontrado un usuario con este email');
            }
            if (!(await bcryptjs.compare(data.password, resultado[0].Password))) {
                return res.status(401).send('Contraseña incorrecta');
            }
            console.log("exicto")
            return res.status(200).json({ message: 'Inicio de sesión exitoso' });
        })
    } catch (error) {
        console.log(error)
    }
}

exports.getUsuarioId = async (req, res) => {
    try {
        const usuarioId = req.params.id;
        conexion.query("select * from usuarios where id = ?  ", [usuarioId], (error, resultado) => {
            if (error) {
                console.error('Error en la consulta a la base de datos:', error);
                return res.status(500).send('Error interno del servidor');
            }
            if (resultado.length === 0) {
                return res.status(404).send('Usuario no encontrado');
            }
            res.status(200).json(resultado[0]);
        })
    } catch (error) {
        console.log(error)
    }

}
exports.getUsuario = async (req, res) => {
    try {
        conexion.query("select * from usuarios", (error, resultado) => {
            if (error) {
                console.error('Error en la consulta a la base de datos:', error);
                return res.status(500).send('Error interno del servidor');
            }
            if (resultado.length === 0) {
                return res.status(404).send('Usuario no encontrado');
            }
            res.status(200).json(resultado);
        })
    } catch (error) {
        console.log(error)
    }
}
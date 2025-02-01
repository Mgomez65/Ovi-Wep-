const jwt = require('jsonwebtoken');

exports.validar = (req, res, next) => {
    try {
        const token = req.cookies.Acceso_token; 
        
        if (!token) {
            return res.status(401).json({ error: "Token no proporcionado" });
        }

        jwt.verify(token, process.env.SECRET_KEY, (error, decoded) => {
            if (error) {
                return res.status(401).json({ error: "Token invalido" });
            }

            if (!decoded.usuario) {
                return res.status(400).json({ error: "El token no contiene información del usuario" });
            }

            req.usuario = decoded.usuario; 
            next();
        });
    } catch (error) {
        return res.status(401).json({ error: "Error al validar el token" });
    }
};

exports.validarRolAdmin = (req, res, next) => {
   
    if (!req.usuario) {
        return res.status(500).json({ error: "Falta la información del usuario" });
    }    
    if (req.usuario.Rol !== 'admin') {
        return res.status(403).json({ error: "Acceso denegado: no tienes el rol adecuado" });
    }
    next(); 
};



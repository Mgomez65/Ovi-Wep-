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
            req.usuario = decoded.usuario;
            next();
        });
    } catch (error) {
        return res.status(401).json({ error: "Error al validar el token" });
    }
};


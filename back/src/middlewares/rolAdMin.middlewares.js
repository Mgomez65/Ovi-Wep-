const validarRolAdmin = (req, res, next) => {
   
    if (!req.usuario) {
        return res.status(500).json({ error: "Falta la información del usuario" });
    }

    
    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({ error: "Acceso denegado: no tienes el rol adecuado" });
    }

    next(); 
};

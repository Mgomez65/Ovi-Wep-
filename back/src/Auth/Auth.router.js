const express = require('express');
const router = express.Router();
const controllersAuth = require("./controller/Auth.controller")

router.post("/register", controllersAuth.register)
router.post("/login",controllersAuth.login)
router.post('/logout', (req, res) => {
    res.cookie('Acceso_token', '', { maxAge: 1 });
    res.status(200).json({ message: 'Cierre de sesión exitoso' });
  });


module.exports = router;
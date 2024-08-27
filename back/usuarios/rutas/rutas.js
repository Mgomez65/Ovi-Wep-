const express = require('express');
const router = express.Router();
const controllerusuarios = require("../controllers/usuarioControllers")

router.post("/register", controllerusuarios.register)
router.post("/login", controllerusuarios.login)

router.get('/users/:id',controllerusuarios.getUsuarioId)
router.get('/users',controllerusuarios.getUsuario)



module.exports = router;
const express = require('express');
const router = express.Router();
const controllerusuarios = require("./controllers/usuario.controller")

router.post("/register", controllerusuarios.register)
router.post("/login", controllerusuarios.login)




router.get('/users/:id',controllerusuarios.getUsuarioId)
router.get('/users',controllerusuarios.getUsuario)

router.put('/actualizarUsers/:id',controllerusuarios.UpdataUsersPut)

module.exports = router;
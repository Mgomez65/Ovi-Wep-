const express = require('express');
const router = express.Router();
const controllerusuarios = require("./controllers/usuario.controller")
const middlewares = require("../middlewares/autenticado.middlewares")



router.get('/users/:id',[middlewares.validar],[middlewares.validarRolAdmin],controllerusuarios.getUsuarioId)
router.get('/users',[middlewares.validar],[middlewares.validarRolAdmin],controllerusuarios.getUsuario)

router.put('/actualizarUsers/:id',[middlewares.validar],controllerusuarios.UpdataUsersPut)

module.exports = router;
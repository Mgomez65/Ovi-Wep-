const express = require('express');
const router = express.Router();
const controllerusuarios = require("./controllers/usuario.controller")



router.get('/users/:id',controllerusuarios.getUsuarioId)
router.get('/users',controllerusuarios.getUsuario)

router.put('/actualizarUsers/:id',controllerusuarios.UpdataUsersPut)

module.exports = router;
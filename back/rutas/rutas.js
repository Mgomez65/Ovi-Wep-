const express = require('express');
const router = express.Router();
const controllerusuarios = require("../controllers/usuarioControllers")

router.post("/register", controllerusuarios.register)
router.post("/login", controllerusuarios.login)



module.exports = router;
const express = require('express');
const router = express.Router();
const controllersAuth = require("./controller/Auth.controller")

router.post("/register", controllersAuth.register)
router.post("/login",controllersAuth.login)

module.exports = router;
const express = require('express');
const router = express.Router();
const controllers = require('./controllers/calendario.controller')
const middlewares = require("../middlewares/autenticado.middlewares")

router.get('/getCalendario',[middlewares.validar],controllers.getCalendario)
router.post('/getCalendarioID',[middlewares.validar],controllers.getCalendarioId)

router.post('/createCalendario',[middlewares.validar],controllers.CreateCalendario)
router.delete('/deleteCalendario/:id',[middlewares.validar],controllers.DeleteCalendario)


router.put('/actualizarCalendario/:id',[middlewares.validar],controllers.UpdataCalendarioPut)



module.exports = router;
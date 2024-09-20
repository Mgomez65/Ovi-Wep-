const express = require('express');
const router = express.Router();
const controllers = require('./controllers/calendario.controller')

router.get('/getCalendario',controllers.getCalendario)
router.post('/getCalendarioID',controllers.getCalendarioId)

router.post('/createCalendario',controllers.CreateCalendario)
router.delete('/deleteCalendario/:id',controllers.DeleteCalendario)


router.put('/actualizarCalendario/:id',controllers.UpdataCalendarioPut)



module.exports = router;
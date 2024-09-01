const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllersCalendario')

router.get('/getCalendario',controllers.getCalendario)
router.post('/getCalendarioID',controllers.getCalendarioId)

router.post('/createCalendario',controllers.CreateCalendario)
router.delete('/deleteCalendario/:id',controllers.DeleteCalendario)

router.patch('/actualizarCalendario/:id',controllers.UpdataCalendarioPatch)
router.put('/actualizarCalendario/:id',controllers.UpdataCalendarioPut)



module.exports = router;
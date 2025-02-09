const express = require('express');
const router = express.Router();
const controllers = require('./controllers/PlanDeRiego.controller')
const controllersDia = require('./controllers/PlanDIa.controllers')

const middlewares = require("../middlewares/autenticado.middlewares")

//calendario
router.get('/getPlanDeRiego',controllers.getPlanRiego) //anda
router.get('/getPlan/:id',controllers.getPlanRiegoID)//Anda
router.post('/createCalendario',controllers.createPlanRiego)//Anda
router.delete('/deleteCalendario/:id',controllers.DeleteCalendario)
router.put('/actualizarCalendario/:id',controllers.UpdataCalendarioPut)

//calendarioDia
router.get('/allplanDia',controllersDia.allPlanDIa)
router.get('/getPlanDIa',controllersDia.getPlanDia) //anda 
router.delete('/deletePlanDia/:id',controllersDia.DeletePlanDia)
router.post('/createDiaPlan/:id',controllersDia. CreateDiaPlan)//anda
router.get('/getPlanDiaID',controllersDia.getPlanDiaID)//Anda
router.put('/actualizarPlanDia/:id',controllersDia.UpdataPlanDiaPut)
module.exports = router;
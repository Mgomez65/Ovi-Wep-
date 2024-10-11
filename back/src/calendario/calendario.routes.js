const express = require('express');
const router = express.Router();
const controllers = require('./controllers/PlanDeRiego.controller')
const controllersDia = require('./controllers/PlanDIa.controllers')

const middlewares = require("../middlewares/autenticado.middlewares")
//mostrar
router.get('/getPlanDeRiego',controllers.getPlanRiego) //anda
router.get('/getPlanDIa',controllersDia.getPlanDia) //anda 


router.get('/getPlan/:id',controllers.getPlanRiegoID)//Anda
router.post('/getPlanDiaID',controllersDia.getPlanDiaID)//Anda



router.post('/createCalendario',controllers.createPlanRiego)//Anda
router.post('/createDiaPlan',controllersDia. CreateDiaPlan)//anda


router.delete('/deleteCalendario/:id',controllers.DeleteCalendario)
router.delete('/deletePlanDia/:id',controllersDia.DeletePlanDia)


router.put('/actualizarCalendario/:id',controllers.UpdataCalendarioPut)



module.exports = router;
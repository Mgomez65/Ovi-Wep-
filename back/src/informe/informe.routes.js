const express = require('express');
const router = express.Router();
const controllerinforme = require("./controller/informe.controller")





router.post("/create",controllerinforme.createIforme)

router.get("/users",controllerinforme.getInforme)
router.get("/user/:id",controllerinforme.getInformeId)

router.delete("/delete/:id",controllerinforme.deleteInforme)
router.put("/update/:id",controllerinforme.updateInforme)


router.get("/search", controllerinforme.searchInforme)



module.exports = router




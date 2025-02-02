const express = require('express');
const router = express.Router();
const controllerinforme = require("./controller/informe.controller");
const upload = require('../middlewares/subirImagenes.middelware');


router.get('/descargar/:idInforme', controllerinforme.downloadPDF);
router.post("/create", upload, controllerinforme.createIforme);
router.get("/", controllerinforme.getInforme);
router.get("/:id", controllerinforme.getInformeId);
router.delete("/delete/:id", controllerinforme.deleteInforme);
router.put("/update/:id",controllerinforme.updateInforme);
router.post("/search", controllerinforme.searchInforme);

module.exports = router;

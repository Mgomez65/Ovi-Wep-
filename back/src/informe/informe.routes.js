const express = require('express');
const router = express.Router();
const controllerinforme = require("./controller/informe.controller");
const multer = require('multer');
const path = require('path');

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Rutas
router.get('/descargar/:idInforme', controllerinforme.downloadPDF);
router.post("/create", upload.single('imagen'), controllerinforme.createIforme);
router.get("/users", controllerinforme.getInforme);
router.get("/user/:id", controllerinforme.getInformeId);
router.delete("/delete/:id", controllerinforme.deleteInforme);
router.put("/update/:id", controllerinforme.updateInforme);
router.post("/search", controllerinforme.searchInforme);

module.exports = router;

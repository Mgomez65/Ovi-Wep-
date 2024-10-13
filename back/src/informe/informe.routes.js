const express = require('express');
const router = express.Router();
const controllerinforme = require("./controller/informe.controller");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.resolve(__dirname, '../../../front/public/img');
// Crea la carpeta si no existe
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configuración del almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Middleware de multer
const upload = multer({ storage });

router.get('/descargar/:idInforme', controllerinforme.downloadPDF);
router.post("/create", upload.single('imagen'), controllerinforme.createIforme);
router.get("/users", controllerinforme.getInforme);
router.get("/user/:id", controllerinforme.getInformeId);
router.delete("/delete/:id", controllerinforme.deleteInforme);
router.put("/update/:id", controllerinforme.updateInforme);
router.post("/search", controllerinforme.searchInforme);

module.exports = router;

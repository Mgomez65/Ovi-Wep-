const express = require('express');
const router = express.Router();
const informeController = require('./controller/informe.controller');

router.get('/', informeController.getInforme);
router.get('/lista', informeController.lista);
router.post('/create', informeController.createIforme);
router.get('/:id', informeController.getInformeId);
router.put('/update/:id', informeController.updateInforme);
router.delete('/delete/:id', informeController.deleteInforme);
router.get('/search', informeController.searchInforme);
// NUEVA RUTA: Para descargar informes
router.get('/descargar/:id', informeController.descargarInforme); // Asegúrate de que el ID se pasa aquí

module.exports = router;

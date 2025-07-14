// backend/routes/estadisticas.routes.js
const express = require('express');
const router = express.Router();
// CORRECCIÓN AQUÍ: La ruta debe ser relativa a la misma carpeta
const estadisticasController = require('./estadisticas.controller'); // CAMBIADO de '../controllers/estadisticas.controller'
const middlewares = require("../middlewares/autenticado.middlewares"); // Asumiendo que tienes middlewares de autenticación

// Ruta para obtener estadísticas. Requiere autenticación y rol de admin (si aplica).
// Puedes ajustar los middlewares según tus necesidades de seguridad.
router.get('/estadisticas', [middlewares.validar, middlewares.validarRolAdmin], estadisticasController.getEstadisticas);

module.exports = router;
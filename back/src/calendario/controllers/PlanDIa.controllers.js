const servicioPlan = require("../services/planDia.service")

exports.getPlanDiaID = async (req, res) => {
    try {
        let data = req.body
        let calendario = await servicioPlan.getPlanDiaID(data)
        if (!calendario) {
            return res.status(404).json({ message: 'No hay eventos para la fecha' });
        }
        res.status(200).json(calendario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor." });
    }
}

exports.getPlanDia = async (req, res) => {
    try {
        const data = req.query.idPlan
        const respuesta = await servicioPlan.getPlanDia(data)
        if (respuesta.length === 0) {
            return res.status(404).json({ message: 'No hay ningún evento en estas fechas' });
        }
        res.status(200).json(respuesta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor." });
    }
}

exports.CreateDiaPlan = async (req, res) => {
    try {
        let data = req.body;
        const idPlan = parseInt(req.params.id);
        if (isNaN(idPlan)) {
            return res.status(400).json({ message: "ID de Plan de Riego inválido." });
        }
        data.idPlan = idPlan;

        const fechaDia = new Date(data.fechaDia);
        data.fechaDia = fechaDia.toISOString();

        const calendario = await servicioPlan.createDiaPlan(data);
        if (!calendario) {
            return res.status(500).json({ message: 'Error interno del servidor al crear evento' });
        }
        res.status(200).json(calendario);
    } catch (error) {
        console.error("Error al crear DiaPlan:", error);
        res.status(500).json({ error: "Error del servidor al crear evento." });
    }
}

exports.DeletePlanDia = async (req, res) => {
    try {
        const data = parseInt(req.params.id);
        const resultado = await servicioPlan.deletePlanDIa(data);
        if (!resultado) {
            return res.status(404).json({ message: "Calendario no encontrado." });
        }
        res.status(200).json({ message: "Calendario eliminado con éxito." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor." });
    }
};

// allPlanDIa para recibir fechaInicio, fechaFin y idPlan desde query
exports.allPlanDIa = async (req, res) => {
    try {
        const fechaInicioParam = req.query.fechaInicio;
        const fechaFinParam = req.query.fechaFin;
        const idPlanParam = parseInt(req.query.idPlan, 10); // Parsear a entero

        console.log("Controller received fechaInicioParam:", fechaInicioParam);
        console.log("Controller received fechaFinParam:", fechaFinParam);
        console.log("Controller received idPlanParam:", idPlanParam);

        if (!fechaInicioParam || !fechaFinParam || isNaN(idPlanParam)) {
            return res.status(400).json({ message: 'Fechas de inicio, fin y ID de plan son requeridos para la consulta del rango.' });
        }

        const respuesta = await servicioPlan.allPlanDia(fechaInicioParam, fechaFinParam, idPlanParam);
        if (respuesta.length === 0) {
            return res.status(404).json({ message: 'No hay eventos para el rango de fechas especificado para este plan.' });
        }
        res.status(200).json(respuesta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor." });
    }
}

exports.UpdataPlanDiaPut = async (req, res) => { // CORREGIDO: req, res como parámetros
    try {
        let data = req.body;
        const id = parseInt(req.params.id, 10); // Parsear a entero
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID de evento inválido para actualizar." });
        }
        const calendario = await servicioPlan.UpdataPlanDiaPut(id, data);
        if (!calendario) {
            return res.status(404).json({ message: "Evento de calendario no encontrado." });
        }
        res.status(200).json({ message: "Evento de calendario actualizado exitosamente." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error del servidor." });
    }
}

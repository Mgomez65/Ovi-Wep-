const servicioPlan = require("../services/Calendario.service")

exports.getPlanRiegoID = async (req, res) => {
    try {
        let data = parseInt(req.params.id)
        let calendario = await servicioPlan.getCalendarioId(data)
        if (!calendario) {
            return res.status(404).send('No hay eventos para la fecha');
        }
        res.status(200).json(calendario);
    } catch (error) {
        console.log(error)
    }
}
exports.getPlanDiaID = async (req, res) => {
    try {
        let data = parseInt(req.params.id)
        let calendario = await servicioPlan.getPlanDiaID(data)
        if (!calendario) {
            return res.status(404).send('No hay eventos para la fecha');
        }
        res.status(200).json(calendario);
    } catch (error) {
        console.log(error)
    }
}

exports.getPlanRiego = async (req, res) => {
    try {
        let calendario = req.body
        const respuesta = await servicioPlan.getCalendarios()
        if (respuesta.length === 0) {
            return res.status(404).send('no hay ningun evento en estas fechas ');
        }
        res.status(200).json(respuesta);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error del servidor." });
    }
}

exports.createPlanRiego = async (req, res) => {
    try {
        const data = req.body
        const  calendario = await servicioPlan.createPlanDeRiego(data)
        if (!calendario) {
            return res.status(500).send('Error interno del servidor');
        }
        res.status(200).json(calendario);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error del servidor." });
    }

}

exports.DeleteCalendario = async (req, res) => {
    try {
        const calendarioId = parseInt(req.params.id);
        const resultado = await servicioPlan.deletePlanDeRiego(calendarioId);
        if (!resultado) {
            return res.status(404).json({ message: "Calendario no encontrado." });
        }
        res.status(200).json({ message: "Calendario eliminado con éxito." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error del servidor." });
    }
};

exports.UpdataCalendarioPut = async (req, res) => {
    try {
        const calendarioId = parseInt(req.params.id);
        const datos = req.body
        const respuesta = await servicioPlan.updateCalendario(calendarioId,datos)
        if(!respuesta) {
            return res.status(404).json({ message: "Calendario no encontrado." });
        }
        res.status(200).json({ message: "Calendario actualizado exitosamente." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error del servidor." });
    }
}

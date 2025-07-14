    const servicioPlan = require("../services/Calendario.service")

    exports.getPlanRiegoID = async (req, res) => {
        try {
            let data = parseInt(req.params.id)
            let calendario = await servicioPlan.getCalendarioId(data)
            if (!calendario) {
                return res.status(404).json({ message: 'No hay eventos para la fecha' });
            }
            res.status(200).json(calendario);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error del servidor." });
        }
    }

    exports.getPlanRiego = async (req, res) => {
        try {
            const respuesta = await servicioPlan.getCalendarios();
            if (respuesta.length === 0) {
                return res.status(404).json({ message: 'No hay ningún plan de riego registrado.' });
            }
            res.status(200).json(respuesta);
        } catch (error) {
            console.error("Error al obtener los planes de riego:", error);
            res.status(500).json({ error: "Error del servidor al obtener planes de riego." });
        }
    }

    exports.createPlanRiego = async (req, res) => {
        try {
            const data = req.body;
            const calendario = await servicioPlan.createPlanDeRiego(data);
            if (!calendario) {
                return res.status(500).json({ message: 'Error interno del servidor al crear plan de riego' });
            }
            res.status(200).json(calendario);
        } catch (error) {
            console.error("Error en el controlador createPlanRiego:", error); // Mensaje más específico
            // Si el error es de validación de Prisma, puedes intentar ser más específico
            if (error.code === 'P2002' && error.meta?.target?.includes('idInforme')) {
                return res.status(400).json({ message: 'Error de validación: El ID de informe proporcionado no es válido o ya está en uso.' });
            }
            res.status(500).json({ error: "Error del servidor al crear plan de riego." });
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
            console.error(error);
            res.status(500).json({ error: "Error del servidor." });
        }
    };

    exports.UpdataCalendarioPut = async (req, res) => {
        try {
            const calendarioId = parseInt(req.params.id);
            const datos = req.body
            const respuesta = await servicioPlan.updateCalendario(calendarioId, datos)
            if (!respuesta) {
                return res.status(404).json({ message: "Calendario no encontrado." });
            }
            res.status(200).json({ message: "Calendario actualizado exitosamente." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error del servidor." });
        }
    }

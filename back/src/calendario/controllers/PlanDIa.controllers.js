const servicioPlan = require("../services/planDia.service")


exports.getPlanDiaID = async (req, res) => {
    try {
        let data = req.body
        let calendario = await servicioPlan.getPlanDiaID(data)
        if (!calendario) {
            return res.status(404).send('No hay eventos para la fecha');
        }
        res.status(200).json(calendario);
    } catch (error) {
        console.log(error)
    }
}

exports.getPlanDia = async (req, res) => {
    try {
        const data = req.body.idPlan
        const respuesta = await servicioPlan.getPlanDia(data)
        if (respuesta.length === 0) {
            return res.status(404).send('no hay ningun evento en estas fechas ');
        }
        res.status(200).json(respuesta);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error del servidor." });
    }
}

exports.CreateDiaPlan = async (req, res) => {
    try {
        const data = req.body;
        const fechaDia = new Date(data.fechaDia);
        console.log(data)
     
        fechaDia.setDate(fechaDia.getDate() + 1);
        data.fechaDia = fechaDia.toISOString();
        console.log(data)
        const  calendario = await servicioPlan.createDiaPlan(data)
        
        if (!calendario) {
            return res.status(500).send('Error interno del servidor');  
        } 
        res.status(200).json(calendario);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error del servidor." });
    }

}

exports.DeletePlanDia = async (req, res) => {
    try {
        const data = parseInt(req.params.id);
        console.log(data)
        const resultado = await servicioPlan.deletePlanDeRiego(data);  
        if (!resultado) {
            return res.status(404).json({ message: "Calendario no encontrado." });
        } 
        res.status(200).json({ message: "Calendario eliminado con éxito." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error del servidor." });
    }
};

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
        let data = req.body;
        const idPlan = req.params.id;
        const fechaDia = new Date(data.fechaDia);
        //fechaDia.setDate(fechaDia.getDate() + 1);
        data.fechaDia = fechaDia.toISOString();
       
        data = {idPlan, ...data}
       
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
        
        const resultado = await servicioPlan.deletePlanDIa(data);  
        if (!resultado) {
            return res.status(404).json({ message: "Calendario no encontrado." });
        } 
        res.status(200).json({ message: "Calendario eliminado con éxito." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error del servidor." });
    }
};

exports.allPlanDIa = async (req, res) => {
    try {
        const fecha = new Date();
        const fechahoy = fecha.toISOString().split('T')[0];

        // Llamar al servicio para obtener los planes del día
        const respuesta = await servicioPlan.allPlanDia(fechahoy);
        if (respuesta.length === 0) {
            return res.status(404).send('No hay eventos para la fecha');
        }
        res.status(200).json(respuesta);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error del servidor" });
    }
    




}
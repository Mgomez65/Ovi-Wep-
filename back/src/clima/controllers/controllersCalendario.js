const conexion = require("../../../dataBase/DB")
const servicioClima = require("../services/clima.services")

exports.getCalendarioId = async (req, res) => {
    try {
        let data = req.body
        console.log(data)
        let calendario = await servicioClima.getCalendarioId(data.inicio)
        if (calendario.length === 0) {
            return res.status(404).send('No hay eventos para la fecha');
        }
        res.status(200).json(calendario);
    } catch (error) {
        console.log(error)
    }
}

exports.getCalendario = async (req, res) => {
    try {
        let calendario = req.body
        const respuesta = await servicioClima.getCalendarios()
        if (respuesta.length === 0) {
            return res.status(404).send('no hay ningun evento en estas fechas ');
        }
        res.status(200).json(respuesta);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error del servidor." });
    }
}

exports.CreateCalendario = async (req, res) => {
    try {
        const data = req.body
        const  calendario = await servicioClima.createCalendario(data)
        if (calendario) {
            res.status(200).json(calendario);
        } else {
            return res.status(500).send('Error interno del servidor');
        }      
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Error del servidor." });
    }

}

exports.DeleteCalendario = async (req, res) => {
    try {
        const calendarioId = req.params.id;
        console.log(calendarioId);
        
        const resultado = await servicioClima.deleteCalendario(calendarioId);
        
        if (resultado.affectedRows === 0) {
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
        const calendarioId = req.params.id;
        const datos = req.body  
        const respuesta = await servicioClima.updateCalendario(calendarioId,datos)
        if (respuesta.length > 0) {
            res.status(200).json({ message: 'Calendario actualizado exitosamente',respuesta });
        } else {
            res.status(404).json({ message: 'Calendario no encontrado' });
        }   
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error del servidor." });
    }
}




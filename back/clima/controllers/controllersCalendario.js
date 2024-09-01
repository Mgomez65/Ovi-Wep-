const conexion = require("../../dataBase/DB")


exports.getCalendario = async (req, res) => {
    try {
        let calendario = req.body
        conexion.query("select * from  calendario where inicio = ? ", [calendario.inicio], (error, resultado) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Error al mostrar datos al  calendario." });
            }
            if (resultado.length === 0) {
                return res.status(404).send('No hay eventos para la fecha');
            }
            res.status(200).json(resultado);
        })
    } catch (error) {
        console.log(error)
    }
}

exports.CreateCalendario = async (req, res) => {
    try {
        let calendario = req.body
        console.log(calendario)
        conexion.query("INSERT INTO calendario SET ? ", { titulo: calendario.titulo, inicio: calendario.inicio, fin:calendario.fin,color:calendario.color}, (error, resultado) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Error al Agregar datos al  calendario." });
            }
            res.status(201).json(resultado);
            console.log(resultado)
            
            
        })
    } catch (error) {
        console.log(error)
    }

}
exports.DeleteCalendario = async (req, res) => {
    try {
        const calendarioId = req.params.id;
        console.log(calendarioId)
        conexion.query("DELETE FROM calendario WHERE ID_calendario = ?", [calendarioId], (error, resultado) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ error: "Error al eliminar el calendario." });
            }
            if (resultado.affectedRows === 0) {
                return res.status(404).json({ message: "Calendario no encontrado." });
            }
            res.status(200).json({ message: "Calendario eliminado con éxito." });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error del servidor." });
    }
}
exports.UpdataCalendarioPatch = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}
exports.UpdataCalendarioPut = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}
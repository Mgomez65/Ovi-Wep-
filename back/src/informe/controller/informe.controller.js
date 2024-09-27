const serciosInforme = require("../service/informe.service")


exports.getInforme = async (req, res) => {
    try {
        
        const informes = await serciosInforme.getInforme()
        if (!informes) {
            return res.status(404).send('No hay informes disponibles');
        }
        res.status(200).json(informes)
    } catch (error) {
        console.log(error)
    }
}
exports.getInformeId = async (req, res) => {
    try {
        
        const informeId = parseInt(req.params.id,10)
        console.log(informeId)
        const informe = await serciosInforme.getInformeId(informeId)
        if (!informe) {
            return res.status(404).send('Informe no encontrado');
        }
        res.status(200).json(informe)
    } catch (error) {
        console.log(error)
    }
}
exports.createIforme = async (req, res) => {
    try {
        const data = req.body
        const informe = await serciosInforme.createIforme(data)
        if (!informe) {
            return res.status(500).send('Error interno del servidor');
        }
        res.status(200).json({mensage:"informe creado con exitosamente "})
    } catch (error) {
        console.log(error)
    }
}

exports.deleteInforme = async (req, res) => {
    try {
        const informeId = parseInt(req.params.id,10)
        const informe = await serciosInforme.deleteInforme(informeId)
        if (!informe) {
            return res.status(404).send('Informe no encontrado');
        }
        res.status(200).json({ message: "Informe eliminado con éxito." });
    } catch (error) {
        console.log(error)
    }
 
}
exports.updateInforme = async (req, res) => {
    try {
        const informeId = parseInt(req.params.id,10)
        const data = req.body
        const informe = await serciosInforme.updateInforme(informeId, data)
        if (!informe) {
            return res.status(404).send('Informe no encontrado');
        }
        res.status(200).json({ message: "Calendario actualizado exitosamente.", });
    } catch (error) {
        console.log(error)
    }
}

exports.searchInforme = async (req, res) => {
    const data = req.body.titulo
    console.log(typeof(data))
    const informes = await serciosInforme.searchInforme(data)
    if (!informes) {
        return res.status(404).send('No hay informes disponibles');
    }
    res.status(200).json(informes);
}
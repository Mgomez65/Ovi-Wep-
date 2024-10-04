const serciosInforme = require("../service/informe.service")
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PDFDocument = require('pdfkit');


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

// Generador de PDF
exports.downloadPDF = async (req, res) => {
    try {
        const { idInforme } = req.params; // Obtener el ID del informe desde los parámetros de la ruta
        const idInformeInt = parseInt(idInforme, 10); // Convertir el ID a entero
        console.log("controller id pdf: ", idInformeInt);

        // Obtener el informe de la base de datos
        const informe = await prisma.informe.findFirst({ // Cambiar para usar la consulta de Prisma
            where: {
                id: idInformeInt // Asegurarse de que aquí se pase el entero
            }
        });

        if (!informe) {
            return res.status(404).json({ message: `Informe con id ${idInformeInt} no encontrado.` });
        }

        // Crear un nuevo documento PDF
        const doc = new PDFDocument();
        let buffers = [];

        // Guardar el PDF en memoria
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            // Configurar la respuesta para que sea un archivo PDF descargable
            res.setHeader('Content-Disposition', `attachment; filename=informe_${idInformeInt}.pdf`);
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdfData);
        });

        // Cabecera del informe
        doc.fontSize(20).text(informe.titulo, { align: 'center' });
        doc.moveDown();
        
        // Contenido del informe
        doc.fontSize(12).text(`Fecha de inicio: ${informe.fecha_inicio.toDateString()}`, { align: 'left' });
        doc.fontSize(12).text(`Fecha final: ${informe.fecha_final.toDateString()}`, { align: 'left' });
        doc.moveDown();
        doc.text(informe.contenido, { align: 'left' });
        
        // Si tienes un link a una imagen y quieres incluirla
        if (informe.imagen_url) {
            doc.image(informe.imagen_url, { fit: [300, 300], align: 'center' });
        }

        // Finalizar el documento
        doc.end();

    } catch (error) {
        console.error("Error al descargar el PDF:", error);
        res.status(500).json({ message: "Error al generar el PDF" });
    }
};

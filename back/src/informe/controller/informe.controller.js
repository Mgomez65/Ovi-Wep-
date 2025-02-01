const serciosInforme = require("../service/informe.service")
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const PDFDocument = require('pdfkit');
const path = require('path');

const formateoFecha = (data)=>{
    fecha = new Date (data)
    dia = fecha.getDate().toString().padStart(2,"0");
    semana = (fecha.getMonth() + 1).toString().padStart(2,"0");
    año = fecha.getFullYear()
    return `${año}-${semana}-${dia}`
}
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
        res.status(200).json({ informe,message: "Informe encontrado con éxito." });
    } catch (error) {
        console.log(error)
    }
}
// controller/informe.controller.js
exports.createIforme = async (req, res) => {
    try {
        const data = req.body;
        data.fecha_inicio = formateoFecha(data.fecha_inicio)
        data.fecha_final = formateoFecha(data.fecha_final)
      
        // Procesar las imágenes
        if (req.files && req.files.length > 0) {
            data.imagen_urls = req.files.map(file => path.basename(file.path)); // Guardar solo los nombres de los archivos
        }
        const informe = await serciosInforme.createIforme(data);
        if (!informe) {
            return res.status(500).send('Error interno del servidor');
        }
        res.status(200).json({ mensaje: "Informe creado exitosamente" });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al crear el informe');
    }
};



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
        data.fecha_inicio = formateoFecha(data.fecha_inicio)
        data.fecha_final = formateoFecha(data.fecha_final)
     
        if (req.file) {
            data.imagen_url = path.basename(req.file.path); 
        }
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
    const data = req.body.searchTerm
    const informes = await serciosInforme.searchInforme(data)
    console.log(informes)
    if (!informes) {
        return res.status(404).send('No hay informes disponibles');
    }
    res.status(200).json(informes);
}

// Generador de PDF
exports.downloadPDF = async (req, res) => {
    try {
        const { idInforme } = req.params;
        const idInformeInt = parseInt(idInforme, 10); 

        // Obtener el informe de la base de datos
        const informe = await prisma.informe.findFirst({
            where: {
                id: idInformeInt
            }
        });

        if (!informe) {
            return res.status(404).json({ message: `Informe con id ${idInformeInt} no encontrado.` });
        }

        const doc = new PDFDocument();
        let buffers = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            const pdfData = Buffer.concat(buffers);
            const sanitizedTitle = informe.titulo;
            console.log("Título sanitizado:", sanitizedTitle);
            res.setHeader('Content-Disposition', `attachment; filename=${sanitizedTitle}.pdf`);
            res.setHeader('Content-Type', 'application/pdf');
            res.send(pdfData);
        });

        doc.fontSize(20).text(informe.titulo, { align: 'center' });
        doc.moveDown();

        doc.fontSize(12).text(`Fecha de inicio: ${informe.fecha_inicio.toDateString()}`, { align: 'left' });
        doc.fontSize(12).text(`Fecha final: ${informe.fecha_final.toDateString()}`, { align: 'left' });
        doc.moveDown();
        doc.text(informe.contenido, { align: 'left' });

        if (informe.imagen_url) {
            doc.image(informe.imagen_url, { fit: [300, 300], align: 'center' });
        }

        doc.end();

    } catch (error) {
        console.error("Error al descargar el PDF:", error);
        res.status(500).json({ message: "Error al generar el PDF" });
    }
};

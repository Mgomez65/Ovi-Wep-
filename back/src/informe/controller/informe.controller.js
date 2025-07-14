const informeService = require('../service/informe.service');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit'); // Asegúrate de tener 'pdfkit' instalado
const mime = require('mime-types'); // Asegúrate de tener 'mime-types' instalado

// Define la ruta absoluta para el directorio de subidas
// path.resolve() resuelve una secuencia de rutas o segmentos de ruta en una ruta absoluta.
// __dirname es el directorio del archivo actual (informe.controller.js)
// '../../public/imgIfome' sube dos niveles (de controller a informe, luego a src, luego a back)
// y luego entra en 'public/imgIfome'.
const UPLOADS_IMAGES_DIR = path.resolve(__dirname, '../../public/imgIfome');

console.log("__dirname en informe.controller.js:", __dirname);
console.log("UPLOADS_IMAGES_DIR resuelto:", UPLOADS_IMAGES_DIR);

// Configuración de Multer para el almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Multer: DESTINATION CALLBACK CALLED");
        console.log("Multer: Ruta de destino proporcionada a cb:", UPLOADS_IMAGES_DIR);

        // Asegura que el directorio de destino exista
        if (!fs.existsSync(UPLOADS_IMAGES_DIR)) {
            console.log("Multer: Creando directorio:", UPLOADS_IMAGES_DIR);
            fs.mkdirSync(UPLOADS_IMAGES_DIR, { recursive: true });
        }
        cb(null, UPLOADS_IMAGES_DIR); // Pasa el directorio de destino
    },
    filename: (req, file, cb) => {
        console.log("Multer: FILENAME CALLBACK CALLED");
        console.log("Multer: Original Filename:", file.originalname); // Log del nombre original

        // Genera un nombre de archivo único para evitar colisiones
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname || '').toLowerCase(); // Obtiene la extensión de forma segura
        
        // Sanitiza el nombre original para evitar problemas con caracteres de ruta
        const sanitizedOriginalname = file.originalname.replace(/[/\\]/g, '_'); // Reemplazar barras por guiones bajos

        const newFilename = `${file.fieldname}-${uniqueSuffix}-${sanitizedOriginalname}`;
        console.log("Multer: Nombre de archivo generado (newFilename):", newFilename);
        cb(null, newFilename); // Pasa solo el nombre del archivo
    }
});

// Filtro para aceptar solo archivos de imagen o PDF
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen o PDF!'), false);
    }
};

// Inicializa Multer con la configuración
const upload = multer({ storage: storage, fileFilter: fileFilter }).array('imagenes', 10);

exports.createIforme = (req, res) => {
    console.log("Controller: createIforme called, attempting file upload.");
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error("Error de Multer al crear informe (MulterError):", err);
            return res.status(500).json({ message: `Error al subir imágenes: ${err.message}` });
        } else if (err) {
            console.error("Error desconocido al subir archivos para crear informe:", err);
            if (err.code === 'ENOENT' && err.path) {
                console.error("Ruta problemática en ENOENT:", err.path);
            }
            return res.status(500).json({ message: `Error interno del servidor: ${err.message}` });
        }

        // Si Multer procesó los archivos, req.files debería estar poblado
        if (req.files && req.files.length > 0) {
            console.log("Archivos subidos por Multer (req.files):");
            req.files.forEach(file => {
                console.log(`  Originalname: ${file.originalname}, Filename: ${file.filename}, Path: ${file.path}`);
            });
        } else {
            console.log("No se subieron archivos o Multer no los procesó.");
        }

        try {
            const { titulo, contenido, fecha_inicio, fecha_final } = req.body;

            if (!titulo || !contenido || !fecha_inicio || !fecha_final) {
                return res.status(400).json({ message: "Por favor, completa todos los campos del formulario." });
            }

            const imagen_urls = req.files ? req.files.map(file => file.filename) : [];

            const valores = {
                titulo,
                contenido,
                fecha_inicio,
                fecha_final,
                imagen_urls,
            };

            const nuevoInforme = await informeService.createIforme(valores);
            res.status(201).json({ message: "Informe creado exitosamente", informe: nuevoInforme });
        } catch (error) {
            console.error("Error en el controlador al crear informe (después de Multer):", error);
            // Si hubo un error después de que Multer subió los archivos
            // (ej. error de Prisma), intenta eliminar los archivos subidos para limpiar.
            if (req.files) {
                req.files.forEach(file => {
                    console.log("Intentando eliminar archivo en caso de error:", file.path);
                    fs.unlink(file.path, (unlinkErr) => {
                        if (unlinkErr) console.error("Error al eliminar archivo subido tras fallo:", unlinkErr);
                    });
                });
            }
            res.status(500).json({ message: "Error al crear el informe", error: error.message });
        }
    });
};

exports.getInforme = async (req, res) => {
    try {
        const informes = await informeService.getInforme();
        res.status(200).json({ informes });
    } catch (error) {
        console.error("Error en el controlador al obtener informes:", error);
        res.status(500).json({ message: "Error al obtener los informes", error: error.message });
    }
};

exports.getInformeId = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        console.log("informe.controller.js: ID recibido en params para getInformeId (parseado):", id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID de informe inválido." });
        }

        const informe = await informeService.getInformeId(id);
        if (!informe) {
            return res.status(404).json({ message: "Informe no encontrado" });
        }
        res.status(200).json({ informe });
    } catch (error) {
        console.error("Error en el controlador al obtener informe por ID:", error);
        res.status(500).json({ message: "Error al obtener el informe por ID", error: error.message });
    }
};

exports.updateInforme = (req, res) => {
    upload(req, res, async (err) => {
        if (err instanceof multer.MulterError) {
            console.error("Error de Multer en update:", err);
            return res.status(500).json({ message: `Error al subir imágenes: ${err.message}` });
        } else if (err) {
            console.error("Error desconocido al subir archivos para actualizar informe:", err);
            return res.status(500).json({ message: `Error interno del servidor: ${err.message}` });
        }

        try {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                return res.status(400).json({ message: "ID de informe inválido para actualizar." });
            }

            const { titulo, contenido, fecha_inicio, fecha_final } = req.body;

            if (!fecha_inicio || !fecha_final) {
                return res.status(400).json({ message: "Las fechas de inicio y fin son obligatorias." });
            }

            const imagen_urls = req.files ? req.files.map(file => file.filename) : [];

            const valor = {
                titulo,
                contenido,
                fecha_inicio,
                fecha_final,
                imagen_urls,
            };

            const informeActualizado = await informeService.updateInforme(id, valor);
            res.status(200).json({ message: "Informe actualizado exitosamente", informe: informeActualizado });
        } catch (error) {
            console.error("Error en el controlador al actualizar informe:", error);
            if (req.files) {
                req.files.forEach(file => {
                    console.log("Intentando eliminar archivo en caso de error:", file.path);
                    fs.unlink(file.path, (unlinkErr) => {
                        if (unlinkErr) console.error("Error al eliminar archivo subido tras fallo:", unlinkErr);
                    });
                });
            }
            res.status(500).json({ message: "Error al actualizar el informe", error: error.message });
        }
    });
};

exports.deleteInforme = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({ message: "ID de informe inválido para eliminar." });
        }
        const result = await informeService.deleteInforme(id);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error en el controlador al eliminar informe:", error);
        res.status(500).json({ message: "Error al eliminar el informe", error: error.message });
    }
};

exports.searchInforme = async (req, res) => {
    try {
        const { termino } = req.query;
        const informes = await informeService.searchInforme(termino);
        res.status(200).json({ informes });
    } catch (error) {
        console.error("Error en el controlador al buscar informes:", error);
        res.status(500).json({ message: "Error al buscar informes", error: error.message });
    }
};

exports.descargarInforme = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        console.log("informe.controller.js: ID recibido para descargarInforme:", id);

        if (isNaN(id)) {
            return res.status(400).json({ message: "ID de informe inválido para descarga." });
        }

        const informe = await informeService.getInformeId(id);
        if (!informe) {
            return res.status(404).json({ message: "Informe no encontrado para descarga." });
        }

        const doc = new PDFDocument();
        const filename = `informe_${id}_${informe.titulo.replace(/\s/g, '_')}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        doc.pipe(res);

        doc.fontSize(24).text(informe.titulo, { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(12).text(`Fecha de inicio: ${new Date(informe.fecha_inicio).toLocaleDateString()}`);
        doc.text(`Fecha de finalización: ${new Date(informe.fecha_final).toLocaleDateString()}`);
        doc.moveDown();
        doc.fontSize(12).text(informe.contenido, { align: 'justify' });
        doc.moveDown();

        if (informe.imagenes && informe.imagenes.length > 0) {
            for (const img of informe.imagenes) {
                const imagePath = path.join(UPLOADS_IMAGES_DIR, img.url); // Usar UPLOADS_IMAGES_DIR
                console.log("informe.controller.js: Intentando incrustar imagen desde:", imagePath);

                if (fs.existsSync(imagePath)) {
                    if (doc.y + 200 > doc.page.height - doc.page.margins.bottom) {
                        doc.addPage();
                    }
                    
                    doc.image(imagePath, {
                        fit: [doc.page.width - doc.page.margins.left - doc.page.margins.right, 400],
                        align: 'center',
                        valign: 'center'
                    });
                    doc.moveDown();
                } else {
                    console.warn(`informe.controller.js: Archivo de imagen no encontrado para incrustar en PDF: ${imagePath}`);
                    doc.fontSize(10).fillColor('red').text(`[Imagen no encontrada: ${img.url}]`, { align: 'center' });
                    doc.fillColor('black');
                    doc.moveDown();
                }
            }
        } else {
            doc.fontSize(10).text("No hay imágenes adjuntas a este informe.", { align: 'center' });
            doc.moveDown();
        }

        doc.end();

    } catch (error) {
        console.error("Error en el controlador al generar y descargar el informe PDF:", error);
        res.status(500).json({ message: "Error del servidor al intentar generar el PDF del informe.", error: error.message });
    }
};

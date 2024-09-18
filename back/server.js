const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors');
const app = express()

const nodemailer = require('nodemailer');

app.use(express.urlencoded({extends:false}))
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: 'kennedi.ward@ethereal.email', // Usuario proporcionado por Ethereal
      pass: 'acT74Yegn2QUKYuyA5' // Contraseña proporcionada por Ethereal
    }
});
  
// Ruta para manejar el envío del formulario
app.post('/send-email', (req, res) => {
    const data = req.body;
  
    // Configura las opciones del correo
    const mailOptions = {
      from: '	kennedi.ward@ethereal.email', // La dirección del remitente
      to: data.correo, // La dirección del destinatario
      subject: 'Nuevo mensaje del formulario',
      text: `
        Nombre: ${data.nombre}
        Provincia: ${data.provincia}
        Empresa: ${data.empresa}
        Teléfono: ${data.telefono}
        Cargo: ${data.cargo}
        Correo: ${data.correo}
        Comentario: ${data.comentario}
      `
    };
  
    // Envía el correo
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar el correo:', error);
        return res.status(500).send('Error al enviar el correo: ' + error.toString());
      }
      res.status(200).send('Correo enviado');
    });
});


dotenv.config({path: './.env'})



app.use( '/api',require("./usuarios/rutas/rutas"))
app.use('/calendario',require('./clima/rutas/rutasCalendario'))

const conexion = require('./dataBase/DB')

app.listen(process.env.HOST_PUERTO,(req,res )=>{
    console.log(`Server is running on port ${process.env.HOST_PUERTO}`)
})




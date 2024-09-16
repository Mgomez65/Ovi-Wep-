const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors');
const app = express()

//Envio de Correo Electronico
const nodemailer = require('nodemailer');

app.use(express.urlencoded({extends:false}))
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));


dotenv.config({path: './.env'})

// Configura el transporte de correo
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'waltertrentacosta9@gmail.com',
      pass: '45142748WnT'
    }
});

// Ruta para manejar el envío del formulario
app.post('/send-email', (req, res) => {
    const data = req.body;
    console.log(data)
  
    const mailOptions = {
      from: 'waltertrentacosta9@gmail.com',
      to: 'waltertrentacosta8@gmail.com',
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
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error.toString());
      }
      res.status(200).send('Correo enviado');
    });
});

app.use( '/api',require("./usuarios/rutas/rutas"))
app.use('/calendario',require('./clima/rutas/rutasCalendario'))

const conexion = require('./dataBase/DB')

app.listen(process.env.HOST_PUERTO,(req,res )=>{
    console.log(`Server is running on port ${process.env.HOST_PUERTO}`)
})
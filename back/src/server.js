const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors');
const cookieParse = require('cookie-parser')

const app = express()

const nodemailer = require('nodemailer');


app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use(cookieParse())

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true 
}));


dotenv.config({path: './.env'})



app.use( '/api',require("./usuarios/usuario.routes"))
app.use('/calendario',require('./calendario/calendario.routes'))
app.use('/', require('./Auth/Auth.router'))
app.use('/informe',require('./informe/informe.routes'))




app.listen(process.env.HOST_PUERTO,(req,res )=>{
    console.log(`Server is running on port ${process.env.HOST_PUERTO}`)
})




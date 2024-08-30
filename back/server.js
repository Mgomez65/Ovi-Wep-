const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors');
const userController = require('./controllers/userController');

const app = express()

app.use(express.urlencoded({extends:false}))
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));


dotenv.config({path: './.env'})


app.post('/api/register', userController.register);
app.post('/api/login', userController.login);

app.use( '/api',require("./usuarios/rutas/rutas"))
app.use('/calendario',require('./clima/rutas/rutasCalendario'))

const conexion = require('./dataBase/DB')

app.listen(process.env.HOST_PUERTO,(req,res )=>{
    console.log(`Server is running on port ${process.env.HOST_PUERTO}`)
})
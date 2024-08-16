const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors');


const app = express()

app.use(express.urlencoded({extends:false}))
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));



dotenv.config({path: './.env'})

const puerto = process.env.HOST_PUERTO

app.use( '/',require("./rutas/rutas"))
const conexion = require('./dataBase/DB')

app.listen(puerto,(req,res )=>{
    console.log(`Server is running on port ${puerto}`)
})
const express = require('express')
const dotenv = require('dotenv')


dotenv.config({path: './.env'})

const app = express()
const puerto = process.env.HOST_PUERTO

app.use( '/',(requiere('./rutas/rutas')))


app.listen(puerto,(req,res )=>{
    console.log(`Server is running on port ${puerto}`)
})
const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors');
const cookieParser = require('cookie-parser')
const path = require('path'); // Importa el módulo 'path'

const estadisticasRoutes = require('./estadisticas/estadisticas.routes'); // Asegúrate de que esta ruta exista

const app = express()

const nodemailer = require('nodemailer');


// Cargar variables de entorno lo antes posible
dotenv.config({path: '../../.env'})

// Definir el puerto del servidor.
// Si process.env.HOST_PUERTO no está definido (ej. en desarrollo), usará 3001.
// Si está definido (ej. en producción), usará ese valor.
const PORT = process.env.HOST_PUERTO || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser())

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions));

// Middleware para servir archivos estáticos (donde se guardan las imágenes)
// Esto es CRUCIAL para que las imágenes subidas sean accesibles desde el frontend
// La carpeta 'public' debe estar al mismo nivel que 'src' en tu estructura 'back'
app.use(express.static(path.join(__dirname, '../public'))); // AÑADIDO: Para servir archivos estáticos

// Rutas
app.use( '/api',require("./usuarios/usuario.routes"))
app.use('/calendario',require('./calendario/calendario.routes'))
app.use('/', require('./Auth/Auth.router'))
app.use('/informe',require('./informe/informe.routes'))
//app.use('/api/estadisticas', estadisticasRoutes); 
// Usar la nueva ruta de estadísticas
app.use('/api', estadisticasRoutes);

// Nueva ruta para la humedad (si aún no la tienes o si quieres consolidarla)
// Si tu backend de humedad está en un archivo separado, asegúrate de importarlo aquí
// Por ejemplo:
//app.use('/api/humedad-actual', require('./humedad/humedad.routes')); // <--- AÑADE ESTO SI NO LO TIENES YA PARA LA API DE HUMEDAD


// El servidor escucha en el puerto definido
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

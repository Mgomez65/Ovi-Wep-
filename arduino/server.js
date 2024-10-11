const express = require('express'); 
const mysql = require('mysql2');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const port = 3001;

let ultimoDatoHumedad = null; // Variable para almacenar el último dato de humedad recibido

// Conexión a la base de datos MySQL (por si lo necesitas en el futuro)
/* const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'humedad_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
}); */

// Configuración del puerto serial
const serialPort = new SerialPort({ path: 'COM3', baudRate: 9600 }); // Cambia 'COM5' al puerto correcto
const parser = new ReadlineParser();
serialPort.pipe(parser);

// Leer los datos enviados por el Arduino
parser.on('data', (data) => {
  const humedad = parseFloat(data.trim());
  console.log(`Humedad recibida: ${humedad}`);
  
  // Actualizar la variable con el último dato de humedad
  return ultimoDatoHumedad = humedad;
});

// Middleware CORS para permitir el acceso desde el frontend
app.use(cors({ origin: 'http://localhost:5173' }));

// Ruta para enviar el último dato de humedad al frontend
app.get('/api/humedad-actual', (req, res) => {
  console.log(ultimoDatoHumedad)
  if (ultimoDatoHumedad !== null) {
    res.status(200).json({ humedad: ultimoDatoHumedad });
  } else {
    res.status(404).json({ mensaje: 'No hay datos de humedad disponibles todavía' });
  }
});

// API para obtener los datos de la base de datos (si lo necesitas)


app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

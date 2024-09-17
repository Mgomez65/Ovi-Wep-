const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const port = 3001;

// Conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'humedad_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Conectado a la base de datos MySQL');
});

// Configuración del puerto serial
const serialPort = new SerialPort({ path: 'COM5', baudRate: 9600 }); // Cambia 'COM5' al puerto correcto
const parser = new ReadlineParser();
serialPort.pipe(parser);

// Leer los datos enviados por el Arduino
parser.on('data', (data) => {
  const humedad = parseFloat(data.trim());
  console.log(`Humedad recibida: ${humedad}`);

  if (!isNaN(humedad)) {
    const query = 'INSERT INTO humedad (valor) VALUES (?)';
    connection.execute(query, [humedad], (err, result) => {
      if (err) {
        console.error('Error al insertar datos:', err);
      } else {
        console.log('Dato insertado correctamente');
      }
    });
  }
});

// API para obtener los datos de la base de datos
app.use(cors());

app.get('/api/humedad', (req, res) => {
  const query = 'SELECT * FROM humedad ORDER BY fecha DESC';
  connection.execute(query, (err, results) => {
    if (err) {
      console.error('Error al obtener datos', err);
      res.status(500).send('Error al obtener datos');
    } else {
      res.status(200).json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

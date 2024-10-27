const express = require('express');
const cors = require('cors');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');

const app = express();
const port = 3001;

let ultimoDatoHumedad1 = null; // Variable para el dato de humedad del primer Arduino
let ultimoDatoHumedad2 = null; // Variable para el dato de humedad del segundo Arduino

// Configuración del primer puerto serial (Arduino 1)
const serialPort1 = new SerialPort({ path: 'COM4', baudRate: 9600 }, (err) => {
  if (err) {
    console.error(`Error al abrir COM4: ${err.message}`);
  }
});
const parser1 = new ReadlineParser();
serialPort1.pipe(parser1);

// Configuración del segundo puerto serial (Arduino 2)
let serialPort2;
try {
  serialPort2 = new SerialPort({ path: 'COM3', baudRate: 9600 }, (err) => {
    if (err) {
      console.error(`Error al abrir COM5: ${err.message}`);
    }
  });
  const parser2 = new ReadlineParser();
  serialPort2.pipe(parser2);

  parser2.on('data', (data) => {
    const humedad = parseFloat(data.trim());
    console.log(`Humedad recibida del Arduino 2: ${humedad}`);
    ultimoDatoHumedad2 = humedad;
  });

  serialPort2.on('error', (err) => {
    console.error(`Error en el puerto serial de COM5: ${err.message}`);
  });
} catch (error) {
  console.error(`No se pudo conectar a COM5: ${error.message}`);
}

// Leer datos del primer Arduino
parser1.on('data', (data) => {
  const humedad = parseFloat(data.trim());
  console.log(`Humedad recibida del Arduino 1: ${humedad}`);
  ultimoDatoHumedad1 = humedad;
});

serialPort1.on('error', (err) => {
  console.error(`Error en el puerto serial de COM4: ${err.message}`);
});

// Middleware CORS para permitir el acceso desde el frontend
app.use(cors({ origin: 'http://localhost:5173' }));

// Ruta para enviar datos al frontend
app.get('/api/humedad-actual', (req, res) => {
  const respuesta = {
    humedad1: ultimoDatoHumedad1 !== null ? ultimoDatoHumedad1 : "No disponible",
    humedad2: ultimoDatoHumedad2 !== null ? ultimoDatoHumedad2 : "No disponible",
  };
  res.status(200).json(respuesta);
});

// Inicia el servidor en el puerto definido
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});

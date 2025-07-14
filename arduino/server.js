const mysql = require('mysql2/promise');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
const express = require('express');
const cors = require('cors');

// Configuración mejorada de la base de datos
let connection;

async function connectDB() {
    try {
        connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'humedad_db',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        console.log('✅ Conexión a MySQL establecida');
        return true;
    } catch (err) {
        console.error('❌ Error al conectar a MySQL:', err.message);
        // Agrega una reconexión inmediata si falla la conexión inicial
        setTimeout(connectDB, 5000); 
        return false;
    }
}

// Manejo de reconexión automática
setInterval(async () => {
    if (!connection || connection.connection._closing) {
        console.log('🔄 Intentando reconectar a la base de datos...');
        await connectDB();
    }
}, 5000);

// 🎛️ Configuración del puerto serie para ARDUINO 1 (ej. COM9)
const portArduino1 = new SerialPort({ path: 'COM9', baudRate: 9600 });
const parserArduino1 = portArduino1.pipe(new ReadlineParser({ delimiter: '\r\n' }));

portArduino1.on('error', (err) => {
    console.error('❌ Error en el puerto serie de Arduino 1:', err.message);
});

parserArduino1.on('data', async (line) => {
    const humedad = parseFloat(line.trim());
    const idArduino = 'arduino1';

    if (isNaN(humedad)) {
        console.warn(`⚠️ Dato recibido de ${idArduino} no es un número válido:`, line);
        return;
    }

    console.log(`🌱 Humedad recibida de ${idArduino}:`, humedad);

    try {
        // Verificar estado de la conexión antes de intentar insertar
        if (!connection || connection.connection._closing) {
            console.log('🟡 Conexión a DB no activa al intentar insertar. Intentando reconectar...');
            const connected = await connectDB();
            if (!connected) {
                console.error('🔴 No se pudo establecer conexión a la DB para insertar datos. Abortando inserción.');
                return;
            }
            console.log('🟢 Conexión a DB restablecida.');
        }

        // Ejecutar la inserción
        const [result] = await connection.execute(
            'INSERT INTO humedad (valor, fecha, id_arduino) VALUES (?, NOW(), ?)',
            [humedad, idArduino]
        );
        console.log(`✅ Humedad de ${idArduino} insertada en la base de datos. ID insertado: ${result.insertId}`);
    } catch (err) {
        console.error(`❌ Error al insertar humedad de ${idArduino}:`, err.message);
        // Si el error es de conexión, intentar reconectar
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNREFUSED' || err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('Intentando reconectar a la base de datos debido a un error de inserción relacionado con la conexión.');
            await connectDB();
        } else {
            // Para otros errores no relacionados con la conexión, mostrar el error completo
            console.error('Detalles del error de inserción:', err);
        }
    }
});

// --- Variables y función para simular datos de humedad ---
let simulatedHumedad2 = 50; // Valor inicial para la simulación de Zona 2
let simulatedHumedad3 = 40; // Valor inicial para la simulación de Zona 3
const simulationStep = 5; // Paso de cambio en la simulación
const minHumidity = 20;
const maxHumidity = 90;

function getNextSimulatedHumidity(currentValue) {
    let newValue = currentValue + (Math.random() > 0.5 ? simulationStep : -simulationStep);
    if (newValue < minHumidity) newValue = minHumidity;
    if (newValue > maxHumidity) newValue = maxHumidity;
    return newValue;
}

// --- Actualización de simulación cada 20 segundos ---
setInterval(() => {
    simulatedHumedad2 = getNextSimulatedHumidity(simulatedHumedad2);
    simulatedHumedad3 = getNextSimulatedHumidity(simulatedHumedad3);
    console.log(`Simulación: Humedad2=${Math.round(simulatedHumedad2)}%, Humedad3=${Math.round(simulatedHumedad3)}%`);
}, 20000); // Actualizar cada 20 segundos (20000 ms)
// --------------------------------------------------------

// 🌐 Configuración del servidor Express
const app = express();
const PORT = 3001;

app.use(cors({
    origin: 'http://localhost:5173'
}));

// ✨ RUTA para obtener la humedad actual (puede ser de un Arduino específico o un promedio)
app.get('/api/humedad-actual', async (req, res) => {
    let humedadData = {
        humedad1: "No disponible",
        humedad2: "No disponible",
        humedad3: "No disponible"
    };

    try {
        if (!connection || connection.connection._closing) {
            const connected = await connectDB();
            if (!connected) {
                console.error('No hay conexión a DB para obtener humedad actual.');
                return res.status(500).json({ error: 'No hay conexión a la base de datos.' });
            }
        }
        
        // Consulta para obtener la última lectura de cada Arduino
        const [rows] = await connection.execute(
            `SELECT t1.valor, t1.id_arduino
             FROM humedad t1
             INNER JOIN (
                 SELECT id_arduino, MAX(fecha) AS max_fecha
                 FROM humedad
                 GROUP BY id_arduino
             ) t2 ON t1.id_arduino = t2.id_arduino AND t1.fecha = t2.max_fecha`
        );

        // Asignar valores de la base de datos si están disponibles
        rows.forEach(row => {
            if (row.id_arduino === 'arduino1') {
                humedadData.humedad1 = row.valor.toString();
            } else if (row.id_arduino === 'arduino2') {
                humedadData.humedad2 = row.valor.toString();
            }
            // Si tuvieras un arduino3 real, lo manejarías aquí
            // else if (row.id_arduino === 'arduino3') {
            //     humedadData.humedad3 = row.valor.toString();
            // }
        });

        // Aplicar simulación si no hay datos reales de la base de datos para humedad2 y humedad3
        // Ahora, estos valores se actualizan en el setInterval de 20s
        if (humedadData.humedad2 === "No disponible") {
            humedadData.humedad2 = Math.round(simulatedHumedad2).toString();
        }
        if (humedadData.humedad3 === "No disponible") {
            humedadData.humedad3 = Math.round(simulatedHumedad3).toString();
        }

        res.json(humedadData);

    } catch (error) {
        console.error('Error al obtener humedad actual desde DB:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener humedad actual.' });
    }
});


// ✨ RUTA para obtener los datos de humedad (con posibilidad de filtrar por Arduino)
app.get('/api/humedad', async (req, res) => {
    const { arduino } = req.query;
    let query = 'SELECT id, valor, fecha, id_arduino FROM humedad';
    let params = [];

    if (arduino) {
        query += ' WHERE id_arduino = ?';
        params.push(arduino);
    }
    query += ' ORDER BY fecha DESC LIMIT 10';

    try {
        if (!connection || connection.connection._closing) {
            const connected = await connectDB();
            if (!connected) {
                console.error('No hay conexión a DB para obtener datos de humedad para la lista.');
                return res.status(500).json({ error: 'No hay conexión a la base de datos.' });
            }
        }
        const [rows] = await connection.execute(query, params);
        res.json(rows);

    } catch (error) {
        console.error('Error al obtener datos de humedad desde DB:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener datos de humedad.' });
    }
});

// Ruta que ya tenías
app.get('/', (req, res) => {
    res.send('Servidor OVI corriendo');
});

// Iniciar todo
(async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
})();

const mysql = require('mysql2/promise');


const conexion = mysql.createPool({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    password : process.env.DB_PASS,
    database : process.env.DB_DATABASE,
})
// Verifica la conexión
const testConnection = async () => {
    try {
        console.log('¡Conectado a la base de datos MySQL!');
    } catch (error) {
        console.error('El error de conexión es: ', error);
    }
};

testConnection();

module.exports = conexion
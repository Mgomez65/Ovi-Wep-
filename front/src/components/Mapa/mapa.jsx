import React, { useState, useEffect } from 'react';
import './mapa.css';

const Mapa = () => {
    const [humidity1, setHumidity1] = useState(null);
    const [humidity2, setHumidity2] = useState(null);
    const [humidity3, setHumidity3] = useState(null); // Inicializar a null para que se cargue del backend
    const enviarMensaje = async (zona, valor) => {
        try {
            await fetch('http://localhost:7000/whatsapp/groups/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: `⚠️ La humedad en ${zona} es muy baja: ${valor}% se va activar el riego automático.`
                })
            });
            console.log(`Mensaje enviado para ${zona}`);
        } catch (error) {
            console.error('Error al enviar mensaje:', error);
        }
    };
    useEffect(() => {
        const fetchHumidityData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/humedad-actual');
                const data = await response.json();
                
                // Actualizar los estados con los datos del backend
                const h1 = data.humedad1 !== "No disponible" ? parseInt(data.humedad1) : null;
                const h2 = data.humedad2 !== "No disponible" ? parseInt(data.humedad2) : null;
                const h3 = data.humedad3 !== "No disponible" ? parseInt(data.humedad3) : null;

                setHumidity1(h1);
                setHumidity2(h2);
                setHumidity3(h3);

                // Chequear si es menor al 10% y enviar mensaje
                if (h1 !== null && h1 < 10) enviarMensaje('Zona 1', h1);
                if (h2 !== null && h2 < 10) enviarMensaje('Zona 2', h2);
                if (h3 !== null && h3 < 10) enviarMensaje('Zona 3', h3);
            
            
            } catch (error) {
                console.error('Error al obtener los datos de humedad:', error);
                // Opcional: Establecer humedades a null o 0 en caso de error para indicar que no hay datos
                setHumidity1(null);
                setHumidity2(null);
                setHumidity3(null);
            }
        };

        // Iniciar la obtención de datos cada 500ms
        const interval = setInterval(fetchHumidityData, 500);
        
        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(interval);
    }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar

    // Modificamos esta función para que devuelva un objeto con backgroundColor y textColor
    const getColorAndTextColorByHumidity = (humidity) => {
        let backgroundColor;
        let textColor = '#333'; // Color de texto oscuro por defecto

        if (humidity === null) {
            backgroundColor = '#ccc'; // Gris claro para "No disponible"
            textColor = '#333'; // Texto oscuro para fondo gris claro
        } else if (humidity < 30) {
            backgroundColor = '#ff0000'; // Rojo
            textColor = 'white'; // Texto blanco para fondo rojo
        } else if (humidity < 60) {
            backgroundColor = '#ffff00'; // Amarillo
            textColor = '#333'; // Texto oscuro para fondo amarillo
        } else { // humidity >= 60
            backgroundColor = '#00ff00'; // Verde
            textColor = '#333'; // Texto oscuro para fondo verde
        }
        return { backgroundColor, textColor };
    };

    return (
        <div className="vineyard-map">
            <div className='mapaCont'>
                <h1>Mapa Interactivo del Viñedo</h1>
                <div className="map">
                    <div
                        className="area area1"
                        style={{ 
                            backgroundColor: getColorAndTextColorByHumidity(humidity1).backgroundColor,
                            color: getColorAndTextColorByHumidity(humidity1).textColor
                        }}
                    >
                        <span className='area-label'>Zona 1</span>
                    </div>
                    <div
                        className="area area2"
                        style={{ 
                            backgroundColor: getColorAndTextColorByHumidity(humidity2).backgroundColor,
                            color: getColorAndTextColorByHumidity(humidity2).textColor
                        }}
                    >
                        <span className='area-label'>Zona 2</span>
                    </div>
                    <div
                        className="area area3"
                        style={{ 
                            backgroundColor: getColorAndTextColorByHumidity(humidity3).backgroundColor,
                            color: getColorAndTextColorByHumidity(humidity3).textColor
                        }}
                    >
                        <span className='area-label'>Zona 3</span>
                    </div>
                </div>
            </div>
            <div className="info">
                <h2>Información de Zona 1:</h2>
                <div className="thermometer1">
                    <div
                        className="thermometer1-fill"
                        style={{ width: `${humidity1 !== null ? humidity1 : 0}%` }}
                    />
                    <div className="thermometer1-label">{humidity1 !== null ? `${humidity1}%` : `0%`}</div>
                </div>
                <h2>Información de Zona 2:</h2>
                <div className="thermometer1">
                    <div
                        className="thermometer1-fill"
                        style={{ width: `${humidity2 !== null ? humidity2 : 0}%` }}
                    />
                    <div className="thermometer1-label">{humidity2 !== null ? `${humidity2}%` : `0%`}</div>
                </div>
                <h2>Información de Zona 3:</h2>
                <div className="thermometer1">
                    <div
                        className="thermometer1-fill"
                        style={{ width: `${humidity3 !== null ? humidity3 : 0}%` }}
                    />
                    <div className="thermometer1-label">{humidity3 !== null ? `${humidity3}%` : `0%`}</div>
                </div>
            </div>
        </div>
    );
};

export default Mapa;

import React, { useState, useEffect } from 'react';
import './mapa.css';

const Mapa = () => {
    const [humidity1, setHumidity1] = useState(null);
    const [humidity2, setHumidity2] = useState(null);
    const [humidity3, setHumidity3] = useState(34);

    useEffect(() => {
        const fetchHumidityData = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/humedad-actual');
                const data = await response.json();
                setHumidity1(data.humedad1 !== "No disponible" ? data.humedad1 : null); 
                setHumidity2(data.humedad2 !== "No disponible" ? data.humedad2 : null); 
                /* setHumidity1(77); */
                /* setHumidity2(75);  */
            } catch (error) {
                console.error('Error al obtener los datos de humedad:', error);
            }
        };

        const interval = setInterval(fetchHumidityData, 500);
        return () => clearInterval(interval);
    }, []);

    const getColorByHumidity = (humidity) => {
        if (humidity === null) return '#ccc';
        if (humidity < 30) return '#ff0000';
        if (humidity < 60) return '#ffff00';
        return '#00ff00';
    };

    return (
        <div className="vineyard-map">
            <div className='mapaCont'>
                <h1>Mapa Interactivo del Viñedo</h1>
                <div className="map">
                    <div className="area-border area1-border"></div>
                    <div
                        className="area area1"
                        style={{ backgroundColor: getColorByHumidity(humidity1) }}
                    >
                        Zona 1
                    </div>
                    <div
                        className="area area2"
                        style={{ backgroundColor: getColorByHumidity(humidity2) }}
                    >
                        Zona 2
                    </div>
                    <div
                        className="area area3"
                        style={{ backgroundColor: getColorByHumidity(humidity3) }}
                    >
                        Zona 3
                    </div>
                </div>
            </div>
            <div className="info">
                <h2>Información de Zona 1:</h2>
                <div className="thermometer1">
                    <div
                        className="thermometer1-fill"
                        style={{ width: `${humidity1 ? humidity1 : 0}%` }}
                    />
                    <div className="thermometer1-label">{humidity1 !== null ? `${humidity1}%` : `${0}%`}</div>
                </div>
                <h2>Información de Zona 2:</h2>
                <div className="thermometer1">
                    <div
                        className="thermometer1-fill"
                        style={{ width: `${humidity2 ? humidity2 : 0}%` }}
                    />
                    <div className="thermometer1-label">{humidity2 !== null ? `${humidity2}%` : `${0}%`}</div>
                </div>
                <h2>Información de Zona 3:</h2>
                <div className="thermometer1">
                    <div
                        className="thermometer1-fill"
                        style={{ width: `${humidity3}%` }}
                    />
                    <div className="thermometer1-label">{humidity3}%</div>
                </div>
            </div>
        </div>
    );
};

export default Mapa;

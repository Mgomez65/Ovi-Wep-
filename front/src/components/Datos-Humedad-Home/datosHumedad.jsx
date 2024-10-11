import React, { useEffect, useState } from 'react';
import './datosHumedad.css';

const Termometro = () => {
    const [humidity, setHumidity] = useState(0);

    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:3001/api/humedad-actual", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
            }})
            const data = await response.json();
            setHumidity(data.humedad)
        }catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            fetchData();
        }, 500);
        return () => clearInterval(interval);
    }, []);

    /* useEffect(() => {
        const fetchData = () => {
            setTimeout(() => {
                const simulatedHumidity = 80;
                setHumidity(simulatedHumidity);
            }, 1000);
        };
        fetchData();
    }, []); */

    return (
        <div>
            <div className="thermometer">
                <div
                    className="thermometer-fill"
                    style={{ width: `${humidity}%` }}
                />
                <div className="thermometer-label">{humidity}%</div>
            </div>
        </div>
    );
};

export default Termometro;

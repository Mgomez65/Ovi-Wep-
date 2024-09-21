import React, { useEffect, useState } from 'react';
import '../styles/datosHumedad.css';

const Termometro = () => {
    const [humidity, setHumidity] = useState(0);

    /* useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('URL_DE_TU_API');
                const data = await response.json();
                setHumidity(data.humidity);
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchData();
    }, []); */

    useEffect(() => {
        const fetchData = () => {
            setTimeout(() => {
                const simulatedHumidity = 45;
                setHumidity(simulatedHumidity);
            }, 1000);
        };

        fetchData();
    }, []);

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

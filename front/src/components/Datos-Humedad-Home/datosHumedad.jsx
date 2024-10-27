/* useEffect(() => {
        const fetchData = () => {
            setTimeout(() => {
                const simulatedHumidity = 64;
                setHumidity(simulatedHumidity);
            }, 1000);
        };
        fetchData();
    }, []); */

import React, { useEffect, useState } from "react";
import "./datosHumedad.css";

const Termometro = () => {
  const [humidity, setHumidity] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/humedad-actual", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      const hum1 = data.humedad1 !== "No disponible" ? parseInt(data.humedad1) : null;
      /* const hum2 = data.humedad2 !== "No disponible" ? parseInt(data.humedad2) : null; */
      /* const hum3 = data.humedad3 !== "No disponible" ? parseInt(data.humedad3) : null; */
      const hum2 = 75;
      const hum3 = 59;

      // Calcular el promedio de los valores disponibles
      const humidityValues = [hum1, hum2, hum3].filter((val) => val !== null);
      const averageHumidity = 
        humidityValues.length > 0 
          ? humidityValues.reduce((acc, val) => acc + val, 0) / humidityValues.length 
          : 0;

      setHumidity(Math.round(averageHumidity));
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="thermometer">
        <div className="thermometer-fill" style={{ width: `${humidity}%` }} />
        <div className="thermometer-label">
          {humidity !== 0 ? Math.round(humidity) : 0}%
        </div>
      </div>
    </div>
  );
};

export default Termometro;

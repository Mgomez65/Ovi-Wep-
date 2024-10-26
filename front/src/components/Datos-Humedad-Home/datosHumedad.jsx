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
      const hum2 = 25;

      if (hum1 !== null && hum2 !== null) {
        const averageHumidity = (hum1 + hum2) / 2;
        setHumidity(Math.round(averageHumidity));
      } else if (hum1 !== null) {
        setHumidity(Math.round(hum1));
      } else if (hum2 !== null) {
        setHumidity(Math.round(hum2));
      } else {
        setHumidity(0);
      }
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

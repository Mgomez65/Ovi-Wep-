import { useEffect, useState } from "react";
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

      // Parsear los valores de humedad, asegurándose de que sean números o null
      const hum1 = data.humedad1 !== "No disponible" ? parseInt(data.humedad1) : null;
      const hum2 = data.humedad2 !== "No disponible" ? parseInt(data.humedad2) : null;
      const hum3 = data.humedad3 !== "No disponible" ? parseInt(data.humedad3) : null;

      // Filtrar los valores nulos y calcular el promedio solo con los disponibles
      const humidityValues = [hum1, hum2, hum3].filter((val) => val !== null);
      
      const averageHumidity = 
        humidityValues.length > 0 
          ? humidityValues.reduce((acc, val) => acc + val, 0) / humidityValues.length 
          : 0; // Si no hay valores, el promedio es 0

      setHumidity(Math.round(averageHumidity)); // Redondear el promedio
    } catch (error) {
      console.error("Error al obtener datos de humedad general:", error);
      setHumidity(0); // Establecer a 0 en caso de error
    }
  };

  useEffect(() => {
    // Iniciar la obtención de datos cada 500ms
    const interval = setInterval(() => {
      fetchData();
    }, 500);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar

  return (
    <div>
      <div className="thermometer">
        <div 
          className="thermometer-fill" 
          style={{ width: `${humidity}%` }}
        ></div>
        <div className="thermometer-label">{humidity}%</div>
      </div>
    </div>
  );
};

export default Termometro;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSun, FaCloudSun, FaCloud, FaCloudShowersHeavy, FaSnowflake } from 'react-icons/fa';
import "../styles/clima.css";
import ConfirmacionTemporal from "./notificacionTemporal";// Asegúrate de importar el componente

const getWeatherIcon = (description) => {
  if (description.includes('clear')) return <FaSun />;
  if (description.includes('cloud')) return <FaCloud />;
  if (description.includes('showers')) return <FaCloudShowersHeavy />;
  if (description.includes('snow')) return <FaSnowflake />;
  return <FaCloudSun />; // Por defecto, si no coincide con los anteriores
};

const requestNotificationPermission = async () => {
  if (Notification.permission !== "granted") {
    const permission = await Notification.requestPermission();
    console.log("Permiso de notificación:", permission);
  } else {
    console.log("Notificación ya está permitida");
  }
};

const showNotification = (title, body) => {
  if (Notification.permission === "granted") {
    new Notification(title, {
      body,
      icon: 'https://example.com/icon.png',
    });
  }
};

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [shouldReload, setShouldReload] = useState(false); // Estado para controlar el refresco
  /* const apiKey = "c5dd700cd5ba4428a3967e62c1bbca6a"; //cuenta de Walter, 50 diaria */
  const apiKey = "ffd6509ce75946179e316090d52a5ee0"; //cuenta de Walter, 1500 diaria hasta el 24 de octubre de 2024
  const url = `https://api.weatherbit.io/v2.0/current?city=Mendoza&key=${apiKey}&lang=es`;

  useEffect(() => {
    requestNotificationPermission();

    const fetchWeather = async () => {
      try {
        const response = await axios.get(url);
        const weatherData = response.data;
        setWeather(weatherData);
        setError(null);

        const precipProbability = weatherData.data[0].precip;

        if (precipProbability > 80) {
          showNotification(
            "¡Aviso de Lluvia!",
            `Se espera lluvia con una probabilidad de ${precipProbability}%`
          );
          setShowConfirmation(true); // Muestra la confirmación
          setShouldReload(false); // Controla si debe refrescar
        }
      } catch (err) {
        console.error(err);
        setError("Error al obtener datos del clima");
      }
    };

    fetchWeather();
  }, [url]);

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="weather-container">
      {weather ? (
        <div className="weather-info">
          <div className="weather-row">
            <div className="temperature-container">
              <span className="temperature">{weather.data[0].temp}°C</span>
              <span className="icon">
                {getWeatherIcon(weather.data[0].weather.description)}
              </span>
            </div>
          </div>
          <div className="weather-details">
            <div className="weather-list">
              <ul>
                <li className="weather-item">
                  <strong>Humedad:</strong> {weather.data[0].rh}%
                </li>
                <li className="weather-item">
                  <strong>Velocidad del Viento:</strong>{" "}
                  {weather.data[0].wind_spd} km/h
                </li>
                <li className="weather-item">
                  <strong>Probabilidad de Precipitaciones:</strong>{" "}
                  {weather.data[0].precip}%
                </li>
              </ul>
            </div>
          </div>
          {showConfirmation && (
            <ConfirmacionTemporal
              mensaje="Se espera lluvia"
              onClose={handleCloseConfirmation}
              shouldReload={shouldReload} // Pasar la prop para controlar el refresco
            />
          )}
        </div>
      ) : (
        <div className="loading-container">
          <span>Cargando...</span>
        </div>
      )}
    </div>
  );
};

export default Weather;

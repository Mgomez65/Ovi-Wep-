import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSun, FaCloudSun, FaCloud, FaCloudShowersHeavy, FaSnowflake } from 'react-icons/fa';
import "../styles/clima.css";

// Función para obtener el ícono basado en la descripción del estado del cielo
const getWeatherIcon = (description) => {
  if (description.includes('clear')) return <FaSun />;
  if (description.includes('cloud')) return <FaCloud />;
  if (description.includes('showers')) return <FaCloudShowersHeavy />;
  if (description.includes('snow')) return <FaSnowflake />;
  return <FaCloudSun />; // Por defecto, si no coincide con los anteriores
};

const requestNotificationPermission = async () => {
  if (Notification.permission !== "granted") {
    await Notification.requestPermission();
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
  const apiKey = "2ebcb82225b04302b88041a7691f2c6e";
  const url = `https://api.weatherbit.io/v2.0/current?city=Mendoza&key=${apiKey}&lang=es`;

  useEffect(() => {
    // Solicitar permiso para notificaciones al cargar el componente
    requestNotificationPermission();

    const fetchWeather = async () => {
      try {
        const response = await axios.get(url);
        const weatherData = response.data;
        setWeather(weatherData);
        setError(null);

        // Verificar si hay probabilidad de lluvia y enviar notificación si es necesario
        const precipProbability = weatherData.data[0].precip;
        if (precipProbability > 0) {
          showNotification(
            "¡Aviso de Lluvia!",
            `Se espera lluvia con una probabilidad de ${precipProbability}%`
          );
        }
      } catch (err) {
        console.error(err);
        setError("Error al obtener datos del clima");
      }
    };

    fetchWeather();
  }, [url]);

  const getPrecipitationIcon = (precip, precipProb) => {
    if (precip > 0) {
      return <FaCloudShowersHeavy />;
    } else if (precipProb > 0) {
      return <FaCloudRain />;
    } else {
      return <FaSun />;
    }
  };

  return (
    <div className="weather-container">
      {error && <p className="error-message">{error}</p>}
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
                  {weather.data[0].precip }%
                </li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
};

export default Weather;

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSun,
  FaCloudSun,
  FaCloud,
  FaCloudShowersHeavy,
  FaSnowflake,
  FaCloudRain,
} from "react-icons/fa";
import "./clima.css";
import ConfirmacionTemporal from "../Notificacion/notificacionTemporal";

const getWeatherIcon = (description) => {
  if (description.includes("clear") || description.includes("sol")) return <FaSun />;
  if (description.includes("cloud") || description.includes("nube")) return <FaCloud />;
  if (description.includes("showers") || description.includes("lluvia")) return <FaCloudShowersHeavy />;
  if (description.includes("snow") || description.includes("nieve")) return <FaSnowflake />;
  if (description.includes("rain") || description.includes("llovizna")) return <FaCloudRain />;
  return <FaCloudSun />;
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
      icon: "https://ejemplo.com/icono.png", // Reemplaza con la URL de tu icono
    });
  }
};

const Clima = () => {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForecastModal, setShowForecastModal] = useState(false);
  const [notification, setNotification] = useState({ message: '', visible: false, isError: false });

  const fetchWeatherData = async (latitude, longitude) => {
    try {
      setLoading(true);
      setError(null);
      const apiKey = "c2e5550a112741d48c96c21e5c5c8e31"; // Reemplaza con tu API Key de Weatherbit
      const currentWeatherUrl = `https://api.weatherbit.io/v2.0/current?lat=${latitude}&lon=${longitude}&key=${apiKey}&lang=es`;
      const forecastUrl = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&key=${apiKey}&lang=es`;

      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(currentWeatherUrl),
        axios.get(forecastUrl),
      ]);

      setWeather(currentResponse.data.data[0]);
      setForecast(forecastResponse.data);

      // Lógica para notificaciones de temperatura (ejemplo)
      if (currentResponse.data.data[0].temp > 30) {
        setNotification({
          message: '¡Advertencia! La temperatura actual es alta.',
          visible: true,
          isError: false
        });
        showNotification("Alerta de Temperatura", "La temperatura actual es alta.");
      } else {
        setNotification({ message: '', visible: false, isError: false });
      }

    } catch (err) {
      console.error("Error al obtener datos del clima:", err);
      setError("No se pudieron cargar los datos del clima.");
      setNotification({
        message: 'Error al cargar los datos del clima.',
        visible: true,
        isError: true
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    requestNotificationPermission();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (err) => {
          console.error("Error al obtener la ubicación:", err);
          setError("Permiso de ubicación denegado. No se puede obtener el clima actual.");
          setLoading(false);
          setNotification({
            message: 'Ubicación denegada. No se puede obtener el clima.',
            visible: true,
            isError: true
          });
          // Si la ubicación es denegada, puedes intentar con una ubicación por defecto
          // fetchWeatherData(LATITUD_POR_DEFECTO, LONGITUD_POR_DEFECTO);
        }
      );
    } else {
      setError("Geolocalización no es soportada por este navegador.");
      setLoading(false);
      setNotification({
        message: 'Geolocalización no soportada.',
        visible: true,
        isError: true
      });
    }
  }, []);

  const toggleForecastModal = () => {
    setShowForecastModal(!showForecastModal);
  };

  return (
    <div className="weather-container">
      {notification.visible && (
        <ConfirmacionTemporal
          message={notification.message}
          isError={notification.isError}
          onClose={() => setNotification({ ...notification, visible: false })}
        />
      )}

      {loading && (
        <div className="loading-container">
          <span>Cargando datos del clima...</span>
          {error && <p className="error-message">{error}</p>}
        </div>
      )}

      {!loading && weather && (
        <div className="weather-info">
          <h2>Clima Actual en {weather.city_name}</h2>
          <div className="weather-row">
            <div className="temperature-container">
              <span className="temperature">{weather.temp}°C</span>
              <span className="icon">{getWeatherIcon(weather.weather.description)}</span>
            </div>
            <div className="weather-details">
              <ul>
                <li className="weather-item">Descripción: {weather.weather.description}</li>
                <li className="weather-item">Sensación Térmica: {weather.app_temp}°C</li>
                <li className="weather-item">Humedad: {weather.rh}%</li>
                <li className="weather-item">Viento: {weather.wind_spd} m/s</li>
              </ul>
            </div>
          </div>
          <button onClick={toggleForecastModal} className="show-forecast-button">
            Ver Pronóstico 5 Días
          </button>
        </div>
      )}

      {!loading && !weather && !error && (
        <div className="loading-container">
          <span>Cargando pronóstico...</span>
          {error && <p className="error-message">{error}</p>}
        </div>
      )}

      {/* Modal de Pronóstico */}
      {showForecastModal && (
        <div className={`forecast-modal-overlay ${showForecastModal ? 'visible' : 'hidden'}`}>
          <div className="forecast-modal-content">
            <button onClick={toggleForecastModal} className="hide-forecast-button">
              Ocultar
            </button>
            <h3 className="forecast-title">Pronóstico 5 Días</h3>
            <div className="daily-forecast-list">
              {forecast && forecast.data && forecast.data.slice(0, 5).map((day, index) => (
                <div key={index} className="daily-forecast-item">
                  <p className="forecast-date">
                    {new Date(day.datetime).toLocaleDateString('es', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                  <div className="forecast-icon">
                    {getWeatherIcon(day.weather.description)}
                  </div>
                  <p className="forecast-temp">
                    {day.max_temp}°C / {day.min_temp}°C
                  </p>
                  <p className="forecast-description">
                    {day.weather.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clima;
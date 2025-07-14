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
      icon: "https://example.com/icon.png",
    });
  }
};

const Weather = () => {
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [shouldReload, setShouldReload] = useState(false);
  const [showForecastModal, setShowForecastModal] = useState(false); // Nuevo estado para el modal
  const apiKey = "3326727ab6044895a974dd901d838349";
  const url = `https://api.weatherbit.io/v2.0/forecast/daily?city=Mendoza&key=${apiKey}&lang=es&days=5`;

  useEffect(() => {
    requestNotificationPermission();

    const fetchWeatherForecast = async () => {
      try {
        const response = await axios.get(url);
        const forecastData = response.data;
        setForecast(forecastData);
        setError(null);

        if (forecastData.data && forecastData.data.length > 0) {
          const todayForecast = forecastData.data[0];
          const precipProbability = todayForecast.pop;

          if (precipProbability > 80) {
            showNotification(
              "¡Aviso de Lluvia!",
              `Se espera lluvia hoy con una probabilidad de ${precipProbability}%`
            );
            setShowConfirmation(true);
            setShouldReload(false);
          }
        }
      } catch (err) {
        console.error("Error al obtener datos del pronóstico:", err);
        setError("Error al obtener datos del pronóstico del clima");
      }
    };

    fetchWeatherForecast();
  }, [url]);

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const toggleForecastModal = () => {
    setShowForecastModal(prevState => !prevState);
  };

  return (
    <div className="weather-container">
      {forecast && forecast.data && forecast.data.length > 0 ? (
        <div className="weather-info">
          {/* Pronóstico del día actual */}
          <div className="weather-row current-day-forecast">
            <div className="temperature-container">
              <span className="temperature">{forecast.data[0].temp}°C</span>
              <span className="icon">
                {getWeatherIcon(forecast.data[0].weather.description)}
              </span>
            </div>
            <div className="weather-details">
              <ul>
                <li className="weather-item">
                  <strong>Humedad:</strong> {forecast.data[0].rh}%
                </li>
                <li className="weather-item">
                  <strong>Viento:</strong> {forecast.data[0].wind_spd} km/h
                </li>
                <li className="weather-item">
                  <strong>Precip.:</strong> {forecast.data[0].pop}%
                </li>
              </ul>
            </div>
          </div>

          {/* Botón para abrir el modal del pronóstico */}
          <button onClick={toggleForecastModal} className="forecast-toggle-button">
            Pronóstico 5 Días
          </button>

          {showConfirmation && (
            <ConfirmacionTemporal
              mensaje="Se espera lluvia"
              onClose={handleCloseConfirmation}
              shouldReload={shouldReload}
            />
          )}
        </div>
      ) : (
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

export default Weather;

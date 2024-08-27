import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCloudRain, FaSun, FaCloudShowersHeavy } from 'react-icons/fa';
import '../styles/clima.css'; // Asegúrate de importar el archivo CSS

const Weather = () => {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const apiKey = 'c5dd700cd5ba4428a3967e62c1bbca6a';
  const url = `https://api.weatherbit.io/v2.0/current?city=Mendoza&key=${apiKey}&lang=es`;

  useEffect(() => {
    axios.get(url)
      .then(response => {
        console.log(response); 
        setWeather(response.data);
        setError(null);
      })
      .catch(err => {
        console.error(err); 
        setError('Error al obtener datos del clima');
      });
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
              <span className="icon">{getPrecipitationIcon(weather.data[0].precip, weather.data[0].precip_prob)}</span>
            </div>
          </div>
          <div className="weather-details">
            <div className="weather-item">
              <strong>Humedad:</strong> {weather.data[0].rh}%
            </div>
            <div className="weather-item">
              <strong>Velocidad del Viento:</strong> {weather.data[0].wind_spd} km/h
            </div>
            <div className="weather-item">
              <strong>Precipitaciones:</strong> {weather.data[0].precip || 'N/A'} mm
            </div>
            <div className="weather-item">
              <strong>Probabilidad de Precipitaciones:</strong> {weather.data[0].precip_prob || 'N/A'}%
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

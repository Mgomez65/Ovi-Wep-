import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./calendarioInforme.css";

const Calendario = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const yourToken = localStorage.getItem("token"); // Reemplaza "token" con la clave correcta
  
      if (!yourToken) {
        throw new Error("Token no encontrado.");
      }
  
      console.log("Fetching events...");
      const response = await fetch("http://localhost:3000/calendario/getCalendario", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${yourToken}` // Utiliza el token aquí
        },
      });
  
      console.log("Response status:", response.status); // Verifica el estado de la respuesta
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Fetched events:", data);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  };
  
  

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="calendario-solo-mostrar">
      <Calendar
        value={date}
        onChange={setDate}
        showNavigation={false} // Esta propiedad oculta la barra de navegación
        tileContent={({ date }) => {
          const eventsForDay = events.filter(
            (event) => date >= new Date(event.start).setHours(0, 0, 0, 0) && date <= new Date(event.end).setHours(0, 0, 0, 0)
          );

          return (
            <ul className="event-list">
              {eventsForDay.map((event) => (
                <li key={event.id} style={{ backgroundColor: event.color, color: "#fff", padding: "2px" }}>
                  {event.title}
                </li>
              ))}
            </ul>
          );
        }}
      />
    </div>
  );
};

export default Calendario;

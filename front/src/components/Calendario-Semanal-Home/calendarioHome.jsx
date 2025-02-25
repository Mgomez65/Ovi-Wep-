import { useState, useEffect } from 'react';
import axios from 'axios';
import './calendarioHome.css';

const Calendario = ({ hideHeader }) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token JWT no encontrado");
        }
        const response = await axios.get(
          "http://localhost:3000/calendario/allPlanDia",
          { fechaDia: date },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Formatear la respuesta para su uso en el calendario
        setEvents(
          response.data.map((event) => ({
            id: event.id,
            title: event.titulo,
            start: new Date(event.fechaDia),
            color: event.color || "#000000",
          }))
        );
      } catch (error) {
        console.error("Error al obtener los eventos:", error);
      }
    };
    fetchEvents();
  }, [date]);

  return (
    <div className="calendario-container1">
      <div className="calendario1">
        <div className="week-view">
            <div className="day-tile">
            <h3>
              {date.toLocaleDateString("es", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </h3>
            <ul>
              {events.length > 0 ? (
                events.map((event, index) => (
                  <li key={index} style={{ backgroundColor: event.color }}>
                    {event.title}
                  </li>
                ))
              ) : (
                <li>No hay tareas para hoy</li>
              )}
            </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Calendario;

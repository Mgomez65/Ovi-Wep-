import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './calendarioHome.css';

const Calendario = ({ hideHeader }) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token JWT no encontrado");
        }

        // Obtener todos los planes
        const response = await axios.get('http://localhost:3000/calendario/getPlanDeRiego', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPlans(response.data); // Guardamos los planes
        fetchEvents(response.data); // Llamamos a fetchEvents con los planes
      } catch (error) {
        console.error('Error al obtener los planes:', error);
      }
    };

    const fetchEvents = async (plans) => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Token JWT no encontrado");
        }

        // Realizamos una solicitud para cada plan
        const eventsPromises = plans.map(async (plan) => {
          const response = await axios.post(
            `http://localhost:3000/calendario/getPlanDia`,
            { idPlan: plan.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          return response.data.map(event => ({
            id: event.id,
            title: event.titulo,
            start: new Date(event.fechaDia),
            color: event.color || '#000000',
          }));
        });

        // Esperamos a que todas las promesas se resuelvan
        const allEvents = await Promise.all(eventsPromises);
        
        // Aplanamos el array de eventos
        setEvents(allEvents.flat());
      } catch (error) {
        console.error('Error al obtener los eventos:', error);
      }
    };

    fetchPlans();
  }, []);

  const startOfWeek = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const getDaysOfWeek = (startDate) => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(new Date(startDate.getTime() + i * 86400000));
    }
    return days;
  };

  const weekStart = startOfWeek(new Date(date));
  const daysOfWeek = getDaysOfWeek(weekStart);

  return (
    <div className="calendario-container1">
      <div className="calendario1">
        <div className="week-view">
          {daysOfWeek.map((day, index) => (
            <div key={index} className="day-tile">
              <h3>{day.toLocaleDateString('es', { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
              <ul>
                {events
                  .filter(event => {
                    const eventStart = new Date(event.start);
                    return (
                      eventStart.toDateString() === day.toDateString() ||
                      (event.end && new Date(event.end).toDateString() === day.toDateString())
                    );
                  })
                  .map((event, index) => (
                    <li key={index} style={{ backgroundColor: event.color }}>
                      {event.title}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendario;

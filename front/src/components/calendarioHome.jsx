import React, { useState, useEffect } from 'react';
import '../styles/calendarioHome.css';

const Calendario = ({ hideHeader }) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/calendario/getCalendario');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const formattedEvents = data.map(event => ({
          id: event._id,
          title: event.titulo,
          start: new Date(event.inicio),
          end: new Date(event.fin),
          color: event.color || '#000000',
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      }
    };

    fetchEvents();
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

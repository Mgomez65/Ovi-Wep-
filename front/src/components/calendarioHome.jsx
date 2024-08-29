import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import '../styles/calendarioHome.css'

const Calendario = ({ hideHeader }) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/getCalendario');
        const data = await response.json();
        const formattedEvents = data.map(event => ({
          title: event.evento,
          start: new Date(event.inicio),
          end: new Date(event.fin),
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="calendario-container1">
      <div className="calendario1">
        <Calendar
          value={date}
          onChange={setDate}
          tileContent={({ date }) => {
            const eventsForDay = events.filter(event =>
              date >= new Date(event.start).setHours(0, 0, 0, 0) &&
              date <= new Date(event.end).setHours(0, 0, 0, 0)
            );

            return (
              <ul>
                {eventsForDay.map((event, index) => (
                  <li key={index}>{event.title}</li>
                ))}
              </ul>
            );
          }}
        />
      </div>
    </div>
  );
};

export default Calendario;

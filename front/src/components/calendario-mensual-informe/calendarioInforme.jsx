import React, { useState, useEffect } from 'react';
import './calendarioInforme.css';

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

        const response = await fetch('http://localhost:3000/calendario/getCalendario', {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: 'include',
        });
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

  const getDaysInMonth = (year, month) => {
    const days = [];
    const lastDate = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= lastDate; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const monthDays = getDaysInMonth(date.getFullYear(), date.getMonth());
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const startDayOfWeek = startOfMonth.getDay();

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const emptyDays = Array.from({ length: startDayOfWeek }).fill(null);

  const handlePreviousMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  return (
    <div className="calendario-container9">
      <div className="calendario9">
        <div className="month-view9">
          <div className="month-navigation">
            <button onClick={handlePreviousMonth}>&lt; Anterior</button>
            <h2>{date.toLocaleDateString('es', { month: 'long', year: 'numeric' })}</h2>
            <button onClick={handleNextMonth}>Siguiente &gt;</button>
          </div>
          <div className="week-view9">
            {dayNames.map((dayName, index) => (
              <div key={index} className="day-tile9 day-name">{dayName}</div>
            ))}
          </div>
          <div className="week-view9">
            {emptyDays.map((_, index) => (
              <div key={index} className="day-tile empty9" />
            ))}
            {monthDays.map((day, index) => (
              <div key={index} className="day-tile9">
                <h3>{day.getDate()}</h3>
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
                      <li key={index} style={{ backgroundColor: event.color, color: '#fff', padding: '2px 5px', borderRadius: '3px' }}>
                        {event.title}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendario;

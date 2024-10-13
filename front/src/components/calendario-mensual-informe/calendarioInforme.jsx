import React, { useState, useEffect } from 'react';
import './calendarioInforme.css';

const Calendario = ({ eventos }) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState(eventos);

  useEffect(() => {
    // Actualiza los eventos cuando el prop cambia
    setEvents(eventos);
  }, [eventos]);

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

  return (
    <div className="calendario-container9">
      <div className="calendario9">
        <div className="month-view9">
          <div className="month-navigation">
            <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}>&lt; Anterior</button>
            <h2>{date.toLocaleDateString('es', { month: 'long', year: 'numeric' })}</h2>
            <button onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}>Siguiente &gt;</button>
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
                    .filter(event => new Date(event.fechaDia).toDateString() === day.toDateString())
                    .map((event, index) => (
                      <li key={index} style={{ backgroundColor: event.color, color: '#fff', padding: '2px 5px', borderRadius: '3px' }}>
                        {event.titulo}
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

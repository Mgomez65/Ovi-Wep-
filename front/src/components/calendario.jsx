import React, { useState, useEffect } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendario.css'; // Asegúrate de que este archivo tenga los estilos del formulario
import 'dayjs/locale/es';

const localizer = dayjsLocalizer(dayjs);
dayjs.locale('es');

const Calendario = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '' });

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

  const handleAddEvent = async () => {
    try {
      const response = await fetch('http://localhost:3000/createCalendario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          evento: newEvent.title,
          inicio: newEvent.start,
          fin: newEvent.end,
        }),
      });

      if (response.ok) {
        const addedEvent = await response.json();
        setEvents([...events, {
          title: addedEvent.evento,
          start: new Date(addedEvent.inicio),
          end: new Date(addedEvent.fin),
        }]);
        setShowForm(false);
      } else {
        console.error('Error al agregar el evento:', response.statusText);
      }
    } catch (error) {
      console.error('Error al agregar el evento:', error);
    }
  };

  return (
    <div className="calendario-container">
      <div className="calendario-header">
        <h1 className='tituloCalendario'>Calendario de OVI</h1>
        <button className='botonAgregarEvento' onClick={() => setShowForm(true)}>Agregar evento</button>
      </div>

      {showForm && (
        <div className='formulario-agregar-evento'>
          <div className="header">
            <h2>Nuevo Evento</h2>
          </div>
          <label>Título:</label>
          <input
            type='text'
            value={newEvent.title}
            onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
          />
          <label>Fecha y hora de inicio:</label>
          <input
            type='datetime-local'
            value={newEvent.start}
            onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
          />
          <label>Fecha y hora de finalización:</label>
          <input
            type='datetime-local'
            value={newEvent.end}
            onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
          />
          <button onClick={handleAddEvent}>Añadir evento</button>
          <button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
        </div>
      )}

      <div className="calendario">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          messages={{
            next: "Sig",
            previous: "Ant",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            date: "Fecha",
            time: "Hora",
            event: "Evento",
            allDay: "Todo el día",
            noEventsInRange: "No hay eventos en este rango.",
            showMore: total => `+ Ver más (${total})`
          }}
        />
      </div>
    </div>
  );
};

export default Calendario;

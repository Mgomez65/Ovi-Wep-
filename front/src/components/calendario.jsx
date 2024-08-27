import React, { useState, useEffect } from 'react';
import { Calendar, dayjsLocalizer } from 'react-big-calendar';
import dayjs from 'dayjs';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../styles/calendario.css';
import 'dayjs/locale/es';

const localizer = dayjsLocalizer(dayjs);
dayjs.locale('es');

const Calendario = () => {
  const [events, setEvents] = useState();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/events');
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
    <div>
      <h1>Calendario de OVI</h1>
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
  );
};

export default Calendario;

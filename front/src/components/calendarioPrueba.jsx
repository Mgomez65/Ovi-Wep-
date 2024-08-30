import React, { useEffect, useState, useCallback } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from '@fullcalendar/core/locales/es'; // Importa la localización en español directamente
import '../styles/calendarioPrueba.css'; // Importa el archivo CSS

export default function Calendario() {
  const [eventos, setEventos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({ title: '', color: '#378006', date: '' });

  useEffect(() => {
    // Cargar eventos iniciales si es necesario
  }, []);

  const manejarClicFecha = (arg) => {
    setNewEvent({ ...newEvent, date: arg.dateStr });
    setSelectedEvent(null);
    setShowForm(true);
  };

  const manejarEventoCambiado = useCallback((eventInfo) => {
    console.log("Evento cambiado:", eventInfo);
    const updatedEvents = eventos.map(event =>
      event.id === eventInfo.event.id
        ? {
            ...event,
            start: eventInfo.event.startStr,
            end: eventInfo.event.endStr,
            backgroundColor: eventInfo.event.backgroundColor,
          }
        : event
    );
    setEventos(updatedEvents);
  }, [eventos]);

  const manejarCambioFormulario = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const manejarEnvioFormulario = (e) => {
    e.preventDefault();
    console.log("Formulario enviado con:", newEvent);
    if (selectedEvent) {
      // Editar evento existente
      const updatedEvents = eventos.map(event =>
        event.id === selectedEvent.id
          ? {
              ...event,
              title: newEvent.title,
              start: newEvent.date,
              backgroundColor: newEvent.color,
            }
          : event
      );
      setEventos(updatedEvents);
    } else {
      // Agregar nuevo evento
      const nuevoEvento = {
        id: Date.now(), // Genera un ID único
        title: newEvent.title,
        start: newEvent.date,
        backgroundColor: newEvent.color,
      };
      setEventos([...eventos, nuevoEvento]);
    }
    setShowForm(false);
    setNewEvent({ title: '', color: '#378006', date: '' });
    setSelectedEvent(null);
  };

  const manejarEliminarEvento = () => {
    if (selectedEvent) {
      const updatedEvents = eventos.filter(event => event.id !== selectedEvent.id);
      setEventos(updatedEvents);
      setShowForm(false);
      setSelectedEvent(null);
    }
  };

  const manejarClicEvento = (eventInfo) => {
    console.log("Evento clickeado:", eventInfo);
    setNewEvent({
      title: eventInfo.event.title,
      color: eventInfo.event.backgroundColor || '#378006',
      date: eventInfo.event.startStr,
    });
    setSelectedEvent({
      id: eventInfo.event.id,
    });
    setShowForm(true);
  };

  const renderizarContenidoEvento = (eventInfo) => {
    return (
      <div style={{ backgroundColor: eventInfo.event.backgroundColor, padding: '2px 5px', borderRadius: '4px' }}>
        <b>{eventInfo.timeText}</b>
        <i>{eventInfo.event.title}</i>
      </div>
    );
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        locale={esLocale} // Configura el idioma en español
        dateClick={manejarClicFecha}
        events={eventos}
        eventContent={renderizarContenidoEvento}
        eventDrop={manejarEventoCambiado} // Permite mover eventos
        eventClick={manejarClicEvento} // Permite hacer clic en eventos para editar
      />
      {showForm && (
        <div style={dialogStyle}>
          <h3>{selectedEvent ? 'Editar Evento' : 'Agregar Evento'}</h3>
          <form onSubmit={manejarEnvioFormulario}>
            <div>
              <label>
                Título:
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={manejarCambioFormulario}
                  required
                />
              </label>
            </div>
            <div>
              <label>
                Color:
                <input
                  type="color"
                  name="color"
                  value={newEvent.color}
                  onChange={manejarCambioFormulario}
                />
              </label>
            </div>
            <div>
              <button type="submit">Guardar</button>
              {selectedEvent && <button type="button" onClick={manejarEliminarEvento}>Eliminar</button>}
              <button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

// Estilo para el cuadro de diálogo
const dialogStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#fff',
  padding: '20px',
  border: '1px solid #ccc',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  zIndex: 1000,
  width: '300px',
  borderRadius: '8px',
};

/* import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Header from "../components/header";
import "react-calendar/dist/Calendar.css";
import "../styles/calendario.css";

const Calendario = ({ view, hideHeader }) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    color: "#000000",
  });
  const [eventToEdit, setEventToEdit] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/calendario/getCalendario");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.mensaje) {
          console.log(data.mensaje);
        } else {
          const formattedEvents = data.map((event) => ({
            id: event._id,
            title: event.evento,
            start: new Date(event.inicio),
            end: new Date(event.fin),
            color: event.color || "#000000",
          }));
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleAddEvent = async () => {
    const start = newEvent.start || selectedDate.toISOString().slice(0, 16);
    const end = newEvent.end || new Date(selectedDate.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16);

    try {
      const response = await fetch("http://localhost:3000/calendario/createCalendario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          evento: newEvent.title,
          inicio: start,
          fin: end,
          color: newEvent.color,
        }),
      });

      if (response.ok) {
        const addedEvent = await response.json();
        setEvents([
          ...events,
          {
            id: addedEvent._id,
            title: addedEvent.evento,
            start: new Date(addedEvent.inicio),
            end: new Date(addedEvent.fin),
            color: addedEvent.color,
          },
        ]);
        setShowForm(false);
      } else {
        console.error("Error al agregar el evento:", response.statusText);
      }
    } catch (error) {
      console.error("Error al agregar el evento:", error);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const response = await fetch(`http://localhost:3000/calendario/actualizarCalendario/${eventToEdit.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          evento: newEvent.title,
          inicio: newEvent.start,
          fin: newEvent.end,
          color: newEvent.color,
        }),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents(events.map((event) =>
          event.id === updatedEvent._id
            ? {
                ...event,
                title: updatedEvent.evento,
                start: new Date(updatedEvent.inicio),
                end: new Date(updatedEvent.fin),
                color: updatedEvent.color,
              }
            : event
        ));
        setShowEditForm(false);
      } else {
        console.error("Error al actualizar el evento:", response.statusText);
      }
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:3000/calendario/deleteCalendario/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEvents(events.filter((event) => event.id !== eventId));
      } else {
        console.error("Error al eliminar el evento:", response.statusText);
      }
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
    }
  };

  return (
    <div className="calendario-container">
      <Header />
      {!hideHeader && (
        <div className="calendario-header">
          <h1 className="tituloCalendario">Calendario de OVI</h1>
        </div>
      )}

      <div className="calendario">
        <Calendar
          value={date}
          onChange={setDate}
          onClickDay={handleDayClick}
          tileContent={({ date, view }) => {
            const eventsForDay = events.filter(
              (event) =>
                date >= new Date(event.start).setHours(0, 0, 0, 0) &&
                date <= new Date(event.end).setHours(0, 0, 0, 0)
            );

            return (
              <ul>
                {eventsForDay.map((event) => (
                  <li key={event.id}>{event.title}</li>
                ))}
              </ul>
            );
          }}
        />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="botonCerrar"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="botonAgregar"
              >
                Agregar Evento
              </button>
            </div>
            <h2>Eventos para {selectedDate.toLocaleDateString()}</h2>
            <ul>
              {events
                .filter(
                  (event) =>
                    selectedDate >= new Date(event.start).setHours(0, 0, 0, 0) &&
                    selectedDate <= new Date(event.end).setHours(0, 0, 0, 0)
                )
                .map((event) => (
                  <li key={event.id}>
                    {event.title}
                    <button onClick={() => {
                      setEventToEdit(event);
                      setNewEvent({
                        title: event.title,
                        start: event.start.toISOString().slice(0, 16),
                        end: event.end.toISOString().slice(0, 16),
                        color: event.color,
                      });
                      setShowEditForm(true);
                    }} className="botonEditar">
                      Editar
                    </button>
                    <button onClick={() => handleDeleteEvent(event.id)} className="botonEliminar">
                      Eliminar
                    </button>
                  </li>
                ))}
            </ul>
            {showForm && (
              <div className="formulario-agregar-evento">
                <label>Título:</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
                <label>Fecha y hora de inicio:</label>
                <input
                  type="datetime-local"
                  value={newEvent.start}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, start: e.target.value })
                  }
                />
                <label>Fecha y hora de finalización:</label>
                <input
                  type="datetime-local"
                  value={newEvent.end}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, end: e.target.value })
                  }
                />
                <label>Color del evento:</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    value={newEvent.color}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, color: e.target.value })
                    }
                  />
                </div>
                <button onClick={handleAddEvent} className="boton">
                  Añadir evento
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="boton"
                >
                  Cancelar
                </button>
              </div>
            )}
            {showEditForm && (
              <div className="formulario-editar-evento">
                <label>Título:</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
                <label>Fecha y hora de inicio:</label>
                <input
                  type="datetime-local"
                  value={newEvent.start}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, start: e.target.value })
                  }
                />
                <label>Fecha y hora de finalización:</label>
                <input
                  type="datetime-local"
                  value={newEvent.end}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, end: e.target.value })
                  }
                />
                <label>Color del evento:</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    value={newEvent.color}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, color: e.target.value })
                    }
                  />
                </div>
                <button onClick={handleUpdateEvent} className="boton">
                  Actualizar evento
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditForm(false)}
                  className="boton"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario; */

import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Header from "../components/header";
import "react-calendar/dist/Calendar.css";
import "../styles/calendario.css";

const Calendario = ({ view, hideHeader }) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    color: "#000000",
  });
  const [eventToEdit, setEventToEdit] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/calendario/getCalendario");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.mensaje) {
          console.log(data.mensaje);
        } else {
          const formattedEvents = data.map((event) => ({
            id: event._id,
            title: event.evento,
            start: new Date(event.inicio),
            end: new Date(event.fin),
            color: event.color || "#000000",
          }));
          setEvents(formattedEvents);
        }
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
    // Preestablecer los campos de fecha y hora para el nuevo evento
    const start = date.toISOString().slice(0, 16);
    const end = new Date(date.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16); // Default to 1 hour later
    setNewEvent({ ...newEvent, start, end });
  };

  const handleAddEvent = async () => {
    const start = newEvent.start || selectedDate.toISOString().slice(0, 16);
    const end = newEvent.end || new Date(selectedDate.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16);

    try {
      const response = await fetch("http://localhost:3000/calendario/createCalendario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          evento: newEvent.title,
          inicio: start,
          fin: end,
          color: newEvent.color,
        }),
      });

      if (response.ok) {
        const addedEvent = await response.json();
        setEvents([
          ...events,
          {
            id: addedEvent._id,
            title: addedEvent.evento,
            start: new Date(addedEvent.inicio),
            end: new Date(addedEvent.fin),
            color: addedEvent.color,
          },
        ]);
        setShowForm(false);
      } else {
        console.error("Error al agregar el evento:", response.statusText);
      }
    } catch (error) {
      console.error("Error al agregar el evento:", error);
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const response = await fetch(`http://localhost:3000/calendario/actualizarCalendario/${eventToEdit.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          evento: newEvent.title,
          inicio: newEvent.start,
          fin: newEvent.end,
          color: newEvent.color,
        }),
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents(events.map((event) =>
          event.id === updatedEvent._id
            ? {
                ...event,
                title: updatedEvent.evento,
                start: new Date(updatedEvent.inicio),
                end: new Date(updatedEvent.fin),
                color: updatedEvent.color,
              }
            : event
        ));
        setShowEditForm(false);
      } else {
        console.error("Error al actualizar el evento:", response.statusText);
      }
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:3000/calendario/deleteCalendario/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setEvents(events.filter((event) => event.id !== eventId));
      } else {
        console.error("Error al eliminar el evento:", response.statusText);
      }
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
    }
  };

  return (
    <div className="calendario-container">
      <Header />
      {!hideHeader && (
        <div className="calendario-header">
          <h1 className="tituloCalendario">Calendario de OVI</h1>
        </div>
      )}

      <div className="calendario">
        <Calendar
          value={date}
          onChange={setDate}
          onClickDay={handleDayClick}
          tileContent={({ date, view }) => {
            const eventsForDay = events.filter(
              (event) =>
                date >= new Date(event.start).setHours(0, 0, 0, 0) &&
                date <= new Date(event.end).setHours(0, 0, 0, 0)
            );

            return (
              <ul>
                {eventsForDay.map((event) => (
                  <li key={event.id}>{event.title}</li>
                ))}
              </ul>
            );
          }}
        />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="botonCerrar"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="botonAgregar"
              >
                Agregar Evento
              </button>
            </div>
            <h2>Eventos para {selectedDate.toLocaleDateString()}</h2>
            <ul>
              {events
                .filter(
                  (event) =>
                    selectedDate >= new Date(event.start).setHours(0, 0, 0, 0) &&
                    selectedDate <= new Date(event.end).setHours(0, 0, 0, 0)
                )
                .map((event) => (
                  <li key={event.id}>
                    {event.title}
                    <button onClick={() => {
                      setEventToEdit(event);
                      setNewEvent({
                        title: event.title,
                        start: event.start.toISOString().slice(0, 16),
                        end: event.end.toISOString().slice(0, 16),
                        color: event.color,
                      });
                      setShowEditForm(true);
                    }} className="botonEditar">
                      Editar
                    </button>
                    <button onClick={() => handleDeleteEvent(event.id)} className="botonEliminar">
                      Eliminar
                    </button>
                  </li>
                ))}
            </ul>
            {showForm && (
              <div className="formulario-agregar-evento">
                <label>Título:</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
                <label>Fecha y hora de inicio:</label>
                <input
                  type="datetime-local"
                  value={newEvent.start}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, start: e.target.value })
                  }
                />
                <label>Fecha y hora de finalización:</label>
                <input
                  type="datetime-local"
                  value={newEvent.end}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, end: e.target.value })
                  }
                />
                <label>Color del evento:</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    value={newEvent.color}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, color: e.target.value })
                    }
                  />
                </div>
                <button onClick={handleAddEvent} className="boton">
                  Añadir evento
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="boton"
                >
                  Cancelar
                </button>
              </div>
            )}
            {showEditForm && (
              <div className="formulario-editar-evento">
                <label>Título:</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                />
                <label>Fecha y hora de inicio:</label>
                <input
                  type="datetime-local"
                  value={newEvent.start}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, start: e.target.value })
                  }
                />
                <label>Fecha y hora de finalización:</label>
                <input
                  type="datetime-local"
                  value={newEvent.end}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, end: e.target.value })
                  }
                />
                <label>Color del evento:</label>
                <div className="color-picker-wrapper">
                  <input
                    type="color"
                    value={newEvent.color}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, color: e.target.value })
                    }
                  />
                </div>
                <button onClick={handleUpdateEvent} className="botonActualizar">
                  Actualizar Evento
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;

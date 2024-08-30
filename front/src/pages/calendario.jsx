/* import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Header from "../components/header";
import "react-calendar/dist/Calendar.css"; // Importa los estilos de react-calendar
import "../styles/calendario.css"; // Asegúrate de que este archivo tenga los estilos del formulario

const Calendario = ({ view, hideHeader }) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    color: "#000",
  });
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/getCalendario");
        const data = await response.json();
        const formattedEvents = data.map((event) => ({
          title: event.evento,
          start: new Date(event.inicio),
          end: new Date(event.fin),
          color: event.color || "#000000",
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error al obtener eventos:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleAddEvent = async () => {
    try {
      const response = await fetch("http://localhost:3000/createCalendario", {
        method: "POST",
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
        const addedEvent = await response.json();
        setEvents([
          ...events,
          {
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

  return (
    <div className="calendario-container">
      <Header />
      <div className="calendario-header">
        <h1 className="tituloCalendario">Calendario de OVI</h1>
      </div>
      <div className="formularioPosision">
        {selectedDate && showForm && (
          <div className="detalles-dia">
            <ul>
              {events
                .filter(
                  (event) =>
                    selectedDate >=
                      new Date(event.start).setHours(0, 0, 0, 0) &&
                    selectedDate <= new Date(event.end).setHours(0, 0, 0, 0)
                )
                .map((event, index) => (
                  <li key={index}>{event.title}</li>
                ))}
            </ul>
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
          </div>
        )}
      </div>

      <div className="calendario">
        <Calendar
          value={date}
          onChange={setDate}
          onClickDay={(date) => handleDayClick(date)}
          tileContent={({ date, view }) => {
            const eventsForDay = events.filter(
              (event) =>
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
 */

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
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    color: "#000",
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:3000/getCalendario");
        const data = await response.json();
        const formattedEvents = data.map((event) => ({
          title: event.evento,
          start: new Date(event.inicio),
          end: new Date(event.fin),
          color: event.color || "#000000",
        }));
        setEvents(formattedEvents);
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
    try {
      const response = await fetch("http://localhost:3000/createCalendario", {
        method: "POST",
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
        const addedEvent = await response.json();
        setEvents([
          ...events,
          {
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
                {eventsForDay.map((event, index) => (
                  <li key={index}>{event.title}</li>
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
                    selectedDate >=
                      new Date(event.start).setHours(0, 0, 0, 0) &&
                    selectedDate <= new Date(event.end).setHours(0, 0, 0, 0)
                )
                .map((event, index) => (
                  <li key={index}>{event.title}</li>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendario;

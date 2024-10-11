import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import ConfirmacionTemporal from "../../components/Notificacion/notificacionTemporal";
import iconoElimar from "../../assets/icon-eliminar.png";
import iconoEditar from "../../assets/icon-editar.png";
import "react-calendar/dist/Calendar.css";
import "./calendario.css";

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
  const [showConfirmacion, setShowConfirmacion] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");

  const colorOptions = [
    { name: "Blanco", value: "#FFFFFF" },
    { name: "Gris Claro", value: "#D3D3D3" },
    { name: "Beige", value: "#F5F5DC" },
    { name: "Amarillo", value: "#FFFF00" },
    { name: "Naranja", value: "#FFA500" },
    { name: "Rojo", value: "#d42c2c" },
    { name: "Verde", value: "#22ff22" },
    { name: "Azul", value: "#0044ff" },
  ];

  const fetchAllEvents = async () => {

    try {
      const response = await fetch(
        "http://localhost:3000/calendario/getCalendario",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.length) {
        const formattedEvents = data.map((event) => ({
          id: event.id,
          title: event.titulo,
          start: new Date(event.inicio),
          end: new Date(event.fin),
          color: event.color || "#000000",
        }));
        setEvents(formattedEvents);
      } else {
        console.log("No se encontraron eventos.");
        setEvents([]);
      }
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
    const start = date.toISOString().slice(0, 16);
    const end = new Date(date.getTime() + 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16);
    setNewEvent({ ...newEvent, start, end });
  };

  const handleAddEvent = async () => {
    const start = newEvent.start || selectedDate.toISOString().slice(0, 16);
    const end =
      newEvent.end ||
      new Date(selectedDate.getTime() + 60 * 60 * 1000)
        .toISOString()
        .slice(0, 16);

    try {
      const response = await fetch(
        "http://localhost:3000/calendario/createCalendario",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titulo: newEvent.title,
            inicio: start,
            fin: end,
            color: newEvent.color,
          }),
        }
      );

      if (response.ok) {
        await fetchAllEvents();
        setShowForm(false);
        setShowConfirmacion(true);
        setMensajeConfirmacion("Evento agregado esxitosamente");
      } else {
        console.error("Error al agregar el evento:", response.statusText);
        setShowConfirmacion(true);
        setMensajeConfirmacion("Error al agregar evento");
      }
    } catch (error) {
      console.error("Error al agregar el evento:", error);
      setShowConfirmacion(true);
      setMensajeConfirmacion("Error al agregar evento");
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/calendario/actualizarCalendario/${eventToEdit.id}`,
        {
          method: "put",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            titulo: newEvent.title,
            inicio: newEvent.start,
            fin: newEvent.end,
            color: newEvent.color,
          }),
        }
      );

      if (response.ok) {
        await fetchAllEvents();
        setShowEditForm(false);
        setShowConfirmacion(true);
        setMensajeConfirmacion("Evento actualizado exitosamente");
      } else {
        console.error("Error al actualizar el evento:", response.statusText);
        setShowConfirmacion(true);
        setMensajeConfirmacion("Error al actualizar evento");
      }
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
      setShowConfirmacion(true);
      setMensajeConfirmacion("Error al actualizar evento");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/calendario/deleteCalendario/${eventId}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        await fetchAllEvents();
        setShowConfirmacion(true);
        setMensajeConfirmacion("Evento eliminado exitosamente");
      } else {
        const errorData = await response.json();
        console.error(
          "Error al eliminar el evento:",
          errorData.error || response.statusText
        );
        setShowConfirmacion(true);
        setMensajeConfirmacion("Error al eliminar evento");
      }
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
      setShowConfirmacion(true);
      setMensajeConfirmacion("Error al eliminar evento");
    }
  };

  return (
    <div className="calendario-container">
      <Header />
      <div className="Container">
        <div className="planesRiegoContainer">
          <h2>Planes de Riego</h2>
        </div>

        <div className="calendarioContainer">
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
                  <ul className="event-list">
                    {eventsForDay.map((event) => (
                      <li
                        key={event.id}
                        style={{
                          backgroundColor: event.color,
                          color: "#fff",
                          padding: "2px",
                        }}
                      >
                        {event.title}
                      </li>
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
                <div className="event-container">
                  <ul className="event-list">
                    {events
                      .filter(
                        (event) =>
                          selectedDate >=
                            new Date(event.start).setHours(0, 0, 0, 0) &&
                          selectedDate <= new Date(event.end).setHours(0, 0, 0, 0)
                      )
                      .map((event) => (
                        <li
                          key={event.id}
                          style={{
                            backgroundColor: event.color,
                            color: "#fff",
                            padding: "2px",
                          }}
                        >
                          {event.title}
                          <div className="botonesEliminarActualizar">
                            <button
                              onClick={() => {
                                setEventToEdit(event);
                                setNewEvent({
                                  title: event.title,
                                  start: event.start.toISOString().slice(0, 16),
                                  end: event.end.toISOString().slice(0, 16),
                                  color: event.color,
                                });
                                setShowEditForm(true);
                              }}
                              className="botonEditar"
                            >
                              <img
                                src={iconoEditar}
                                alt="Actualizar"
                                className="Editar"
                              />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="botonEliminar"
                            >
                              <img
                                src={iconoElimar}
                                alt="Eliminar"
                                className="Eliminar"
                              />
                            </button>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>

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
                    <div className="color-picker-wrapper">
                      <label>Color del evento:</label>
                      <div className="color-options">
                        {colorOptions.map((option) => (
                          <button
                            key={option.value}
                            style={{
                              backgroundColor: option.value,
                              width: "30px",
                              height: "30px",
                              border:
                                newEvent.color === option.value
                                  ? "2px solid black"
                                  : "none",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setNewEvent({ ...newEvent, color: option.value })
                            }
                          />
                        ))}
                      </div>
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
                    <div className="color-picker-wrapper">
                      <label>Color del evento:</label>
                      <div className="color-options">
                        {colorOptions.map((option) => (
                          <button
                            key={option.value}
                            style={{
                              backgroundColor: option.value,
                              width: "30px",
                              height: "30px",
                              border:
                                newEvent.color === option.value
                                  ? "2px solid black"
                                  : "none",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              setNewEvent({ ...newEvent, color: option.value })
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <button onClick={handleUpdateEvent} className="boton">
                      Actualizar Evento
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
          {showConfirmacion && (
            <ConfirmacionTemporal
              mensaje={mensajeConfirmacion}
              onClose={() => setShowConfirmacion(false)}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Calendario;

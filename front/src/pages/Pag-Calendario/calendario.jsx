import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import PlanesDeRiego from "../../components/Plan-de-Riego/planRiego";
import "react-calendar/dist/Calendar.css";
import "./calendario.css";

const Calendario = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    start: date.toISOString().split("T")[0],
    end: date.toISOString().split("T")[0],
    color: "#FFFFFF",
    id: null,
  });
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchEvents = async (planId) => {
    if (planId) {
      try {
        const response = await axios.post(
          `http://localhost:3000/calendario/getPlanDia`,
          { idPlan: planId }
        );
        const formattedEvents = response.data.map((event) => ({
          id: event.id,
          title: event.titulo,
          start: new Date(event.fechaDia),
          end: new Date(event.fechaDia),
          color: event.color || "#000",
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error al obtener los eventos:", error);
      }
    }
  };

  useEffect(() => {
    if (selectedPlan) {
      fetchEvents(selectedPlan);
    }
  }, [selectedPlan]);

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    const eventsOnSelectedDate = events.filter(
      (event) => event.start.toDateString() === selectedDate.toDateString()
    );
    setFilteredEvents(eventsOnSelectedDate);
    setShowModal(true);
    setEventData({
      ...eventData,
      start: selectedDate.toISOString().split("T")[0],
      end: selectedDate.toISOString().split("T")[0],
    });
  };

  const handleEventClick = (event) => {
    setEventData({
      title: event.title,
      start: event.start.toISOString().split("T")[0],
      end: event.end.toISOString().split("T")[0],
      color: event.color,
      id: event.id,
    });
  };

  const createOrUpdateEvent = async () => {
    try {
      // Asegúrate de que `fechaDia` sea la fecha seleccionada en el calendario.
      const eventToSend = {
        titulo: eventData.title,
        color: eventData.color,
        idPlan: selectedPlan,
        fechaDia: date.toISOString().split("T")[0], // Formato ISO para la fecha
      };
  
      if (eventData.id) {
        await axios.put(
          `http://localhost:3000/calendario/actualizarEvento/${eventData.id}`,
          eventToSend
        );
      } else {
        await axios.post(
          "http://localhost:3000/calendario/createDiaPlan",
          eventToSend
        );
      }
  
      // Actualiza los eventos después de la creación o actualización
      fetchEvents(selectedPlan);
      setEventData({
        title: "",
        start: "",
        end: "",
        color: "#FFFFFF",
        id: null,
      });
    } catch (error) {
      console.error("Error al guardar el evento:", error);
    }
  };
  
  // En el modal, donde se define el evento:
  const handleAddEvent = () => {
    setEventData({
      title: "", // o el título que desees
      start: date.toISOString().split("T")[0], // Aquí estableces la fecha seleccionada
      end: date.toISOString().split("T")[0], // Aquí estableces la fecha seleccionada
      color: "#FFFFFF", // O el color que desees por defecto
      id: null, // Indica que es un nuevo evento
    });
    setShowModal(true);
  };
  

  const handleInputChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  // Función para renderizar el contenido de las celdas del calendario
  const renderTileContent = ({ date, view }) => {
    if (view === "month") {
      const eventsOnThisDay = events.filter(
        (event) => event.start.toDateString() === date.toDateString()
      );
      return (
        <div>
          {eventsOnThisDay.map((event) => (
            <div
              key={event.id}
              style={{ backgroundColor: event.color, padding: "2px", borderRadius: "5px" }}
            >
              {event.title}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="calendario-container">
      <Header />
      <div className="Container">
        <PlanesDeRiego onPlanSelect={setSelectedPlan} />
        <div className="react-calendar">
          <Calendar
            onChange={setDate}
            value={date}
            onClickDay={handleDateSelect}
            tileContent={renderTileContent} // Mostrar eventos en el calendario
          />
          {showModal && (
            <div className="modal">
              <h2>Eventos en {date.toDateString()}</h2>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div key={event.id} onClick={() => handleEventClick(event)}>
                    <span>{event.title}</span>
                    <span>{event.start.toLocaleString()}</span>
                    <span>{event.end.toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <p>No hay eventos para esta fecha.</p>
              )}
              <h3>Agregar Nuevo Evento</h3>
              <form>
                <label>Título:</label>
                <input
                  type="text"
                  name="title"
                  value={eventData.title}
                  onChange={handleInputChange}
                />
                <label>Fecha de inicio:</label>
                <input
                  type="date"
                  name="start"
                  value={eventData.start}
                  onChange={handleInputChange}
                />
                <label>Fecha de fin:</label>
                <input
                  type="date"
                  name="end"
                  value={eventData.end}
                  onChange={handleInputChange}
                />
                <label>Color:</label>
                <input
                  type="color"
                  name="color"
                  value={eventData.color}
                  onChange={handleInputChange}
                />
                <button type="button" onClick={createOrUpdateEvent}>
                  Guardar Evento
                </button>
              </form>
              <button onClick={() => setShowModal(false)}>Cerrar</button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Calendario;

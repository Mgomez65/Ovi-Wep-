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
    start: "",
    end: "",
    color: "#FFFFFF",
    id: null,
  });
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchEvents = async (planId) => {
    if (planId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/calendario/getPlanDIa`, 
          { params: { planId } } 
        );
        console.log("Eventos recibidos:", response.data); // Log para verificar los eventos recibidos
        const formattedEvents = response.data.map((event) => ({
          id: event.id,
          title: event.titulo,
          start: new Date(event.inicio),
          end: new Date(event.fin),
          color: event.color || "#000",
        }));
        console.log("Eventos formateados:", formattedEvents); // Log para verificar eventos formateados
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
    console.log("Fecha seleccionada:", selectedDate); // Log para verificar la fecha seleccionada
    const eventsOnSelectedDate = events.filter(
      (event) => event.start.toDateString() === selectedDate.toDateString()
    );
    console.log("Eventos en la fecha seleccionada:", eventsOnSelectedDate); // Log para verificar eventos filtrados
    setFilteredEvents(eventsOnSelectedDate);
    setShowModal(true);
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
      const eventToSend = {
        title: eventData.title,
        inicio: new Date(eventData.start),
        fin: new Date(eventData.end),
        color: eventData.color,
        idPlan: selectedPlan,
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

import React, { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import PlanesDeRiego from "../../components/Plan-de-Riego/planRiego";
import "react-calendar/dist/Calendar.css";
import "./calendario.css";
import { es } from 'date-fns/locale';
import Auth from '../../components/Auth-Admin/Auth-Admin';

const Calendario = () => {
  const [userRol, setUserRol] = useState(null);
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
  const [showForm, setShowForm] = useState(false);

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
      const eventToSend = {
        titulo: eventData.title,
        color: eventData.color,
        idPlan: selectedPlan,
        fechaDia: date.toISOString().split("T")[0],
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

  const handleInputChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

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
              style={{ backgroundColor: event.color, padding: "2px", borderRadius: "5px", marginTop: "25px" }}
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
            locale={es}
            onClickDay={handleDateSelect}
            tileContent={renderTileContent}
          />
          <Auth setUserRol={setUserRol} /> 
          {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Eventos en {date.toDateString()}</h2>
                  
                </div>
                <div className="modal-body">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <div key={event.id} onClick={() => handleEventClick(event)}>
                        <span style={{'backgroundColor': event.color, 'fontSize': '18px', 'padding': '5px', 'borderRadius': '3px'}}>{event.title}</span>
                      </div>
                    ))
                  ) : (
                    <p>No hay eventos para esta fecha.</p>
                  )}

                  {userRol === 'admin' && (
                    <>
                      
                    </>
                  )}
                  {userRol === 'admin' ? (
                    <>
                      <button className="boton" onClick={() => setShowForm(true)}>
                        Agregar Evento
                      </button>
                      <button className="boton" onClick={() => setShowModal(false)} style={{marginLeft: "10px", marginTop: "15px"}}>
                        Cerrar
                      </button>
                    </>
                  ) : (
                    <button className="boton" onClick={() => setShowModal(false)} style={{marginLeft: "10px", marginTop: "15px"}}>
                      Cerrar
                    </button>
                  )}

                  {showForm && (
                    <form className="formulario-editar-evento">
                      <label>Título:</label>
                      <input
                        type="text"
                        name="title"
                        placeholder="Título"
                        className="form-titulo"
                        value={eventData.title}
                        onChange={handleInputChange}
                        style={{'width': '100%'}}
                      />
                      <label>Color:</label>
                      <div className="color-picker-wrapper">
                        <input
                          type="color"
                          name="color"
                          value={eventData.color}
                          onChange={handleInputChange}
                        />
                      </div>
                      <button type="button" className="boton" onClick={createOrUpdateEvent}>
                        Guardar Evento
                      </button>
                      <button type="button" className="boton" onClick={() => setShowForm(false)}>
                        Cerrar Formulario
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Calendario;

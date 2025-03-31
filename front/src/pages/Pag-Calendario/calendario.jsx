import { useState, useEffect } from "react";
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
  const [formType, setFormType] = useState(null); // Nuevo estado para manejar el tipo de formulario (crear o actualizar)

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  };

  useEffect(() => {
    if (selectedPlan) {
      fetchEvents(selectedPlan);
    }
  }, [selectedPlan]);

  const fetchEvents = async (idPlan) => {
    if (idPlan) {
      try {
        const response = await axios.get(
          `http://localhost:3000/calendario/getPlanDia?idPlan=${idPlan}`,
          axiosConfig
        );
        const formattedEvents = response.data.map((event) => {
          const eventDate = new Date(event.fechaDia);
          return {
            id: event.id,
            title: event.titulo,
            start: new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000),
            end: new Date(eventDate.getTime() - eventDate.getTimezoneOffset() * 60000),
            color: event.color || "#000",
          };
        });
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error al obtener los eventos:", error);
      }
    }
  };

  const handleDateSelect = (selectedDate) => {
    const adjustedDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000);
    setDate(adjustedDate);
    const eventsOnSelectedDate = events.filter(
      (event) => event.start.toDateString() === adjustedDate.toDateString()
    );
    setFilteredEvents(eventsOnSelectedDate);
    setShowModal(true);
    setEventData({
      ...eventData,
      start: adjustedDate.toISOString().split("T")[0],
      end: adjustedDate.toISOString().split("T")[0],
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
    setFormType('update'); // Establecer que se está actualizando un evento
    setShowForm(true); // Mostrar el formulario
  };

  const handleAddEventClick = () => {
    setEventData({
      title: "",
      start: date.toISOString().split("T")[0],
      end: date.toISOString().split("T")[0],
      color: "#FFFFFF",
      id: null,
    });
    setFormType('create'); // Establecer que se está creando un evento
    setShowForm(true); // Muestra el formulario vacío
  };

  const createEvent = async () => {
    try {
      const eventToSend = {
        titulo: eventData.title,
        color: eventData.color,
        fechaDia: date.toISOString().split("T")[0],
      };
      await axios.post(
        `http://localhost:3000/calendario/createDiaPlan/${selectedPlan}`,
        eventToSend,
        axiosConfig
      );
      fetchEvents(selectedPlan);
      resetEventData();
      setShowForm(false); // Cerrar el formulario después de crear
    } catch (error) {
      console.error("Error al crear el evento:", error);
    }
  };

  const updateEvent = async () => {
    try {
      if (!eventData.id) return;
      const eventToSend = {
        titulo: eventData.title,
        color: eventData.color,
        fechaDia: date.toISOString().split("T")[0],
      };
      await axios.put(
        `http://localhost:3000/calendario/actualizarPlanDia/${eventData.id}`,
        eventToSend,
        axiosConfig
      );
      fetchEvents(selectedPlan);
      resetEventData();
      setShowForm(false); // Cerrar el formulario después de actualizar
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
    }
  };

  const resetEventData = () => {
    setEventData({
      title: "",
      start: "",
      end: "",
      color: "#FFFFFF",
      id: null,
    });
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/calendario/deletePlanDia/${id}`,
        axiosConfig
      );
      fetchEvents(selectedPlan);
      setEventData({
        title: "",
        start: "",
        end: "",
        color: "#FFFFFF",
        id: null,
      });
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
    }
  };

  const handleInputChange = (e) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const renderTileContent = ({ date, view }) => {
    if (view === "month") {
      const adjustedDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      const eventsOnThisDay = events.filter(
        (event) => {
          const eventDate = new Date(event.start.getTime() - event.start.getTimezoneOffset() * 60000);
          return eventDate.toDateString() === adjustedDate.toDateString();
        }
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
                      <div key={event.id} className="event-item">
                        <span
                          style={{ backgroundColor: event.color, fontSize: '18px', padding: '5px', borderRadius: '3px' }}
                        >
                          {event.title}
                        </span>

                        {userRol === 'admin' && (
                          <div className="event-actions">
                            <button className="boton" onClick={() => handleEventClick(event)}>
                              Actualizar
                            </button>
                            <button
                              className="boton"
                              onClick={() => deleteEvent(event.id)}
                              style={{ backgroundColor: "red", marginLeft: "10px", marginTop: "15px" }}
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>No hay eventos para esta fecha.</p>
                  )}

                  {userRol === 'admin' && (
                    <>
                      <button className="boton" onClick={handleAddEventClick}>
                        Agregar Evento
                      </button>
                      <button
                        className="boton"
                        onClick={() => setShowModal(false)}
                        style={{ marginLeft: "10px", marginTop: "15px" }}
                      >
                        Cerrar
                      </button>
                    </>
                  )}

                  {/* formulario de actalizar evento */}
                  {showForm && formType === 'update' && (
                    <form className="formulario-editar-evento">
                      <label>Título:</label>
                      <input
                        type="text"
                        name="title"
                        placeholder="Título"
                        className="form-titulo"
                        value={eventData.title}
                        onChange={handleInputChange}
                        style={{ width: '100%' }}
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
                      <button type="button" className="boton" onClick={updateEvent}>
                        Guardar Evento
                      </button>
                      <button type="button" className="boton" onClick={() => setShowForm(false)}>
                        Cerrar Formulario
                      </button>
                    </form>
                  )}

                  {/* formulario de crear evento */}
                  {showForm && formType === 'create' && (
                    <form className="formulario-editar-evento">
                      <label>Título:</label>
                      <input
                        type="text"
                        name="title"
                        placeholder="Título"
                        className="form-titulo"
                        value={eventData.title}
                        onChange={handleInputChange}
                        style={{ width: '100%' }}
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
                      <button type="button" className="boton" onClick={createEvent}>
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

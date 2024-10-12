import React, { useState, useEffect } from "react";
import axios from 'axios';
import Calendar from "react-calendar";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import ConfirmacionTemporal from "../../components/Notificacion/notificacionTemporal";
import "react-calendar/dist/Calendar.css";
import "./calendario.css";

import iconoEliminar from "../../assets/icon-eliminar.png";
import iconoEditar from "../../assets/icon-editar.png";

const Calendario = ({ view, hideHeader }) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmacion, setShowConfirmacion] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    inicio: "",
    fin: "",
    idInforme: 0,
  });
  const [showEventList, setShowEventList] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    start: "",
    end: "",
    color: "#FFFFFF",
    id: null,
  });

  const fetchPlans = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/calendario/getPlanDeRiego"
      );
      setPlans(response.data);
    } catch (error) {
      console.error("Error al obtener los planes:", error);
    }
  };

  const fetchEvents = async (planId) => {
    if (planId) {
      try {
        const response = await axios.get(
          `http://localhost:3000/calendario/getEventosPorPlan/${planId}`
        );
        const formattedEvents = response.data.map(event => ({
          id: event.id,
          title: event.titulo,
          start: new Date(event.inicio),
          end: new Date(event.fin),
          color: event.color || '#000',
        }));
        setEvents(formattedEvents);
        setFilteredEvents(formattedEvents); // Actualiza el estado para mostrar eventos filtrados
      } catch (error) {
        console.error("Error al obtener los eventos:", error);
      }
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      fetchEvents(selectedPlan); // Llama a fetchEvents con el plan seleccionado
    }
  }, [selectedPlan]);

  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
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
          "http://localhost:3000/calendario/createEvento",
          eventToSend
        );
      }

      fetchEvents(selectedPlan); // Actualiza eventos después de crear/actualizar
      setShowEventList(false);
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

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/calendario/deleteEvento/${id}`);
      fetchEvents(selectedPlan); // Actualiza eventos después de eliminar
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
    }
  };

  const createOrUpdatePlan = async () => {
    try {
      const planToSend = {
        titulo: formData.titulo,
        inicio: new Date(formData.inicio),
        fin: new Date(formData.fin),
        idInforme: formData.idInforme,
      };

      if (selectedPlan) {
        await axios.put(
          `http://localhost:3000/calendario/actualizarPlan/${selectedPlan}`,
          planToSend
        );
      } else {
        await axios.post(
          "http://localhost:3000/calendario/createCalendario",
          planToSend
        );
      }

      fetchPlans();
      setShowForm(false);
      setFormData({
        titulo: "",
        inicio: "",
        fin: "",
        idInforme: 0,
      });
    } catch (error) {
      console.error("Error al guardar el plan:", error);
    }
  };

  const deletePlan = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/calendario/deleteCalendario/${id}`);
      fetchPlans();
    } catch (error) {
      console.error("Error al eliminar el plan:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan.id); // Selecciona el plan y carga sus eventos
    setFormData({
      titulo: plan.titulo,
      inicio: plan.inicio,
      fin: plan.fin,
      idInforme: plan.idInforme,
    });
    setShowForm(true);
  };

  const handleDateSelect = (selectedDate) => {
    setDate(selectedDate);
    // Filtrar eventos para la fecha seleccionada
    const eventsOnSelectedDate = events.filter(event =>
      event.start.toDateString() === selectedDate.toDateString()
    );
    setFilteredEvents(eventsOnSelectedDate); // Actualiza los eventos filtrados
    setShowEventList(true); // Muestra la lista de eventos
  };

  const handleEventClick = (event) => {
    setEventData({
      title: event.title,
      start: event.start.toISOString().split('T')[0],
      end: event.end.toISOString().split('T')[0],
      color: event.color,
      id: event.id,
    });
    setShowEventList(true);
  };

  const handleShowEvents = (plan) => {
    setSelectedPlan(plan.id); // Selecciona el plan y carga sus eventos
    fetchEvents(plan.id); // Carga los eventos del plan seleccionado
    setShowEventList(true); // Muestra la lista de eventos
  };

  return (
    <div className="calendario-container">
      <Header />
      <div className="Container">
        <div className="planesRiegoContainer">
          <h2>Planes de Riego</h2>
          <div>
            <div className="irrigation-plan">
              <button
                onClick={() => {
                  setShowForm(true);
                  setSelectedPlan(null);
                  setFormData({
                    titulo: "",
                    inicio: "",
                    fin: "",
                    idInforme: 0,
                  });
                }}
                className="botonCrearPlanRiego"
              >
                Crear Plan de Riego
              </button>
              {showForm && (
                <div className="form-notification">
                  <h2>
                    {selectedPlan
                      ? "Editar Plan de Riego"
                      : "Crear Plan de Riego"}
                  </h2>
                  <input
                    type="text"
                    name="titulo"
                    placeholder="Nombre"
                    value={formData.titulo}
                    onChange={handleInputChange}
                  />
                  <input
                    type="date"
                    name="inicio"
                    placeholder="Fecha de Inicio"
                    value={formData.inicio}
                    onChange={handleInputChange}
                  />
                  <input
                    type="date"
                    name="fin"
                    placeholder="Fecha de Fin"
                    value={formData.fin}
                    onChange={handleInputChange}
                  />
                  <input
                    type="number"
                    name="idInforme"
                    placeholder="ID Informe"
                    value={formData.idInforme}
                    onChange={handleInputChange}
                    className="inputSinSpinner"
                  />
                  <button onClick={createOrUpdatePlan} className="botonAgregar">Guardar</button>
                  <button onClick={() => setShowForm(false)} className="botonCerrar">Cancelar</button>
                </div>
              )}
              <ul className="planRiegoUL">
                {Array.isArray(plans) && plans.length > 0 ? (
                  plans.map((plan) => (
                    <li key={plan.id} className="PlanRiegoLI" onClick={() => handleShowEvents(plan)}>
                      {plan.titulo}
                      <div className="botonesEliminarActualizar">
                        <button onClick={() => handlePlanSelect(plan)} className="botonEditar">
                          <img src={iconoEditar} alt="Editar" className="Editar" />
                        </button>
                        <button onClick={() => deletePlan(plan.id)} className="botonEliminar">
                          <img src={iconoEliminar} alt="Eliminar" className="Eliminar" />
                        </button>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>No hay planes de riego disponibles.</li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="calendarioContainer">
          <Calendar
            onChange={handleDateSelect}
            value={date}
            tileContent={({ date }) => {
              const eventsOnDate = filteredEvents.filter(event =>
                event.start.toDateString() === date.toDateString()
              );
              return eventsOnDate.length > 0 ? (
                <div className="event-tile">
                  {eventsOnDate.map(event => (
                    <div
                      key={event.id}
                      className="event"
                      onClick={() => handleEventClick(event)}
                      style={{ backgroundColor: event.color }}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              ) : null;
            }}
          />
        </div>
        {showEventList && (
          <div className="event-list-notification">
            <h2>Eventos del {date.toDateString()}</h2>
            {filteredEvents.length > 0 ? ( // Cambiar aquí para mostrar eventos filtrados
              filteredEvents.map(event => (
                <div key={event.id} className="event-item">
                  <span>{event.title}</span>
                  <button onClick={() => deleteEvent(event.id)} className="botonEliminarEvento">Eliminar</button>
                </div>
              ))
            ) : (
              <p>No hay eventos para este día.</p>
            )}
            <input
              type="text"
              name="title"
              placeholder="Título del Evento"
              value={eventData.title}
              onChange={handleEventInputChange}
            />
            <input
              type="date"
              name="start"
              placeholder="Inicio"
              value={eventData.start}
              onChange={handleEventInputChange}
            />
            <input
              type="date"
              name="end"
              placeholder="Fin"
              value={eventData.end}
              onChange={handleEventInputChange}
            />
            <input
              type="color"
              name="color"
              value={eventData.color}
              onChange={handleEventInputChange}
            />
            <button onClick={createOrUpdateEvent} className="botonAgregarEvento">Guardar Evento</button>
            <button onClick={() => setShowEventList(false)} className="botonCerrar">Cerrar</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Calendario;

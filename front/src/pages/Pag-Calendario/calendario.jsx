import { useState, useEffect } from "react";
import axios from "axios";
import Calendar from "react-calendar";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import "react-calendar/dist/Calendar.css";
import "./calendario.css";
import { es } from 'date-fns/locale';
import Auth from '../../components/Auth-Admin/Auth-Admin';

const Calendario = () => {
  const [userRol, setUserRol] = useState(null);
  const [date, setDate] = useState(new Date()); // This is a local Date object for react-calendar
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    // Initialize with a UTC date string for consistency
    start: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split("T")[0],
    end: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split("T")[0],
    color: "#FFFFFF",
    id: null,
  });
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [allPlanes, setAllPlanes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [showCreatePlanForm, setShowCreatePlanForm] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState("");
  const [newPlanStartDate, setNewPlanStartDate] = useState("");
  const [newPlanEndDate, setNewPlanEndDate] = useState("");
  
  const [selectedInformeId, setSelectedInformeId] = useState(""); // <
  const [informesDisponibles, setInformesDisponibles] = useState([]);
  // Colores predefinidos (Amarillo cambiado a Naranja)
  const predefinedColors = {
    red: '#FF0000',
    orange: '#FFA500', // Naranja en lugar de amarillo
    blue: '#0000FF',
    green: '#008000',
  };

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:3000',
  });

  useEffect(() => {
    const fetchAllPlanesDeRiego = async () => {
      try {
        const token = getAuthToken();
        if (!token && userRol === null) {
          return;
        }

        const response = await axiosInstance.get("/calendario/getPlanDeRiego", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.length > 0) {
          setAllPlanes(response.data);
          if (!selectedPlan) {
            setSelectedPlan(response.data[0]);
          }
        } else {
          setAllPlanes([]);
          setSelectedPlan(null);
          console.info("No hay planes de riego disponibles. Considera crear uno.");
        }
      } catch (error) {
        console.error("Error al obtener los planes de riego:", error);
        if (error.response && (error.response.status === 404 || error.response.status === 401 || error.response.status === 403)) {
          setAllPlanes([]);
          setSelectedPlan(null);
          console.info("No se pudieron cargar planes de riego (posiblemente no existen o no autorizado).");
        } else {
          alert("Error al cargar los planes de riego: " + (error.response?.data?.message || error.message));
        }
      }
    };
    if (userRol !== null) {
      fetchAllPlanesDeRiego();
    }
  }, [userRol, selectedPlan]);

  useEffect(() => {
    const fetchEventsForDate = async () => {
      if (!selectedPlan || !selectedPlan.id) {
        setEvents([]);
        setFilteredEvents([]);
        return;
      }

      try {
        const token = getAuthToken();
        // Al obtener eventos, enviamos el rango del mes en UTC para una consulta precisa
        // Date.UTC(year, month, day) creates a date in UTC
        const currentMonthStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
        const currentMonthEnd = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999));


        const response = await axiosInstance.get(`/calendario/allplanDia`, {
          params: {
            fechaInicio: currentMonthStart.toISOString(),
            fechaFin: currentMonthEnd.toISOString(),
            idPlan: selectedPlan.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedEvents = response.data.map(event => ({
          ...event,
          // Al recibir del backend, la fecha ya debería estar en UTC si se guardó así.
          // new Date() la convertirá a la zona horaria local para mostrarla correctamente.
          // We will use UTC getters for comparison later.
          fechaDia: new Date(event.fechaDia)
        }));

        setEvents(fetchedEvents);
        setFilteredEvents(fetchedEvents.filter(event =>
          // Compare UTC components of event.fechaDia with local components of 'date'
          event.fechaDia.getUTCFullYear() === date.getFullYear() &&
          event.fechaDia.getUTCMonth() === date.getMonth() &&
          event.fechaDia.getUTCDate() === date.getDate()
        ));
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setEvents([]);
          setFilteredEvents([]);
          console.info("No hay eventos para el rango de fechas especificado para este plan (404 Not Found).");
        } else {
          console.error("Error al obtener eventos para la fecha:", error);
          alert("Error al obtener eventos para la fecha: " + (error.response?.data?.message || error.message));
        }
      }
    };
    fetchEventsForDate();
  }, [date, selectedPlan]);

  const handleDateSelect = (selectedDate) => {
    const newSelectedDate = new Date(selectedDate); // This is a local Date object
    setDate(newSelectedDate);
    const eventsOnSelectedDate = events.filter(
      (event) =>
        // Compare UTC components of event.fechaDia with local components of newSelectedDate
        event.fechaDia.getUTCFullYear() === newSelectedDate.getFullYear() &&
        event.fechaDia.getUTCMonth() === newSelectedDate.getMonth() &&
        event.fechaDia.getUTCDate() === newSelectedDate.getDate()
    );
    setFilteredEvents(eventsOnSelectedDate);
    setShowModal(true);
    // Al establecer eventData.start/end para el formulario, creamos una fecha que representa el inicio del día en UTC
    const selectedDateUTC = new Date(Date.UTC(newSelectedDate.getFullYear(), newSelectedDate.getMonth(), newSelectedDate.getDate()));
    setEventData({
      ...eventData,
      start: selectedDateUTC.toISOString(), // Send full ISO string (e.g., "2025-07-13T00:00:00.000Z")
      end: selectedDateUTC.toISOString(),   // Send full ISO string
    });
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setEventData({
      title: event.titulo,
      // Al cargar para edición, la fecha ya viene del backend (UTC) y es interpretada localmente.
      // Para el input type="date", necesitamos YYYY-MM-DD.
      // event.fechaDia is already a Date object from the map, which has local timezone applied.
      // We need to get the YYYY-MM-DD string that represents the *local* date.
      start: event.fechaDia.toISOString().split("T")[0], // This will give YYYY-MM-DD based on local interpretation
      end: event.fechaDia.toISOString().split("T")[0],   // This will give YYYY-MM-DD based on local interpretation
      color: event.color,
      id: event.id,
    });
    setFormType('update');
    setShowForm(true);
  };

  const handleAddEventClick = () => {
    // Al abrir el formulario de creación, la fecha se basa en la fecha actual del calendario (local)
    // Convertimos a UTC para almacenar consistentemente.
    const currentDateUTC = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    setEventData({
      title: "",
      start: currentDateUTC.toISOString(), // Send full ISO string
      end: currentDateUTC.toISOString(),
      color: predefinedColors.green, // Color por defecto al crear (ej. verde)
      id: null,
    });
    setFormType('create');
    setShowForm(true);
  };

  const createEvent = async () => {
    if (!selectedPlan || !selectedPlan.id) {
      alert("Por favor, selecciona o crea un Plan de Riego antes de añadir eventos.");
      return;
    }
    if (!eventData.title || !eventData.start || !eventData.color) {
      alert("Por favor, completa todos los campos para el evento.");
      return;
    }

    try {
      const token = getAuthToken();
      // eventData.start ya es un ISO string representando el inicio del día en UTC.
      // Lo pasamos directamente a new Date() para que Prisma lo maneje.
      const response = await axiosInstance.post(`/calendario/createDiaPlan/${selectedPlan.id}`, {
        fechaDia: eventData.start, // Send the precise UTC ISO string
        titulo: eventData.title,
        color: eventData.color,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        alert("Evento creado con éxito");
        setShowModal(false);
        const currentMonthStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
        const currentMonthEnd = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999));

        const updatedEventsResponse = await axiosInstance.get(`/calendario/allplanDia`, {
          params: {
            fechaInicio: currentMonthStart.toISOString(),
            fechaFin: currentMonthEnd.toISOString(),
            idPlan: selectedPlan.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const updatedEvents = updatedEventsResponse.data.map(event => ({
          ...event,
          fechaDia: new Date(event.fechaDia) // Parse UTC string, will convert to local for display
        }));
        setEvents(updatedEvents);
        setFilteredEvents(updatedEvents.filter(event =>
          event.fechaDia.getUTCFullYear() === date.getFullYear() &&
          event.fechaDia.getUTCMonth() === date.getMonth() &&
          event.fechaDia.getUTCDate() === date.getDate()
        ));
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error al crear el evento:", error);
      alert("Error al crear el evento: " + (error.response?.data?.message || error.message));
    }
  };

  const updateEvent = async () => {
    if (!eventData.id) return;
    if (!eventData.title || !eventData.start || !eventData.color) {
      alert("Por favor, completa todos los campos para actualizar el evento.");
      return;
    }
    try {
      const token = getAuthToken();
      // eventData.start ya es un ISO string representando el inicio del día en UTC.
      const response = await axiosInstance.put(`/calendario/actualizarPlanDia/${eventData.id}`, {
        fechaDia: eventData.start, // Send the precise UTC ISO string
        titulo: eventData.title,
        color: eventData.color,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        alert("Evento actualizado con éxito");
        setShowModal(false);
        const currentMonthStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
        const currentMonthEnd = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999));

        const updatedEventsResponse = await axiosInstance.get(`/calendario/allplanDia`, {
          params: {
            fechaInicio: currentMonthStart.toISOString(),
            fechaFin: currentMonthEnd.toISOString(),
            idPlan: selectedPlan.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const updatedEvents = updatedEventsResponse.data.map(event => ({
          ...event,
          fechaDia: new Date(event.fechaDia)
        }));
        setEvents(updatedEvents);
        setFilteredEvents(updatedEvents.filter(event =>
          event.fechaDia.getUTCFullYear() === date.getFullYear() &&
          event.fechaDia.getUTCMonth() === date.getMonth() &&
          event.fechaDia.getUTCDate() === date.getDate()
        ));
        setShowForm(false);
      }
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
      alert("Error al actualizar el evento: " + (error.response?.data?.message || error.message));
    }
  };

  const deleteEvent = async (diaPlanId) => {
    try {
      const token = getAuthToken();
      const response = await axiosInstance.delete(
        `/calendario/deletePlanDia/${diaPlanId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        alert("Evento eliminado con éxito");
        setShowModal(false);
        const currentMonthStart = new Date(Date.UTC(date.getFullYear(), date.getMonth(), 1));
        const currentMonthEnd = new Date(Date.UTC(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999));

        try {
          const updatedEventsResponse = await axiosInstance.get(`/calendario/allplanDia`, {
            params: {
              fechaInicio: currentMonthStart.toISOString(),
              fechaFin: currentMonthEnd.toISOString(),
              idPlan: selectedPlan.id,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const updatedEvents = updatedEventsResponse.data.map(event => ({
            ...event,
            fechaDia: new Date(event.fechaDia)
          }));
          setEvents(updatedEvents);
          setFilteredEvents(updatedEvents.filter(event =>
            event.fechaDia.getUTCFullYear() === date.getFullYear() &&
            event.fechaDia.getUTCMonth() === date.getMonth() &&
            event.fechaDia.getUTCDate() === date.getDate()
          ));
        } catch (reloadError) {
          if (reloadError.response && reloadError.response.status === 404) {
            setEvents([]);
            setFilteredEvents([]);
            console.info("No hay más eventos para el rango de fechas especificado después de la eliminación (404 Not Found).");
          } else {
            console.error("Error al recargar eventos después de eliminar:", reloadError);
          }
        }
      } else {
        alert("Error al eliminar el evento: " + (response.data.message || "Desconocido"));
      }
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
      alert("Error al eliminar el evento: " + (error.response?.data?.message || error.message));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePlan = async () => {
    if (!newPlanTitle || !newPlanStartDate || !newPlanEndDate) {
      alert("Por favor, completa todos los campos para el nuevo Plan de Riego.");
      return;
    }
    try {
      const token = getAuthToken();
      const response = await axiosInstance.post("/calendario/createCalendario", {
        titulo: newPlanTitle,
        inicio: new Date(newPlanStartDate).toISOString(),
        fin: new Date(newPlanEndDate).toISOString(),
        idInforme: selectedInformeId || null
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        alert("Plan de Riego creado exitosamente!");
        setShowCreatePlanForm(false);
        setNewPlanTitle("");
        setNewPlanStartDate("");
        setNewPlanEndDate("");
        const updatedPlanesResponse = await axiosInstance.get("/calendario/getPlanDeRiego", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllPlanes(updatedPlanesResponse.data);
        if (updatedPlanesResponse.data.length > 0 && !selectedPlan) {
          setSelectedPlan(updatedPlanesResponse.data[0]);
        }
      } else {
        alert("Error al crear el Plan de Riego: " + (response.data.message || "Desconocido"));
      }
    } catch (error) {
      console.error("Error al crear el Plan de Riego:", error);
      alert("Error al crear el Plan de Riego: " + (error.response?.data?.message || error.message));
    }
  };

  const handlePlanSelection = (plan) => {
    setSelectedPlan(plan);
  };

  useEffect(() => {
    const fetchInformes = async () => {
      try {
        const token = getAuthToken();
        const response = await axiosInstance.get("http://localhost:3000/informe/lista", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("informes", response.data);

        if (response.status === 200 && Array.isArray(response.data.informes)) {
          setInformesDisponibles(response.data.informes);
        } else {
          console.warn("No se recibieron informes válidos");
        }
      } catch (error) {
        console.error("Error al cargar los informes:", error);
        alert("Error al cargar los informes: " + (error.response?.data?.message || error.message));
      }
    };

    fetchInformes();
  }, []);
  return (
    <div className="calendario-container">
      <Header />
      <Auth setUserRol={setUserRol} />
      <div className="Container">

        {userRol === 'admin' && (
          <div className="planesRiegoContainer">
            <h2>Gestión de Planes de Riego</h2>

            {!selectedPlan && allPlanes.length === 0 && (
              <p className="no-plan-message">
                No hay Planes de Riego existentes. Por favor, crea uno para empezar a añadir eventos.
              </p>
            )}

            <button
              onClick={() => setShowCreatePlanForm(!showCreatePlanForm)}
              className="boton-toggle-plan-form"
            >
              {showCreatePlanForm ? "Cerrar Formulario de Plan" : "Crear Nuevo Plan de Riego"}
            </button>

          {showCreatePlanForm && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Crear Nuevo Plan de Riego</h3>

      <input
        type="text"
        placeholder="Título del Plan"
        value={newPlanTitle}
        onChange={(e) => setNewPlanTitle(e.target.value)}
        className="input-estilizado"
      />

      <label>Fecha de Inicio:</label>
      <input
        type="date"
        value={newPlanStartDate}
        onChange={(e) => setNewPlanStartDate(e.target.value)}
        className="input-estilizado"
      />

      <label>Fecha de Fin:</label>
      <input
        type="date"
        value={newPlanEndDate}
        onChange={(e) => setNewPlanEndDate(e.target.value)}
        className="input-estilizado"
      />

      <label>Informe Vinculado:</label>
      <select
        value={selectedInformeId}
        onChange={(e) => setSelectedInformeId(e.target.value)}
        className="input-estilizado"
      >
        <option value="">-- Seleccionar Informe --</option>
        {informesDisponibles.map((informe) => (
          <option key={informe.id} value={informe.id}>
            {informe.titulo || informe.nombre || `Informe #${informe.id}`}
          </option>
        ))}
      </select>

      <div className="modal-buttons-horizontal">
        <button onClick={handleCreatePlan} className="boton boton-verde">
          Guardar Plan de Riego
        </button>
        <button
          type="button"
          onClick={() => setShowCreatePlanForm(false)}
          className="boton boton-rojo"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
)}

            {allPlanes.length > 0 && (
              <div className="existing-plans">
                <h3>Planes de Riego Existentes:</h3>
                <div role="group" className="plan-buttons-group">
                  {allPlanes.map(plan => (
                    <button
                      key={plan.id}
                      className={`plan-item-button ${selectedPlan && selectedPlan.id === plan.id ? 'selected-plan-item' : ''}`}
                      onClick={() => handlePlanSelection(plan)}
                    >
                      {plan.titulo}
                      {selectedPlan && selectedPlan.id === plan.id && <span className="current-plan-indicator">(Activo)</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="calendarioContainer">
          <Calendar
            onChange={setDate}
            value={date}
            locale={es}
            onClickDay={handleDateSelect}
            tileContent={({ date, view }) => {
              if (view === "month") {
                const dayEvents = events.filter(
                  (event) => {
                    const eventDate = event.fechaDia instanceof Date ? event.fechaDia : new Date(event.fechaDia);
                    return (
                      eventDate.getUTCFullYear() === date.getFullYear() &&
                      eventDate.getUTCMonth() === date.getMonth() &&
                      eventDate.getUTCDate() === date.getDate()
                    );
                  }
                );
                return dayEvents.length > 0 ? (
                  <div className="event-marker-container">
                    {dayEvents.map((event, idx) => (
                      <div
                        key={idx}
                        className="event-marker"
                        style={{ backgroundColor: event.color }}
                        title={event.titulo}
                      >
                        <span className="event-title">{event.titulo}</span>
                      </div>
                    ))}
                  </div>
                ) : null;
              }
              return null;
            }}
          />
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Eventos en {date.toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
                <button className="close-button" onClick={() => setShowModal(false)}>X</button>
              </div>
              <div className="modal-body">
                {selectedPlan ? (
                  <p>Plan de Riego Seleccionado: <strong>{selectedPlan.titulo || `ID: ${selectedPlan.id}`}</strong></p>
                ) : (
                  <p className="error-message">No hay un Plan de Riego seleccionado. Por favor, crea uno en la sección de "Gestión de Planes de Riego".</p>
                )}

                {filteredEvents.length > 0 ? (
                  <ul>
                    {filteredEvents.map((event) => (
                      <li key={event.id} className="event-list-item" style={{ backgroundColor: event.color, color: '#fff' }}>
                        <span>{event.titulo}</span>
                        {userRol === 'admin' && (
                          <div className="event-actions">
                            <button className="boton-actualizar" onClick={() => handleEventClick(event)}>
                              Actualizar
                            </button>
                            <button
                              className="boton-eliminar"
                              onClick={() => deleteEvent(event.id)}
                            >
                              Eliminar
                            </button>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No hay eventos para esta fecha.</p>
                )}

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
                      {Object.entries(predefinedColors).map(([name, hex]) => (
                        <button
                          key={name}
                          type="button"
                          className={`color-option ${eventData.color === hex ? 'selected' : ''}`}
                          style={{ backgroundColor: hex }}
                          onClick={() => setEventData(prev => ({ ...prev, color: hex }))}
                          title={name}
                        >
                          {eventData.color === hex && '✓'}
                        </button>
                      ))}
                    </div>
                    <button type="button" className="boton" onClick={createEvent}>
                      Guardar Evento
                    </button>
                    <button type="button" className="boton-cancelar" onClick={() => setShowForm(false)}>
                      Cerrar Formulario
                    </button>
                  </form>
                )}

                {showForm && formType === 'update' && selectedEvent && (
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
                      {Object.entries(predefinedColors).map(([name, hex]) => (
                        <button
                          key={name}
                          type="button"
                          className={`color-option ${eventData.color === hex ? 'selected' : ''}`}
                          style={{ backgroundColor: hex }}
                          onClick={() => setEventData(prev => ({ ...prev, color: hex }))}
                          title={name}
                        >
                          {eventData.color === hex && '✓'}
                        </button>
                      ))}
                    </div>
                    <button type="button" className="boton" onClick={updateEvent}>
                      Actualizar Evento
                    </button>
                    <button type="button" className="boton-cancelar" onClick={() => setShowForm(false)}>
                      Cerrar Formulario
                    </button>
                  </form>
                )}

                <button onClick={() => { setFormType('create'); setShowForm(true); setEventData({ ...eventData, title: '', color: predefinedColors.green, id: null }); }} className="boton-agregar-evento">
                  Agregar Evento
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Calendario;

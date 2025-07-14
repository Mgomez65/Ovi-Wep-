import { useState, useEffect } from 'react';
import axios from 'axios';
import './calendarioHome.css';

const Calendario = ({ hideHeader }) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null); // Nuevo estado para el ID del plan seleccionado
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:3000',
  });

  // Efecto para cargar el primer plan de riego disponible
  useEffect(() => {
    const fetchFirstPlan = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Token JWT no encontrado");
        }
        const response = await axiosInstance.get("/calendario/getPlanDeRiego", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.length > 0) {
          setSelectedPlanId(response.data[0].id); // Seleccionar el ID del primer plan
        } else {
          console.info("No hay planes de riego disponibles para cargar eventos en el Home.");
          setSelectedPlanId(null); // Asegurarse de que no haya un plan seleccionado
        }
      } catch (err) {
        console.error("Error al obtener el primer plan de riego:", err);
        setError("Error al cargar los planes de riego.");
        setSelectedPlanId(null);
      } finally {
        setLoading(false);
      }
    };
    fetchFirstPlan();
  }, []); // Se ejecuta solo una vez al montar el componente

  // Efecto para cargar los eventos una vez que se tiene un plan seleccionado
  useEffect(() => {
    const fetchEvents = async () => {
      if (selectedPlanId === null) {
        setEvents([]); // Si no hay plan seleccionado, no hay eventos
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error("Token JWT no encontrado");
        }

        // Obtener el inicio y fin del día actual en UTC
        const today = new Date();
        const startOfDayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
        const endOfDayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));

        const response = await axiosInstance.get(
          "/calendario/allPlanDia",
          {
            params: { // Enviar como query parameters
              fechaInicio: startOfDayUTC.toISOString(),
              fechaFin: endOfDayUTC.toISOString(),
              idPlan: selectedPlanId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Formatear la respuesta para su uso en el calendario
        setEvents(
          response.data.map((event) => ({
            id: event.id,
            title: event.titulo,
            start: new Date(event.fechaDia), // Convertir a objeto Date
            color: event.color || "#000000",
          }))
        );
      } catch (err) {
        console.error("Error al obtener los eventos:", err);
        if (err.response && err.response.status === 404) {
          setEvents([]); // No hay eventos para hoy, no es un error crítico
          console.info("No hay eventos para la fecha actual en este plan.");
        } else {
          setError("Error al cargar los eventos: " + (err.response?.data?.message || err.message));
          setEvents([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [date, selectedPlanId]); // Dependencia de selectedPlanId para recargar cuando se obtiene

  if (loading) {
    return <div className="calendario-container1"><p>Cargando eventos...</p></div>;
  }

  if (error) {
    return <div className="calendario-container1"><p className="error-message">Error: {error}</p></div>;
  }

  return (
    <div className="calendario-container1">
      <div className="calendario1">
        <div className="week-view">
            <div className="day-tile">
            <h3>
              {date.toLocaleDateString("es", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </h3>
            <ul>
              {events.length > 0 ? (
                events.map((event, index) => (
                  <li key={index} style={{ backgroundColor: event.color }}>
                    {event.title}
                  </li>
                ))
              ) : (
                <li>No hay tareas para hoy</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendario;

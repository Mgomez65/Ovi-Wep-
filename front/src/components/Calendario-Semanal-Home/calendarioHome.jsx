import { useState, useEffect } from 'react';
import axios from 'axios';
import './calendarioHome.css';

const Calendario = ({ hideHeader }) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthToken = () => localStorage.getItem('token');

  const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:3000',
  });

  // 🔄 Cargar eventos de todos los planes para el día actual
  useEffect(() => {
    const fetchAllEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = getAuthToken();
        if (!token) throw new Error("Token JWT no encontrado");

        // 1. Obtener todos los planes
        const plansRes = await axiosInstance.get("/calendario/getPlanDeRiego", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const plans = plansRes.data || [];
        if (plans.length === 0) {
          setEvents([]);
          return;
        }

        // 2. Obtener el inicio y fin del día en UTC
        const today = new Date();
        const startOfDayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0));
        const endOfDayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999));

        // 3. Para cada plan, obtener tareas del día
        const allEvents = [];

        for (const plan of plans) {
          try {
            const response = await axiosInstance.get("/calendario/allPlanDia", {
              params: {
                fechaInicio: startOfDayUTC.toISOString(),
                fechaFin: endOfDayUTC.toISOString(),
                idPlan: plan.id,
              },
              headers: { Authorization: `Bearer ${token}` },
            });

            const eventos = response.data.map((event) => ({
              id: event.id,
              title: `${event.titulo} (Plan: ${plan.titulo})`,
              start: new Date(event.fechaDia),
              color: event.color || "#000000",
            }));

            allEvents.push(...eventos);
          } catch (errorPlan) {
            // Si el plan no tiene eventos, no es un error crítico
            if (errorPlan?.response?.status !== 404) {
              console.error(`Error cargando eventos para el plan ${plan.titulo}:`, errorPlan);
            }
          }
        }

        setEvents(allEvents);
      } catch (err) {
        console.error("Error general al cargar eventos:", err);
        setError("No se pudieron cargar las tareas del día.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvents();
  }, [date]);

  // 🖼 Render
  if (loading) {
    return <div className="calendario-container1"><p>Cargando tareas del día...</p></div>;
  }

  if (error) {
    return <div className="calendario-container1"><p className="error-message">Error: {error}</p></div>;
  }

  return (
    <div className="calendario-container1">
      <div className="calendario1">
        <div className="week-view">
          <div className="day-tile">
           <h3 className="day-title">
  {new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
    .format(date)
    .replace(/^./, (str) => str.toUpperCase())}
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

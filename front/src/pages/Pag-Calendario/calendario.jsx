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
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
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

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  // Plan de riego
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    inicio: "",
    fin: "",
    idInforme: 0,
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

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const createOrUpdatePlan = async () => {
    try {
      const dataToSend = {
        titulo: formData.titulo || "",
        inicio: new Date(formData.inicio),
        fin: new Date(formData.fin),
        idInforme: parseInt(formData.idInforme),
      };

      if (selectedPlan) {
        await axios.put(
          `http://localhost:3000/calendario/actualizarCalendario/${selectedPlan}`,
          dataToSend
        );
      } else {
        await axios.post(
          "http://localhost:3000/calendario/createCalendario",
          dataToSend
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
      setSelectedPlan(null);
    } catch (error) {
      console.error("Error al guardar el plan:", error);
    }
  };

  const deletePlan = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/calendario/deletePlanDia/${id}`
      );
      fetchPlans();
    } catch (error) {
      console.error("Error al eliminar el plan:", error);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan.id);
    setFormData({
      titulo: plan.titulo,
      inicio: plan.inicio,
      fin: plan.fin,
      idInforme: plan.idInforme || 0,
    });
    setShowForm(true);
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
                    <li key={plan.id} className="PlanRiegoLI">
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
                  <li>No hay planes disponibles</li>
                )}
              </ul>
            </div>
          </div>
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

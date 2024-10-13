import React, { useState, useEffect } from "react";
import axios from "axios";
import iconoEliminar from "../../assets/icon-eliminar.png";
/* import iconoEditar from "../../assets/icon-editar.png"; */
import './planRiego.css'

const PlanesDeRiego = ({ onPlanSelect }) => {
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

  const createPlan = async () => {
    try {
      const planToSend = {
        titulo: formData.titulo,
        inicio: new Date(formData.inicio),
        fin: new Date(formData.fin),
        idInforme: formData.idInforme,
      };

      await axios.post(
        "http://localhost:3000/calendario/createCalendario",
        planToSend
      );

      fetchPlans();
      resetForm();
    } catch (error) {
      console.error("Error al agregar el plan:", error);
    }
  };

  const updatePlan = async () => {
    try {
      const planToSend = {
        titulo: formData.titulo,
        inicio: new Date(formData.inicio),
        fin: new Date(formData.fin),
        idInforme: formData.idInforme,
      };

      await axios.put(
        `http://localhost:3000/calendario/actualizarCalendario/${selectedPlan}`,
        planToSend
      );

      fetchPlans();
      resetForm();
    } catch (error) {
      console.error("Error al actualizar el plan:", error);
    }
  };

  const deletePlan = async (id) => {
    try {
      await axios.delete(
        `http://localhost:3000/calendario/deleteCalendario/${id}`
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
      idInforme: plan.idInforme,
    });
    setShowForm(true);
    onPlanSelect(plan.id); // Notificar al componente padre sobre la selección del plan
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      titulo: "",
      inicio: "",
      fin: "",
      idInforme: 0,
    });
    setSelectedPlan(null);
  };

  const handleShowEvents = (plan) => {
    handlePlanSelect(plan); // Llama a la función de selección de plan
    onPlanSelect(plan.id); // Envía el ID del plan al componente de calendario
};

  return (
    <div className="planesRiegoContainer">
      <h2>Planes de Riego</h2>
      <div>
        <div className="irrigation-plan">
          <button
            onClick={() => {
              setShowForm(true); // Asegúrate de que esto se ejecute
              setSelectedPlan(null); // Asegúrate de limpiar la selección
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
                {selectedPlan ? "Editar Plan de Riego" : "Crear Plan de Riego"}
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
              <button
                onClick={selectedPlan ? updatePlan : createPlan}
                className="botonAgregar"
              >
                {selectedPlan ? "Actualizar" : "Guardar"}
              </button>
              <button onClick={resetForm} className="botonCerrar">
                Cancelar
              </button>
            </div>
          )}
          <ul className="planRiegoUL">
            {plans.map((plan) => (
              <li
                key={plan.id}
                className="PlanRiegoLI"
                onClick={() => handlePlanSelect(plan)}
              >
                <span>{plan.titulo}</span>
                <div className="botonesEliminarActualizar">
                  {/*<button
                    className="botonEditar"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePlanSelect(plan);
                    }}
                  >
                    <img src={iconoEditar} alt="Editar" className="Editar" />
                  </button>*/}
                  <button
                    className="botonEliminar"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePlan(plan.id);
                    }}
                  >
                    <img
                      src={iconoEliminar}
                      alt="Eliminar"
                      className="Eliminar"
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlanesDeRiego;

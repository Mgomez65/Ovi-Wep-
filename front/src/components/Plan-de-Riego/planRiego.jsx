import { useState, useEffect } from "react";
import axios from "axios";
import iconoEliminar from "../../assets/icon-eliminar.png";
import Auth from '../Auth-Admin/Auth-Admin';
import './planRiego.css';

const PlanesDeRiego = ({ onPlanSelect }) => {
  const [userRol, setUserRol] = useState(null);
  const [plans, setPlans] = useState([]);
  const [informesDisponibles, setInformesDisponibles] = useState([]); // Agregar estado para los informes
  const [selectedInforme, setSelectedInforme] = useState(" "); // Para guardar el informe seleccionado
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

  const fetchInformes = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/informe/search",
        { searchTerm: "" }
      );
      // Filtrar los informes para que solo se muestren los que no tienen un plan asignado
      const informesFiltrados = response.data.filter(informe => 
        !plans.some(plan => plan.idInforme === informe.id)
      );
      setInformesDisponibles(informesFiltrados);
    } catch (error) {
      console.error("Error al obtener los informes:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchInformes(); // Llamar a fetchInformes para obtener los informes
  }, [plans]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'idInforme' && value) {
      setSelectedInforme(value);  // Asegúrate de que selectedInforme tenga un valor válido
    }
  };

  const createPlan = async () => {
    try {
      const planToSend = {
        titulo: formData.titulo,
        inicio: new Date(formData.inicio),
        fin: new Date(formData.fin),
        idInforme: selectedInforme, // Usar el informe seleccionado
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
        idInforme: selectedInforme, // Usar el informe seleccionado
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
    onPlanSelect(plan.id);
  };

  const resetForm = () => {
    setShowForm(false);
    setFormData({
      titulo: "",
      inicio: "",
      fin: "",
      idInforme: 0,
    });
    setSelectedInforme("");
    setSelectedPlan(null);
  };

  const handleShowEvents = (plan) => {
    handlePlanSelect(plan);
    onPlanSelect(plan.id);
  };

  return (
    <div className="planesRiegoContainer">
      <h2>Planes de Riego</h2>
      <div>
        <div className="irrigation-plan">
        <Auth setUserRol={setUserRol} />
          {userRol === 'admin' && (
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
          )}
          {showForm && (
            <div className="formulario-editar-evento">
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

              {/* Mostrar la lista de informes disponibles */}
              <select
                name="idInforme"
                onChange={(e) => setSelectedInforme(e.target.value)}
                value={selectedInforme || ""} // Asegúrate de que sea una cadena vacía o "" en lugar de null
              >
                <option value="">Selecciona un informe</option>
                {informesDisponibles.map((informe) => (
                  <option key={informe.id} value={informe.id}>
                    {informe.titulo}
                  </option>
                ))}
              </select>

              <button
                onClick={selectedPlan ? updatePlan : createPlan}
                className="boton"
              >
                {selectedPlan ? "Actualizar" : "Guardar"}
              </button>
              <button onClick={resetForm} className="boton">
                Cancelar
              </button>
            </div>
          )}
          <ul className="planRiegoUL">
            {plans.map((plan) => (
              <div key={plan.id} onClick={() => handlePlanSelect(plan)} className="botonPlanRiegoLi">
                <li className="PlanRiegoLI">
                  <span>{plan.titulo}</span>
                  <div className="botonesEliminarActualizar">
                  {userRol === 'admin' && (
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
                  )}
                  </div>
                </li>
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PlanesDeRiego;

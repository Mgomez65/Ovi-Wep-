import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './planRiego.css';

const IrrigationPlan = () => {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        frequency: '',
    });

    const fetchPlans = async () => {
        try {
            const response = await axios.get('http://localhost:3000/calendario/getPlanDeRiego');
            setPlans(response.data);
        } catch (error) {
            console.error('Error al obtener los planes:', error);
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
            if (selectedPlan) {
                // Editar plan existente
                await axios.put(`URL_DE_TU_API/${selectedPlan}`, formData);
            } else {
                // Crear nuevo plan
                await axios.post('URL_DE_TU_API', formData);
            }
            fetchPlans();
            setShowForm(false);
            setFormData({ name: '', frequency: '' });
            setSelectedPlan(null);
        } catch (error) {
            console.error('Error al guardar el plan:', error);
        }
    };

    const deletePlan = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/calendario/deletePlanDia//${id}`);
            fetchPlans(); 
        } catch (error) {
            console.error('Error al eliminar el plan:', error);
        }
    };

    const handlePlanSelect = (plan) => {
        setSelectedPlan(plan.id);
        setFormData({ name: plan.name, frequency: plan.frequency });
        setShowForm(true);
    };

    return (
        <div className="irrigation-plan">
            <button onClick={() => { 
                setShowForm(true); 
                setSelectedPlan(null);
                setFormData({ name: '', frequency: '' });
            }}>
                Crear Plan de Riego
            </button>
            {showForm && (
                <div className="form-notification">
                    <h2>{selectedPlan ? 'Editar Plan de Riego' : 'Crear Plan de Riego'}</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre"
                        value={formData.name}
                        onChange={handleInputChange}
                    />
                    <input
                        type="text"
                        name="frequency"
                        placeholder="Frecuencia"
                        value={formData.frequency}
                        onChange={handleInputChange}
                    />
                    <button onClick={createOrUpdatePlan}>Guardar</button>
                    <button onClick={() => setShowForm(false)}>Cancelar</button>
                </div>
            )}
            <ul>
                {Array.isArray(plans) && plans.length > 0 ? (
                    plans.map((plan) => (
                        <li key={plan.id} onClick={() => handlePlanSelect(plan)}>
                            {plan.inico} - {plan.fin}
                            <button onClick={() => deletePlan(plan.id)}>Eliminar</button>
                        </li>
                    ))
                ) : (
                    <li>No hay planes disponibles</li>
                )}
            </ul>
            {selectedPlan && <div>Mostrar calendario para el plan seleccionado</div>}
        </div>
    );
};

export default IrrigationPlan;

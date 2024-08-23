
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const addEvento = () => {
    const [evento, setEvento] = useState('');
    const [inicio, setInicio] = useState('');
    const [fin, setFin] = useState('');
    const navigate = useNavigate();

    const handleAddEvento = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:3000/addEvento', {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ evento, inicio, fin }), 
          });
          const data = await response.json();
          alert(data.message);
    
          if (response.ok) {
            navigate('/calendario');
          }
    
        } catch (error) {
          alert('Error al agregar evento: ' + error.message);
        }
    };

    return (
        <div className='register-container'>
            <form onSubmit={handleRegister} className="register-form">
                <h2>Registro</h2>
                <input
                    type="text"
                    placeholder="Evento"
                    value={evento}
                    onChange={(e) => setEvento(e.target.value)}
                    required
                />
                <input
                    type="date"
                    placeholder="Fecha inicio"
                    value={inicio}
                    onChange={(e) => setInicio(e.target.value)}
                    required
                />
                <input
                    type="date"
                    placeholder="Fecha fin"
                    value={fin}
                    onChange={(e) => setFin(e.target.value)}
                    required
                />
                <button type="submit">Guardar evento</button>
            </form>
        </div>
    );
}

export default addEvento();

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { set } from 'react-hook-form';

function Auth({ setUserRol }) {
    const [loading, setLoading] = useState(true); // Estado de carga

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRol = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/users", {
                    withCredentials: true,
                });

                setUserRol('admin');

            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log("No autenticado, redirigiendo a login");
                    setUserRol(null);
                    navigate("/login");
                } else if (error.response && error.response.status === 403) {
                    setUserRol('usuario');
                } else {
                    console.error("Error al verificar el rol del usuario:", error);
                    setUserRol('usuario');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserRol();
    }, [setUserRol, navigate]);
    if (loading) {
        return <div>Loading...</div>; // Puedes mostrar un spinner o mensaje de carga
    }

    return null;
}

export default Auth;

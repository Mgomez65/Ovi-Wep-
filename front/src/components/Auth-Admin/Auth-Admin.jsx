import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Auth({ setUserRol }) {
    const [loading, setLoading] = useState(true); // Estado de carga

    useEffect(() => {
        const fetchUserRol = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/users", {
                    withCredentials: true,
                });

                setUserRol('admin');

            } catch (error) {
                if (error.response && error.response.status === 404) {
                    setUserRol('user');
                } else {
                    setUserRol('user');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserRol();
    }, [setUserRol]);

    return null;
}

export default Auth;

import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import iconoMenu from '../../assets/icon-menu.png'
import './menuDesplegable.css'
import { Link, useNavigate } from 'react-router-dom';
import Auth from '../Auth-Admin/Auth-Admin';

function MenuDesplegable() {
    const [userRol, setUserRol] = useState(null);
    const [estaAbierto, setEstaAbierto] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRol = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/users", {
                    withCredentials: true,
                });
                setUserRol('admin');
            } catch (error) {
                setUserRol('user');
            }
        };

        fetchUserRol();
    }, []);

    const alternarMenu = () => {
        setEstaAbierto(!estaAbierto);
    };

    const cerrarMenuSiClicFuera = (evento) => {
        if (menuRef.current && !menuRef.current.contains(evento.target)) {
            setEstaAbierto(false);
        }
    };

    const cerrarMenuConEscape = (evento) => {
        if (evento.key === 'Escape') {
            setEstaAbierto(false);
        }
    };

    const cerraSecion = async () => {
        const response = await fetch('http://localhost:3000/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        if (response.ok) {
            navigate('/');
        } else {
            alert('Error al cerrar sesión');
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', cerrarMenuSiClicFuera);
        document.addEventListener('keydown', cerrarMenuConEscape);
        return () => {
            document.removeEventListener('mousedown', cerrarMenuSiClicFuera);
            document.removeEventListener('keydown', cerrarMenuConEscape);
        };
    }, []);

    return (
        <div className="menu-desplegable" ref={menuRef}>
            <a className="boton-menu" onClick={alternarMenu}>
                <img src={iconoMenu} alt="Ícono de menú" className="icono-menu" />
            </a>
            {estaAbierto && (
                <ul className="lista-menu">
                    <Auth setUserRol={setUserRol} />
                    {userRol === 'admin' ? (
                        <>
                            <li><Link to="/informe">Informe</Link></li>
                            <li><Link to="/register">Agregar usuario</Link></li>
                            <li><Link to="/estadisticas">Estadisticas</Link></li>
                            <li><Link onClick={cerraSecion}>Cerrar Sesión</Link></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/informe">Informe</Link></li>
                            <li><Link to="/estadisticas">Estadisticas</Link></li>
                            <li><Link onClick={cerraSecion}>Cerrar Sesión</Link></li>
                        </>
                    )}
                </ul>
            )}
        </div>
    );
}

export default MenuDesplegable;

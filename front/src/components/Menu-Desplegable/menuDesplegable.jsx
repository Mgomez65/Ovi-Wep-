import React, { useState, useEffect, useRef } from 'react';
import iconoMenu from '../../assets/icon-menu.png'
import './menuDesplegable.css'
import { Link, useNavigate } from 'react-router-dom';

function MenuDesplegable() {
    const [estaAbierto, setEstaAbierto] = useState(false);
    const menuRef = useRef(null);
    const navigate = useNavigate();

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
                    <li><Link to="/register">Agregar usuario</Link></li>
                    <li><Link onClick={cerraSecion}>Cerrar Seción</Link></li>
                </ul>
            )}
        </div>
    );
}

export default MenuDesplegable;

import React, { useState, useEffect, useRef } from 'react';
import iconoMenu from '../assets/icon-menu.png'
import '../styles/menuDesplegable.css'

function MenuDesplegable() {
    const [estaAbierto, setEstaAbierto] = useState(false);
    const menuRef = useRef(null);

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
                    <li><a href="#opcion1">Opción 1</a></li>
                    <li><a href="#opcion2">Opción 2</a></li>
                    <li><a href="#opcion3">Opción 3</a></li>
                </ul>
            )}
        </div>
    );
}

export default MenuDesplegable;

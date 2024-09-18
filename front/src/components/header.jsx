import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import iconoVolver from "../assets/icon-volver.png";
import Menu from "./menuDesplegable";
import "../styles/header.css";

function Header() {
  const location = useLocation();
  const isInformePage = location.pathname === "/informe";
  const [isSearchMenuVisible, setIsSearchMenuVisible] = useState(false);
  const searchMenuRef = useRef(null);

  const toggleSearchMenu = (event) => {
    event.preventDefault();
    setIsSearchMenuVisible(prevState => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchMenuRef.current &&
        !searchMenuRef.current.contains(event.target) &&
        !event.target.closest('.botonInforme')
      ) {
        setIsSearchMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <Link to="/home">
        <img src={iconoVolver} alt="Volver" className="Volver" />
      </Link>
      <div className="header">
        {isInformePage ? (
          <>
            <a
              href="#"
              className="botonInforme"
              onClick={toggleSearchMenu}
            >
              {isSearchMenuVisible ? "Cerrar Informe" : "Ver Informe"}
            </a>
            {isSearchMenuVisible && (
              <div className="searchMenu" ref={searchMenuRef}>
                <input type="text" placeholder="Buscar..." />
                <button>Buscar</button>
              </div>
            )}
          </>
        ) : (
          <Link to="/informe" className="botonInforme">
            Informe
          </Link>
        )}
        <Menu className="Menu" />
      </div>
    </header>
  );
}

export default Header;

import { Link } from 'react-router-dom';
import iconoVolver from '../assets/icon-volver.png';
import Menu from './menuDesplegable'
import "../styles/header.css";

function Header() {
  return (
    <header className="header">
      <Link to="/home">
        <img src={iconoVolver} alt="Volver" className="Volver" />
      </Link>
      <div className="header">
        <Link to="/informe" className="botonInforme">
          Informe
        </Link>
        <Menu className="Menu" />
      </div>
    </header>
  );
}

export default Header;

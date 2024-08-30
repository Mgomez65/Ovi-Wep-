import iconoVolver from '../assets/icon-volver.png';
import Menu from '../components/menuDesplegable'
import "../styles/header.css";

function Header() {
  return (
    <header className="header">
      <a href="#">
        <img src={iconoVolver} alt="Volver" className="Volver" />
      </a>
      <div className="header">
        <a href="#" className="botonInforme">
          Informe
        </a>
        <Menu className="Menu" />
      </div>
    </header>
  );
}

export default Header;

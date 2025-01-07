import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

function Footer() {
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="footer">
      <div className="seccionFooter">
        <span>
          <p className="contacto">Contacto:</p>
          <span className="contacto">
            <p className="footer-correo">info@ovi.com</p>
            <p>Tel: +123 456 789</p>
          </span>
        </span>
      </div>

      <img src="/Logo-Ovi.png" alt="Logo" className="logo"/>

      <div className="containerSeccion2">

        <div className="footer-section">
          <nav>
            <Link onClick={() => openInNewTab('/about')} className="footer-link">Sobre Nosotros</Link>
            <Link onClick={() => openInNewTab('/terminos-y-condiciones')} className="footer-link">Términos y Condiciones</Link>
            <Link onClick={() => openInNewTab('/politicas-de-privacidad')} className="footer-link">Política de Privacidad</Link>
          </nav>
        </div>
      </div>
      
    </footer>
  );
}
export default Footer;

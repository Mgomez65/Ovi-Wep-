import { Link } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <footer className="footer">{/* 
      <section className="seccionFooter">Ovi</section> */}
      <div className="seccionFooter">
          <p>
            <p className="tituloContacto">Contacto:</p>
            <p className="footer-correo">
              info@ovi.com
            </p>
            Tel: +123 456 789
          </p>
        </div>

      <div className="containerSeccion2">

        <div className="footer-section">
          <nav>
            <Link onClick={() => openInNewTab('/about')} className="footer-link">Sobre Nosotros</Link>
            <Link onClick={() => openInNewTab('/terminos-y-condiciones')} className="footer-link">Términos y Condiciones</Link>
            <Link onClick={() => openInNewTab('/politicas-de-privacidad')} className="footer-link">Política de Privacidad</Link>
          </nav>
        </div>


        <div className="footer-section">
          <p>© 2024 Ovi S.A.S. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;

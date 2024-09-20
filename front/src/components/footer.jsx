import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">
      <section className="seccionFooter">Ovi</section>
      {/* Créditos y Derechos Reservados */}
      <div className="footer-section">
        <p>© 2024 OVI S.A.S. Todos los derechos reservados.</p>
      </div>

      {/* Enlaces Importantes */}
      <div className="footer-section">
        <nav>
          <a href="/about" className="footer-link">Sobre Nosotros</a>
          <a href="/terms" className="footer-link">Términos y Condiciones</a>
          <a href="/privacy" className="footer-link">Política de Privacidad</a>
        </nav>
      </div>

      {/* Información de Contacto */}
      <div className="footer-section">
        <p>Contacto: <a href="mailto:info@ovi.com" className="footer-link">info@ovi.com</a> | Tel: +123 456 789</p>
      </div>
    </footer>
  );
}
export default Footer;

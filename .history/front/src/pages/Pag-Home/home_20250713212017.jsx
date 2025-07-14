import Clima from "../../components/Clima-Home/datosClimaticos";
import Calendario from "../../components/Calendario-Semanal-Home/calendarioHome";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import Termometro from "../../components/Datos-Humedad-Home/datosHumedad";
import Mapa from "../../components/Mapa/mapa";
import { Link } from "react-router-dom";
import "./home.css";

const Home = () => {
  return (
    <div className="home">
      <Header />
      <main className="main-content">
        <div className="contenedorClimaCalendario">
          <div className="clima-container">
            <Clima />
          </div>
          <Link to="/calendario" className="calendario-link">
            <Calendario />
          </Link>
        </div>
        <div className="datosHumedad">
          <h3 className="tituloHumedad">Datos de la humedad en general:</h3>
          <div className="termometro">
            <Termometro />
          </div>
        </div>
        <div className="mapa-container">
          <Mapa />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
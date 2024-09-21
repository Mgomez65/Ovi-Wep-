import React from "react";
import Clima from "../components/datosClimaticos";
import Calendario from "../components/calendarioHome";
import Header from "../components/header";
import Footer from "../components/footer";
import Termometro from "../components/datosHumedad"
import { Link } from "react-router-dom";
import "../styles/home.css";

const Home = () => {
  return (
    <div>
      <Header />
      <main className="main">
        <div className="contenedorClimaCalendario">
          <div>
            <Clima className="clima" />
          </div>
          <Link to="/calendario" className="calendario">
            <Calendario className="CalendarioHome" />
          </Link>
        </div>
        <div className="datosHumedad">
          <h3 className="tituloHumedad">Datos de la humedad en general:</h3>
          <div className="termometro">
            <Termometro/>
          </div>
        </div>
        <div>
          <h3 className="mapa">
            Mapa:
            En proceso
          </h3>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Home;

import React from "react";
import Clima from '../components/datosClimaticos'
import Calendario from '../components/calendarioHome'
import Menu from '../components/menuDesplegable'
import '../styles/home.css'
import iconoVolver from '../assets/icon-volver.png';

const Home = () => {
    return (
        <div>
            <header className="header">
                <a href="#"><img src={iconoVolver} alt="Volver" className="Volver"/></a>
                <div className="header">
                    <a href="#" className="botonInforme">Informe</a>
                    <Menu className="Menu"/>
                </div>
            </header>
            <main className="main">
                <div className="contenedorClimaCalendario">
                    <div>
                        <Clima className="clima"/>
                    </div>
                    <div>
                        <Calendario className="CalendarioHome"/>
                    </div>   
                </div>
                <div>
                    <h3 className="humedad">Datos de humedad<br/>En proceso</h3>
                </div>
                <div>
                    <h3 className="mapa">Mapa<br/>En proceso</h3>
                </div>
            </main>
            <footer className="footer">
                <section className="seccionFooter">Ovi</section>
            </footer>
        </div>
    )
};

export default Home;

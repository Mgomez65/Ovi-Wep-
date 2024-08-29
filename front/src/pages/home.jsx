import React from "react";
import Clima from '../components/datosClimaticos'
import Calendario from '../components/calendarioHome'
import '../styles/home.css'

const Home = () => {
    return (
        <div>
            <header className="header">
                <section className="tituloHeader">Ovi</section>
            </header>
            <main className="main">
                <div>
                    <Clima className="clima"/>
                </div>
                <div>
                    <Calendario className="CalendarioHome"/>
                </div>
            </main>
            <footer className="footer">
                <section className="seccionFooter">Contactanos</section>
            </footer>
        </div>
    )
};

export default Home;

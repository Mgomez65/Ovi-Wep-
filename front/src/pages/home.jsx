import React from "react";
import Clima from '../components/datosClimaticos'
import Calendario from '../components/calendario'
import '../styles/home.css'

const Home = () => {


    return (
        <div>
            <header className="header">
                <section className="tituloHeader">Ovi</section>
            </header>
            <main className="main">
                <Clima className="clima"/>
                <Calendario/>
            </main>
            <footer className="footer">
                <section className="seccionFooter">Contactanos</section>
            </footer>
        </div>
    )
};

export default Home;
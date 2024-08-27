import React from "react";
import Clima from '../components/datosClimaticos'
import '../styles/home.css'

const Home = () => {


    return (
        <div>
            <header className="header">
                <p className="tituloHeader">OVI</p>
            </header>
            <main className="main">
                <Clima className="clima"/>
            </main>
            <footer className="footer">
                <section className="seccionFooter">Contactanos</section>
                </footer>
        </div>
    )
};

export default Home;
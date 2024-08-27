import React from "react";
import Clima from '../components/datosClimaticos'

const Home = () => {


    return (
        <div>
            <header className="header">OVI</header>
            <main className="main">
                <Clima/>
            </main>
            <footer className="footer">
                <section>Contactanos</section>
            </footer>
        </div>
    )
};

export default Home;
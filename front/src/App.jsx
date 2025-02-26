import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Calendario from "./pages/Pag-Calendario/calendario";
import Home from "./pages/Pag-Home/home";
import Register from "./pages/Vista-de-Usuarios/verUsuario";
import Login from "./pages/Pag-Login/login";
import Informe from "./pages/Pag-Informe/informe";
import Inicio from "./pages/Pag-Index/inicio";
import AboutOVI from "./pages/Informacion-de-Ovi/Sobre-Nosotros/about";
import TermsConditions from "./pages/Informacion-de-Ovi/Terminos-y-Condiciones/terminosCondiciones";
import PrivacyPolicy from "./pages/Informacion-de-Ovi/Politicas-de-Privacidad/politicas";
import Estadisticas from "./pages/Estadisticas/estadisticas";
import "./App.css";

const App = () => {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/calendario" element={<Calendario />} />
          <Route path="/informe" element={<Informe />} />
          <Route path="/" element={<Inicio />} />
          <Route path="/about" element={<AboutOVI />} />
          <Route path="/terminos-y-condiciones" element={<TermsConditions />} />
          <Route path="/politicas-de-privacidad" element={<PrivacyPolicy />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;

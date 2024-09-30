import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendario from './pages/calendario';
import Home from './pages/home';
import Register from './pages/verUsuario'; 
import Login from './pages/login';
import Informe from './pages/informe';
import Inicio from './pages/inicio';
import AboutOVI from './pages/about';
import TermsConditions from './pages/terminosCondiciones';
import PrivacyPolicy from './pages/politicas';
import { ContactUs } from './components/contacto';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/home" element={<Home/>} />
          <Route path="/calendario" element={<Calendario/>} />
          <Route path="/informe" element={<Informe/>} />
          <Route path='/' element={<Inicio/>} />
          <Route path='/about' element={<AboutOVI/>} />
          <Route path='/terminos-y-condiciones' element={<TermsConditions/>} />
          <Route path='/politicas-de-privacidad' element={<PrivacyPolicy/>} />
          
        </Routes>
      </Router>
    </>
  );
};

export default App;

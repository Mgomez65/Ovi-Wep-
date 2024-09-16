import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendario from './pages/calendario';
import Home from './pages/home';
import Register from './pages/verUsuario'; 
import Login from './pages/login';
import Informe from './pages/informe';
import Inicio from './pages/inicio';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/verUsuario" element={<Register />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/home" element={<Home/>} />
          <Route path="/calendario" element={<Calendario/>} />
          <Route path="/informe" element={<Informe/>} />
          <Route path='/' element={<Inicio/>} />
        </Routes>
      </Router>
    </>
  );
};

export default App;

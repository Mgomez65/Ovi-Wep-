import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendario from './pages/calendario';
import Home from './pages/home';
/* import Register from './pages/register'; */
import Login from './pages/login';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/" element={<Login />} /> 
          <Route path="/home" element={<Home/>} />
          <Route path="/calendario" element={<Calendario/>} />
        </Routes>
      </Router>
    </>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calendario from './components/calendario';

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home/>} />
          <Route path="/calendario" element={<Calendario/>} />
        </Routes>
      </Router>
    </>
  );
};

export default App;

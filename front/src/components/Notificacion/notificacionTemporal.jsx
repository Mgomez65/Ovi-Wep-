import React from 'react';
import { useState } from "react";
import "./notificacionTemporal.css";

function ConfirmacionTemporal({ mensaje, onClose, shouldReload }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
    if (shouldReload) {
      window.location.reload();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="cartel-confirmacion">
      <div className="cartel-contenido">
        <p>{mensaje}</p>
        <button onClick={handleClose}>Cerrar</button>
      </div>
    </div>
  );
}

export default ConfirmacionTemporal;

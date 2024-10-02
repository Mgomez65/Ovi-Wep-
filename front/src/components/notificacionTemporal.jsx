import { useEffect, useState } from "react";
import "../styles/notificacionTemporal.css"; // Estilos del cartel

function ConfirmacionTemporal({ mensaje, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose(); // Llama a la función cuando se cierra el cartel
    window.location.reload(); 
  };

  if (!isVisible) {
    return null; // Si no está visible, no se muestra el cartel
  }

  return (
    <div className="cartel-confirmacion">
      <div className="cartel-contenido">
        <p>{mensaje}</p>
        <button onClick={handleClose}>Cerrar</button> {/* Botón para cerrar el cartel */}
      </div>
    </div>
  );
}

export default ConfirmacionTemporal;

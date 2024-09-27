import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import iconoVolver from "../assets/icon-volver.png";
import Menu from "./menuDesplegable";
import "../styles/header.css";

function Header() {
  const location = useLocation();
  const isInformePage = location.pathname === "/informe";
  const [isSearchMenuVisible, setIsSearchMenuVisible] = useState(false);
  const searchMenuRef = useRef(null);

  const [uploadedFiles, setUploadedFiles] = useState([]);

  const toggleSearchMenu = (event) => {
    event.preventDefault();
    setIsSearchMenuVisible((prevState) => !prevState);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchMenuRef.current &&
        !searchMenuRef.current.contains(event.target) &&
        !event.target.closest('.botonInforme')
      ) {
        setIsSearchMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Obtener archivos de la base de datos al cargar el componente
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:3000/informe/users", {
          method: "GET",
          credentials: "include",
        });
        const result = await response.json();
        console.log(result); // Verifica la respuesta
        if (response.ok) {
          setUploadedFiles(result);
        } else {
          console.error("Error al cargar los archivos");
        }
      } catch (error) {
        console.error("Error al cargar los archivos:", error);
      }
    };
    fetchFiles();
  }, []);

  const handleRemoveFile = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:3000/informe/delete/${fileId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId)); // Actualiza el estado local
        setUploadMessage("Archivo eliminado exitosamente");
      } else {
        setUploadMessage("Error al eliminar el archivo");
      }
    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
      setUploadMessage("Error al eliminar el archivo");
    }
  };

  return (
    <header className="header">
      <Link to="/home">
        <img src={iconoVolver} alt="Volver" className="Volver" />
      </Link>
      <div className="header">
        {isInformePage ? (
          <>
            <a
              href="#"
              className="botonInforme"
              onClick={toggleSearchMenu}
            >
              {isSearchMenuVisible ? "Cerrar Informe" : "Ver Informe"}
            </a>
            {isSearchMenuVisible && (
              <div className="searchMenu" ref={searchMenuRef}>
                <input type="text" placeholder="Buscar..." />
                <button>Buscar</button>
                
                {/* Muestra los archivos subidos justo debajo del buscador */}
                <div className="uploaded-files-container">
                  <h2>Archivos Guardados</h2>
                  {uploadedFiles.length > 0 ? (
                    uploadedFiles.map((file) => (
                      <div key={file.id} className="uploaded-file-item">
                        <span>{file.titulo}</span> {/* Muestra el título del archivo */}
                        <button onClick={() => handleUpdateFile(file.id)}>Actualizar</button>
                        <button onClick={() => handleRemoveFile(file.id)}>Eliminar</button>
                      </div>
                    ))
                  ) : (
                    <p>No hay archivos guardados.</p>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <Link to="/informe" className="botonInforme">
            Informe
          </Link>
        )}
        <Menu className="Menu" />
      </div>
    </header>
  );
}

export default Header;

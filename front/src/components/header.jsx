import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import iconoVolver from "../assets/icon-volver.png";
import iconoElimar from "../assets/icon-eliminar.png";
import iconoEditar from "../assets/icon-editar.png";
import iconoBuscar from "../assets/icon-buscar.png";
import Menu from "./menuDesplegable";
import "../styles/header.css";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleUpdateFile = (fileId) => {
    console.log("Navegando a informe con fileId:", fileId);
    navigate(`/informe`, { state: { fileId } });
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://localhost:3000/informe/users", {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      console.log(result);
      if (response.ok) {
        setUploadedFiles(result);
      } else {
        console.error("Error al cargar los archivos");
      }
    } catch (error) {
      console.error("Error al cargar los archivos:", error);
    }
  };

  useEffect(() => {
    fetchFiles(); // Cargar archivos al montar el componente
  }, []);

  const handleRemoveFile = async (fileId) => {
    try {
      const response = await fetch(`http://localhost:3000/informe/delete/${fileId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
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
                <div className="search-container">
                  <input type="text" placeholder="Buscar..." className="search-input" />
                  <button className="search-button">
                    <img src={iconoBuscar} alt="Buscar" className="Buscar" />
                  </button>
                </div>

                <div className="uploaded-files-container">
                  {uploadedFiles.length > 0 ? (
                    uploadedFiles.map((file) => (
                      <div key={file.id} className="uploaded-file-item">
                        <span>{file.titulo}</span>
                        <div className="botonesEliminarActualizar">
                          <button onClick={() => handleUpdateFile(file.id)} className="botonEditar"><img src={iconoEditar} alt="Actualizar" className="Editar" /></button>
                          <button onClick={() => handleRemoveFile(file.id)} className="botonEliminar"><img src={iconoElimar} alt="Eliminar" className="Eliminar" /></button>
                        </div>
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

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from 'axios';
import iconoVolver from "../assets/icon-volver.png";
import iconoEliminar from "../assets/icon-eliminar.png"; // Corregido el nombre
import iconoEditar from "../assets/icon-editar.png";
import iconoBuscar from "../assets/icon-buscar.png";
import descargarIcon from '../assets/icon-download.png';
import Menu from "./menuDesplegable";
import "../styles/header.css";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const isInformePage = location.pathname === "/informe";
  const [isSearchMenuVisible, setIsSearchMenuVisible] = useState(false);
  const searchMenuRef = useRef(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);

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
    navigate(`/informe`, { state: { fileId } });
  };

  const handleCreateReport = () => {
    navigate(`/informe`, { state: { fileId: null } });
    window.location.reload();
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch("http://localhost:3000/informe/users", {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setUploadedFiles(result);
        setFilteredFiles(result);
      } else {
        console.error("Error al cargar los archivos");
      }
    } catch (error) {
      console.error("Error al cargar los archivos:", error);
    }
  };

  useEffect(() => {
    fetchFiles(); 
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredFiles(uploadedFiles); 
    } else {
      const filtered = uploadedFiles.filter(file => 
        file.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFiles(filtered); 
    }
  }, [searchTerm, uploadedFiles]);

  const showDeleteConfirmation = (fileId) => {
    setFileToDelete(fileId); 
    setIsConfirmModalVisible(true); 
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/informe/delete/${fileToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setUploadedFiles(uploadedFiles.filter(file => file.id !== fileToDelete));
        setFilteredFiles(filteredFiles.filter(file => file.id !== fileToDelete)); 
        setIsConfirmModalVisible(false); 
      } else {
        console.error("Error al eliminar el archivo");
      }
    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmModalVisible(false); 
  };

  const handleDownload = async (fileId) => {
    try {
      const response = await axios.get(`http://localhost:3000/informe/descargar/${fileId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `informe_${fileId}.pdf`);
      document.body.appendChild(link);
      link.click();

      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error al descargar el informe:', error);
    }
  };

  const handleSearch = () => {
    // Puedes implementar la lógica de búsqueda aquí si es necesario
    // En este caso, el filtrado se realiza automáticamente en el useEffect
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
                  <input
                    type="text"
                    placeholder="Buscar..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} 
                  />
                  <button className="search-button" onClick={handleSearch}>
                    <img src={iconoBuscar} alt="Buscar" className="Buscar" />
                  </button>
                </div>

                <div className="CrearInforme">
                  <button onClick={handleCreateReport} className="botonCrearInforme">
                    Crear Informe
                  </button>
                </div>

                <div className="uploaded-files-container">
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                      <div key={file.id} className="uploaded-file-item">
                        <span>{file.titulo}</span>
                        <div className="botonesEliminarActualizar">
                          <button onClick={() => handleUpdateFile(file.id)} className="botonEditar">
                            <img src={iconoEditar} alt="Actualizar" className="Editar" />
                          </button>
                          <button onClick={() => showDeleteConfirmation(file.id)} className="botonEliminar">
                            <img src={iconoEliminar} alt="Eliminar" className="Eliminar" />
                          </button>
                          <button onClick={() => handleDownload(file.id)} className="botonEliminar">
                            <img src={descargarIcon} alt="Descargar" className="Descargar" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No se encontraron informes.</p>
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

      {isConfirmModalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirmar Eliminación</h2>
            <p>¿Estás seguro de que deseas eliminar este archivo?</p>
            <div className="modal-buttons">
              <button onClick={handleConfirmDelete}>Eliminar</button>
              <button onClick={handleCancelDelete}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;

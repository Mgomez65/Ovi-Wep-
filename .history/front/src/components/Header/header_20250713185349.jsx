import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import iconoVolver from "../../assets/icon-volver.png";
import iconoEliminar from "../../assets/icon-eliminar.png";
import iconoEditar from "../../assets/icon-editar.png";
import iconoBuscar from "../../assets/icon-buscar.png";
import descargarIcon from "../../assets/icon-download.png";
import Menu from "../Menu-Desplegable/menuDesplegable";
import Auth from "../Auth-Admin/Auth-Admin";
import "./header.css";

function Header() {
  const [userRol, setUserRol] = useState(null);
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

  const [isReadOnly, setIsReadOnly] = useState(true);

  const toggleSearchMenu = (event) => {
    event.preventDefault();
    setIsSearchMenuVisible((prevState) => !prevState);
  };

  const handleClickOutside = (event) => {
    if (searchMenuRef.current && !searchMenuRef.current.contains(event.target)) {
      setIsSearchMenuVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchMenuVisible) {
      fetchUploadedFiles();
    }
  }, [isSearchMenuVisible]);

  useEffect(() => {
    setFilteredFiles(
      uploadedFiles.filter((file) =>
        file.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, uploadedFiles]);

  const fetchUploadedFiles = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/files");
      setUploadedFiles(response.data);
    } catch (error) {
      console.error("Error al obtener los archivos subidos:", error);
    }
  };

  const handleDeleteFile = (fileId) => {
    setFileToDelete(fileId);
    setIsConfirmModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/files/${fileToDelete}`);
      setUploadedFiles(uploadedFiles.filter((file) => file.id !== fileToDelete));
      setIsConfirmModalVisible(false);
      setFileToDelete(null);
    } catch (error) {
      console.error("Error al eliminar el archivo:", error);
      setIsConfirmModalVisible(false);
      setFileToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmModalVisible(false);
    setFileToDelete(null);
  };

  const handleDownload = async (fileId) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/files/${fileId}/download`, {
        responseType: 'blob', // Importante para manejar archivos
      });
      const contentDisposition = response.headers['content-disposition'];
      let fileName = 'descarga';
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1];
        }
      }
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  };

  return (
    <header className="header">
      {location.pathname !== "/" && (
        <Link to="/" className="Volver">
          <img src={iconoVolver} alt="Volver" className="icono-volver" />
        </Link>
      )}

      <div style={{ display: "flex", alignItems: "center" }}>
        {isInformePage ? (
          <>
            <button onClick={toggleSearchMenu} className="botonInforme">
              <img src={iconoBuscar} alt="Buscar" className="icono-buscar" />
            </button>
            {isSearchMenuVisible && (
              <div className="searchMenu" ref={searchMenuRef}>
                <input
                  type="text"
                  placeholder="Buscar informe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <div className="file-list">
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                      <div key={file.id} className="file-item">
                        <span>{file.name}</span>
                        <div className="file-actions">
                          {userRol === "admin" ? (
                            <>
                              <button
                                onClick={() => handleDeleteFile(file.id)}
                                className="botonEliminar"
                              >
                                <img
                                  src={iconoEliminar}
                                  alt="Eliminar"
                                  className="Eliminar"
                                />
                              </button>
                              <button
                                onClick={() => handleDownload(file.id)}
                                className="botonDescargar"
                              >
                                <img
                                  src={descargarIcon}
                                  alt="Descargar"
                                  className="Descargar"
                                />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleDownload(file.id)}
                              className="botonEliminar"
                            >
                              <img
                                src={descargarIcon}
                                alt="Descargar"
                                className="Descargar"
                              />
                            </button>
                          )}
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
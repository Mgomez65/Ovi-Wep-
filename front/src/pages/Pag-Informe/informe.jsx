import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import ConfirmacionTemporal from "../../components/Notificacion/notificacionTemporal";
import "./informe.css";
import Calendario from "../../components/calendario-mensual-informe/calendarioInforme";
import Auth from '../../components/Auth-Admin/Auth-Admin';

const Informe = () => {
  const [userRol, setUserRol] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFinal, setFechaFinal] = useState("");
  const [contenido, setContenido] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedInforme, setSelectedInforme] = useState(null);
  const [existingFiles, setExistingFiles] = useState([]);
  const [showConfirmacion, setShowConfirmacion] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [datos, setDatos] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const fileId = location.state?.fileId;

  useEffect(() => {
    console.log("Valor actual de userRol:", userRol);
  }, [userRol]);

  useEffect(() => {
    const fetchInforme = async () => {
      if (fileId && userRol) {
        console.log("Informe.jsx: Intentando cargar informe con ID:", fileId);
        try {
          const response = await fetch(`http://localhost:3000/informe/${fileId}`, {
            credentials: "include",
          });
          if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
              console.error("Acceso no autorizado o denegado al informe.");
              navigate('/login');
            }
            const errorData = await response.json().catch(() => ({ message: "Error desconocido del servidor" }));
            throw new Error(errorData.message || "Error al obtener el Informe");
          }
          const data = await response.json();

          const informe = data.informe;
          setDatos(data);
          setTitulo(informe.titulo || "");
          setFechaInicio(informe.fecha_inicio ? informe.fecha_inicio.substring(0, 10) : "");
          setFechaFinal(informe.fecha_final ? informe.fecha_final.substring(0, 10) : "");
          setContenido(informe.contenido || "");
          setSelectedInforme(data);
          setExistingFiles(data.imagenes || []);
        } catch (error) {
          console.error("Error al cargar el Informe:", error.message);
        }
      }
    };

    if (userRol !== null) {
      fetchInforme();
    }
  }, [fileId, userRol, navigate]);


  const handleFileUpdate = async (event) => {
    event.preventDefault();

    if (!titulo || !fechaInicio || !fechaFinal || !contenido) {
      setUploadMessage("Por favor, completa todos los campos del formulario.");
      return;
    }

    const data = {
      titulo,
      fecha_inicio: new Date(fechaInicio).toISOString(),
      fecha_final: new Date(fechaFinal).toISOString(),
      contenido,
    };

    try {
      const response = await fetch(
        `http://localhost:3000/informe/update/${fileId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );
      const result = await response.json();
      if (response.ok) {
        setMensajeConfirmacion("Informe actualizado exitosamente");
        setShowConfirmacion(true);
      } else {
        setMensajeConfirmacion(result.message || "Error al actualizar los datos");
        setShowConfirmacion(true);
      }
    } catch (error) {
      console.error("Error al actualizar el archivo:", error);
      setMensajeConfirmacion("Error al actualizar el archivo");
      setShowConfirmacion(true);
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (!titulo || !fechaInicio || !fechaFinal || !contenido) {
        setUploadMessage("Por favor, completa todos los campos del formulario.");
        return;
    }

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("fecha_inicio", new Date(fechaInicio).toISOString());
    formData.append("fecha_final", new Date(fechaFinal).toISOString());
    formData.append("contenido", contenido);
    selectedFiles.forEach((file) => {
        formData.append("imagenes", file);
    });
    setUploading(true);
    try {
        const response = await fetch("http://localhost:3000/informe/create", {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        const result = await response.json();
        if (response.ok) {
            setMensajeConfirmacion("Informe creado exitosamente");
            setShowConfirmacion(true);
            setTitulo("");
            setFechaInicio("");
            setFechaFinal("");
            setContenido("");
            setSelectedFiles([]);
        } else {
            setMensajeConfirmacion(result.message || "Error al enviar los datos");
            setShowConfirmacion(true);
        }
    } catch (error) {
        console.error("Error al enviar los datos:", error);
        setMensajeConfirmacion("Error al enviar los datos");
        setShowConfirmacion(true);
    } finally {
        setUploading(false);
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    setCurrentIndex(0);
  };

  const handleDeleteImage = (index) => {
    setSelectedFiles((prev) =>
      prev.filter((_, inx) => inx !== index)
    );
  };

  // La función handleSearch ya no es necesaria aquí, ya que la búsqueda se maneja en Header.jsx
  // Si necesitas alguna lógica de búsqueda específica para este componente, la reintroduciríamos.

  return (
    <>
      <Header />
      <div className="formulario-container">
        <form
          onSubmit={selectedInforme ? handleFileUpdate : handleFileUpload}
          className="form-container"
        >
          <div className="containerTituloFechas">
            <h2>Título de la documentación</h2>
            <input
              type="text"
              placeholder="Nombre del documento"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
            <div className="Fechas">
              <div>
                <h2>Fecha de inicio</h2>
                <input
                  type="date"
                  name="fechaInicio"
                  id="fechaInicio"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div>
                <h2>Fecha de finalizado</h2>
                <input
                  type="date"
                  name="fechaFin"
                  id="fechaFin"
                  value={fechaFinal}
                  onChange={(e) => setFechaFinal(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="containerDescripcion">
            <h2>Descripción</h2>
            <textarea
              name="contenido"
              id="contenido"
              placeholder="Descripción"
              className="inputDescripcion"
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
            />
          </div>

          <div className="containerUwu">
            <div className="containerCalendario">
              <h2>Plan de Riego</h2>
              <Calendario eventos={datos?.informe?.planDeRiego?.diaPlan || []} />
            </div>
            <div className="containerImagenes">
              <h2>Imágenes</h2>
              {existingFiles.length > 0 && (
                <div>
                  <h3>Archivos existentes:</h3>
                  <ul>
                    {existingFiles.map((file, index) => (
                      <li key={index}>{file.nombre}</li>
                    ))}
                  </ul>
                </div>
              )}
              {!selectedInforme && (
                <div className="upload-container">
                  <div className="botonesForm">
                    <label htmlFor="fileInput" className="custom-file-upload">
                      Seleccionar Imágenes
                    </label>
                    <input
                      type="file"
                      id="fileInput"
                      name="files"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </div>
                </div>
              )}

              {selectedFiles.length > 0 && (
                <div>
                  <ul>
                    {selectedFiles.map((file, index) => (
                          <li key={index}>
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Imagen ${index + 1}`}
                              style={{ width: '150px', height: 'auto', marginBottom: '10px' }}
                            />
                            <button onClick={() => handleDeleteImage(index)}>Eliminar</button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {Array.isArray(datos.informe?.imagenes) && datos.informe.imagenes.length > 0 ? (
                    <div className="imagenes-del-informe">
                      <ul>
                        {datos.informe.imagenes.map((img, index) => {
                          const imageUrl = `/imgIfome/${img.url}`;
                          console.log("Informe.jsx: URL de imagen generada:", imageUrl);
                          return (
                            <li key={index}>
                              <img
                                src={imageUrl}
                                alt={`Imagen ${index + 1}`}
                                style={{ width: '150px', height: 'auto', marginBottom: '10px'}}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ) : (
                    <div className="no-imagen">
                    </div>
                  )}
                </div>
              </div>

              {showConfirmacion && (
                <ConfirmacionTemporal
                  mensaje={mensajeConfirmacion}
                  onClose={() => setShowConfirmacion(false)}
                  shouldReload={mensajeConfirmacion === "Informe creado exitosamente"}
                />
              )}

              <Auth setUserRol={setUserRol} />
              {userRol === 'admin' && (
                <div className="divBotonSubir">
                  <button type="submit" disabled={uploading} className="botonSubir">
                    {uploading
                      ? "Subiendo..."
                      : selectedInforme
                      ? "Actualizar Informe"
                      : "Guardar Informe"}
                  </button>
                </div>
              )}
            </form>

            {/* SECCIÓN DE BÚSQUEDA ELIMINADA DE AQUÍ */}

          </div>
          <Footer />
        </>
      );
    };

    export default Informe;

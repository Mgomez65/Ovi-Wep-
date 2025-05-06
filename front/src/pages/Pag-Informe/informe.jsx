import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
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

  const location = useLocation();
  const fileId = location.state?.fileId;

  useEffect(() => {
    const fetchInforme = async () => {
      if (fileId) {
        try {
          const response = await fetch(`http://localhost:3000/informe/${fileId}`);
          if (!response.ok) {
            throw new Error("Error al obtener el informe");
          }
          const data = await response.json();
          const informe = data.informe;
          console.log(data);
          setDatos(data);
          setTitulo(informe.titulo || "");
          setFechaInicio(informe.fecha_inicio || "");
          setFechaFinal(informe.fecha_final || "");
          setContenido(informe.contenido || "");
          setSelectedInforme(data);
          setExistingFiles(data.imagenes || []);
        } catch (error) {
          console.error("Error al cargar el informe:", error);
        }
      }
    };

    fetchInforme();
  }, [fileId]);

  const handleFileUpdate = async (event) => {
    event.preventDefault();

    if (!titulo || !fechaInicio || !fechaFinal || !contenido) {
      setUploadMessage("Por favor, completa todos los campos del formulario.");
      return;
    }

    const data = {
      titulo,
      fecha_inicio: fechaInicio,
      fecha_final: fechaFinal,
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
        setMensajeConfirmacion("Informe creado exitosamente");
        setShowConfirmacion(true);
        setExistingFiles(selectedFiles);
        setSelectedFiles([]);
      } else {
        setMensajeConfirmacion("Error al enviar los datos");
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
    formData.append("fecha_inicio", fechaInicio);
    formData.append("fecha_final", fechaFinal);
    formData.append("contenido", contenido);
    selectedFiles.forEach((file) => {
        formData.append("imagen", file);
    });
    setUploading(true);
    try {
        const response = await fetch("http://localhost:3000/informe/create", {
            method: "POST",
            body: formData,
            credentials: "include",
        });
        if (response.ok) {
            setMensajeConfirmacion("Informe creado exitosamente");
            setShowConfirmacion(true);
        } else {
            setMensajeConfirmacion("Error al enviar los datos");
            setShowConfirmacion(true);
        }
    } catch (error) {
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

  const handleDeleteImage = () => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== currentIndex)
    );
    setCurrentIndex((prev) =>
      prev === 0 ? 0 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentIndex((prev) =>
      prev === selectedFiles.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? selectedFiles.length - 1 : prev - 1
    );
  };

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
              <Calendario  eventos={datos && datos.planDeRiego ? datos.planDeRiego.diaPlan : []} />
            </div>
            <div className="containerImagenes">
              <h2>Imágenes relacionadas</h2>
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

              {/* Mostrar el carrusel si hay imágenes seleccionadas */}
              {selectedFiles.length > 0 && (
                <div className="carousel-container">
                  <div className="carousel">
                    <button onClick={handlePrevImage} className="botonCarrucel">Anterior</button>
                    <button onClick={handleNextImage} className="botonCarrucel">Siguiente</button>
                    <img
                      src={URL.createObjectURL(selectedFiles[currentIndex])}
                      alt={`Imagen ${currentIndex + 1}`}
                      className="image-preview"
                    />
                  </div>

                  <div className="botonEliminarContainer">
                    <button onClick={handleDeleteImage} className="remove-button">
                      Eliminar
                    </button>
                  </div>

                </div>
              )}
              {/* Carrusel para mostrar las imágenes del informe guardado */}
              {datos.imagenInforme?.url ? ( // Usa el encadenamiento opcional aquí
                <div className="carrusel-container">
                    <h2>Imágenes del Informe</h2>
                    <div className="carrusel">
                        <img
                            src={`/img/${datos.imagenInforme.url}`} // Se eliminó el encadenamiento opcional aquí ya que ya hemos comprobado que existe
                            alt={`Imagen del informe con descripción: ${datos.imagenInforme.descripcion || 'sin descripción'}`} // Añadir una descripción más completa
                            style={{ width: '400px', height: 'auto' }}
                        />
                    </div>
                </div>
              ) : (
                <div className="no-imagen">
                    <p></p> {/* Mensaje si no hay imágenes */}
                </div>
              )}
            </div>
          </div>

          <Auth setUserRol={setUserRol} />
          {userRol === 'admin' && (
            <div className="divBotonSubir">
              <button type="submit" disabled={uploading} className="botonSubir">
                {uploading
                  ? "Subiendo..."
                  : selectedInforme
                  ? "Guardar Informe"
                  : "Crear Informe"}
              </button>
            </div>
          )}
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Informe;

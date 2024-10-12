import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import React from "react";
import Header from "../../components/Header/header";
import Footer from "../../components/Footer/footer";
import ConfirmacionTemporal from "../../components/Notificacion/notificacionTemporal";
import "./informe.css";
import Calendario from "../../components/calendario-mensual-informe/calendarioInforme";

const Informe = () => {
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
  const [datos, setDatos] = useState(null);



  const location = useLocation();
  const fileId = location.state?.fileId;

  useEffect(() => {
    const fetchInforme = async () => {
      if (fileId) {
        try {
          const response = await fetch(
            `http://localhost:3000/informe/user/${fileId}`
          );
          if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error("Error al obtener el informe");
          }
          const data = await response.json();
          setDatos(data);
    
          console.log(data)
          setTitulo(data.titulo || "");
          setFechaInicio(
            data.fecha_inicio
              ? new Date(data.fecha_inicio).toISOString().split("T")[0]
              : ""
          );
          setFechaFinal(
            data.fecha_final
              ? new Date(data.fecha_final).toISOString().split("T")[0]
              : ""
          );
          setContenido(data.contenido || "");
          setSelectedInforme(data);
          setExistingFiles(data.imagenes || []); // Asumiendo que la respuesta incluye imágenes
        } catch (error) {
          console.error("Error al obtener el informe:", error);
          setShowConfirmacion(true);
          setMensajeConfirmacion("Error al cargar los datos del informe");
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

    setUploading(true);
    setUploadMessage("");

    const data = {
      titulo,
      fecha_inicio: fechaInicio,
      fecha_final: fechaFinal,
      contenido,
      imagenes: selectedFiles, // Incluye las imágenes seleccionadas
    };

    try {
      const response = await fetch("http://localhost:3000/informe/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setMensajeConfirmacion("Informe actualizado exitosamente");
        setShowConfirmacion(true);
      } else {
        setMensajeConfirmacion("Error al actualizar el archivo");
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

  // Función para manejar la selección de archivos
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles((prev) => [...prev, ...files]); // Añadir las nuevas imágenes seleccionadas
    setCurrentIndex(0); // Restablecer el índice al principio del carrusel
  };

  // Función para eliminar la imagen actual del carrusel
  const handleDeleteImage = () => {
    setSelectedFiles((prev) =>
      prev.filter((_, index) => index !== currentIndex)
    );
    setCurrentIndex((prev) =>
      prev === 0 ? 0 : prev - 1
    ); // Ajustar el índice después de eliminar
  };

  // Funciones para navegar por el carrusel
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
              <h2>Plan de Riego  {datos && datos.planDeRiego && datos.planDeRiego.titulo}</h2>
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

                  {/* Botón de eliminar imagen */}
                  <div className="botonEliminarContainer">
                    <button onClick={handleDeleteImage} className="remove-button">
                      Eliminar
                    </button>
                  </div>
                  
                </div>
              )}
            </div>
          </div>

          <div className="divBotonSubir">
            <button type="submit" disabled={uploading} className="botonSubir">
              {uploading
                ? "Subiendo..."
                : selectedInforme
                ? "Guardar Informe"
                : "Crear Informe"}
            </button>
          </div>
        </form>
      </div>
      {showConfirmacion && (
        <ConfirmacionTemporal
          mensaje={mensajeConfirmacion}
          onClose={() => setShowConfirmacion(false)}
          shouldReload={true}
        />
      )}
      <Footer />
    </>
  );
};

export default Informe;

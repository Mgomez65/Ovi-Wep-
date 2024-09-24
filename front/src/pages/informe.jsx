import { useState } from "react"; 
import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/informe.css";

const Informe = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  
  // Estados para el formulario
  const [titulo, setTitulo] = useState(""); // Cambiado a "titulo"
  const [fechaInicio, setFechaInicio] = useState(""); // Cambiado a "fecha_inicio"
  const [fechaFinal, setFechaFinal] = useState(""); // Cambiado a "fecha_final"
  const [contenido, setContenido] = useState(""); // Cambiado a "contenido"

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    console.log("Título:", titulo);
    console.log("Fecha Inicio:", fechaInicio);
    console.log("Fecha Final:", fechaFinal);
    console.log("Contenido:", contenido);
  
    if (selectedFiles.length === 0) {
      setUploadMessage("Por favor, selecciona al menos un archivo para subir.");
      return;
    }
  
    // Asegúrate de que los valores del formulario sean válidos
    if (!titulo || !fechaInicio || !fechaFinal || !contenido) {
      setUploadMessage("Por favor, completa todos los campos del formulario.");
      return;
    }
  
    setUploading(true);
    setUploadMessage("");
  
    const formData = new FormData();

    selectedFiles.forEach((file) => {
        formData.append("files", file);
    });
  
    // Agregar datos del formulario a FormData
    formData.append("titulo", titulo); // Cambiado a "titulo"
    formData.append("fecha_inicio", fechaInicio); // Cambiado a "fecha_inicio"
    formData.append("fecha_final", fechaFinal); // Cambiado a "fecha_final"
    formData.append("contenido", contenido); // Cambiado a "contenido"
    
    for (let [key, value] of formData.entries()) {
      console.log(key, value); // Esto mostrará cada par clave-valor
    }
  

    try {
      const response = await fetch("http://localhost:3000/informe/create", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.json();
        setUploadMessage("Archivos y datos enviados exitosamente");
        // Limpiar campos después de la presentación exitosa
        setTitulo("");
        setFechaInicio("");
        setFechaFinal("");
        setContenido("");
        setSelectedFiles([]);
      } else {
        setUploadMessage("Error al subir los archivos y datos");
      }
    } catch (error) {
      setUploadMessage("Error al subir los archivos y datos");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveFile = (fileToRemove) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file !== fileToRemove)
    );
  };

  return (
    <>
      <Header />
      <div className="containerTituloFechas">
        <h2>Título de la documentación</h2>
        <input
          type="text"
          placeholder="Nombre del documento"
          value={titulo} // Cambiado a "titulo"
          onChange={(e) => setTitulo(e.target.value)} // Cambiado a "setTitulo"
        />
        <div className="Fechas">
          <div>
            <h2>Fecha de inicio</h2>
            <input
              type="date"
              name="fechaInicio"
              id="fechaInicio"
              value={fechaInicio} // Cambiado a "fechaInicio"
              onChange={(e) => setFechaInicio(e.target.value)} // Cambiado a "setFechaInicio"
            />
          </div>
          <div>
            <h2>Fecha de finalizado</h2>
            <input
              type="date"
              name="fechaFin"
              id="fechaFin"
              value={fechaFinal} // Cambiado a "fechaFinal"
              onChange={(e) => setFechaFinal(e.target.value)} // Cambiado a "setFechaFinal"
            />
          </div>
        </div>
      </div>
      <div className="containerDescripcion">
        <h2>Descripción</h2>
        <textarea
          type="text"
          name="contenido" // Cambiado a "contenido"
          id="contenido" // Cambiado a "contenido"
          placeholder="Descripción"
          className="inputDescripcion"
          value={contenido} // Cambiado a "contenido"
          onChange={(e) => setContenido(e.target.value)} // Cambiado a "setContenido"
        />
      </div>
      <div className="containerImagenes">
        <h2>Imágenes relacionadas</h2>
        <div className="upload-container">
          <form onSubmit={handleFileUpload}>
            <div className="botonesForm">
              <label htmlFor="fileInput" className="custom-file-upload">
                Seleccionar Imágenes
              </label>
              <div className="divBotonSubir">
                <button
                  type="submit"
                  disabled={uploading}
                  className="botonSubir"
                >
                  {uploading ? "Subiendo..." : "Subir Imágenes y Datos"}
                </button>
              </div>
              <input
                type="file"
                id="fileInput"
                name="files"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }} // Esconder el input de archivo
              />
            </div>
            <div>
              {selectedFiles.map((file, index) => (
                <div key={index} className="image-preview-container">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Vista previa ${index}`}
                    className="image-preview"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file)}
                    className="remove-button"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          </form>
        </div>
        {uploadMessage && <p>{uploadMessage}</p>}
      </div>
      <Footer />
    </>
  );
};

export default Informe;

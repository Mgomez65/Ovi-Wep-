import { useState } from "react";
import React from "react";
import Header from "../components/header";
import Footer from "../components/footer"
import "../styles/informe.css";

const informe = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    if (selectedFiles.length === 0) {
      setUploadMessage("Por favor, selecciona al menos un archivo para subir.");
      return;
    }

    setUploading(true);
    setUploadMessage("");

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch("/upload", {
        // Cambia '/upload' a tu endpoint de carga
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadMessage("Archivos subidos exitosamente");
        // Aquí puedes hacer algo con el resultado, si es necesario
      } else {
        setUploadMessage("Error al subir los archivos");
      }
    } catch (error) {
      setUploadMessage("Error al subir los archivos");
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
        <input type="text" placeholder="Nombre del documento" />
        <div className="Fechas">
          <div>
            <h2>Fecha de inicio</h2>
            <input type="date" name="fechaInicio" id="fechaInicio" />
          </div>
          <div>
            <h2>Fecha de finalizado</h2>
            <input type="date" name="fechaFin" id="fechaFin" />
          </div>
        </div>
      </div>
      <div className="containerDescripcion">
        <h2>Descripción</h2>
        <textarea
          type="text"
          name="descripcion"
          id="descripcion"
          placeholder="Descripción"
          className="inputDescripcion"
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
                  {uploading ? "Subiendo..." : "Subir Imágenes"}
                </button>
              </div>
              <input
                type="file"
                id="fileInput"
                name="files"
                accept="image/*"
                multiple
                onChange={handleFileChange}
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
      <Footer/>
    </>
  );
};

export default informe;

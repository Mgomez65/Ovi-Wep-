/* import { useState } from "react"; 
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
  
  
    // Validación de los campos del formulario
    if (!titulo || !fechaInicio || !fechaFinal || !contenido) {
      setUploadMessage("Por favor, completa todos los campos del formulario.");
      return;
    }
  
    setUploading(true);
    setUploadMessage("");
  
    // Crear un objeto JSON para enviar al backend
    const data = {
      titulo,
      fecha_inicio: fechaInicio, // Cambiado a "fecha_inicio"
      fecha_final: fechaFinal, // Cambiado a "fecha_final"
      contenido, // Cambiado a "contenido"
    };
  
    try {
      const response = await fetch("http://localhost:3000/informe/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Establece el tipo de contenido a JSON
        },
        body: JSON.stringify(data), // Convierte el objeto a JSON
        credentials: "include",
      });
      const result = await response.json();
     console.log(result)
      if (response.ok) {
        alert(result.mensage)
        setUploadMessage("Datos enviados exitosamente");
  
        // Limpiar campos después del éxito
        setTitulo("");
        setFechaInicio("");
        setFechaFinal("");
        setContenido("");
      } else {
        const errorText = await response.text();
        console.error("Error en la respuesta del servidor:", errorText);
        setUploadMessage("Error al enviar los datos");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setUploadMessage("Error al enviar los datos");
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
      <form onSubmit={handleFileUpload} className="form-container">
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

        <div className="containerImagenes">
          <h2>Imágenes relacionadas</h2>
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
                style={{ display: 'none' }} // Esconder el input de archivo
              />
              <div className="divBotonSubir">
                <button
                  type="submit"
                  disabled={uploading}
                  className="botonSubir"
                >
                  {uploading ? "Subiendo..." : "Subir Imágenes y Datos"}
                </button>
              </div>
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
          </div>
          {uploadMessage && <p>{uploadMessage}</p>}
        </div>
      </form>
      <Footer />
    </>
  );
};

export default Informe;
 */

import { useState, useEffect } from "react"; 
import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/informe.css";

const Informe = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]); // Estado para archivos de la base de datos
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  
  // Estados para el formulario
  const [titulo, setTitulo] = useState(""); 
  const [fechaInicio, setFechaInicio] = useState(""); 
  const [fechaFinal, setFechaFinal] = useState(""); 
  const [contenido, setContenido] = useState(""); 


  const handleUpdateFile = async (fileId) => {
    
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();

    // Validación de los campos del formulario
    if (!titulo || !fechaInicio || !fechaFinal || !contenido) {
      setUploadMessage("Por favor, completa todos los campos del formulario.");
      return;
    }

    setUploading(true);
    setUploadMessage("");

    // Crear un objeto JSON para enviar al backend
    const data = {
      titulo,
      fecha_inicio: fechaInicio, 
      fecha_final: fechaFinal, 
      contenido, 
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
        alert(result.mensage);
        setUploadMessage("Datos enviados exitosamente");

        // Limpiar campos después del éxito
        setTitulo("");
        setFechaInicio("");
        setFechaFinal("");
        setContenido("");
      } else {
        const errorText = await response.text();
        console.error("Error en la respuesta del servidor:", errorText);
        setUploadMessage("Error al enviar los datos");
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      setUploadMessage("Error al enviar los datos");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Header />
      <form onSubmit={handleFileUpload} className="form-container">
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

        <div className="containerImagenes">
          <h2>Imágenes relacionadas</h2>
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
                style={{ display: 'none' }} 
              />
              <div className="divBotonSubir">
                <button
                  type="submit"
                  disabled={uploading}
                  className="botonSubir"
                >
                  {uploading ? "Subiendo..." : "Subir Imágenes y Datos"}
                </button>
              </div>
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
          </div>
          {uploadMessage && <p>{uploadMessage}</p>}
        </div>
      </form>
      <Footer />
    </>
  );
};

export default Informe;


/* import { useState, useEffect } from "react"; 
import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/informe.css";

const Informe = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]); 
  const [uploadMessage, setUploadMessage] = useState("");
  
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
          setUploadedFiles(result); // Cambia aquí
        } else {
          setUploadMessage("Error al cargar los archivos");
        }
      } catch (error) {
        console.error("Error al cargar los archivos:", error);
        setUploadMessage("Error al cargar los archivos");
      }
    };
    fetchFiles();
  }, []);

  return (
    <>
      <Header />
      <div className="uploaded-files-container">
        <h2>Archivos Guardados</h2>
        {uploadMessage && <p>{uploadMessage}</p>} {/* Mensaje de error }
         {uploadedFiles.length > 0 ? (
          uploadedFiles.map((file) => (
            <div key={file.id} className="uploaded-file-item">
              <span>{file.titulo}</span> {/* Muestra el título del archivo }
               <p>Contenido: {file.contenido}</p> {/* Agrega el contenido }
               <p>Fecha Inicio: {new Date(file.fecha_inicio).toLocaleDateString()}</p> {/* Muestra la fecha de inicio }
               <p>Fecha Final: {new Date(file.fecha_final).toLocaleDateString()}</p> {/* Muestra la fecha final }
             </div>
          ))
        ) : (
          <p>No hay archivos guardados.</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Informe; */

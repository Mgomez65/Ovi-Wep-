import { useState, useEffect } from "react"; 
import { useLocation } from "react-router-dom";
import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import "../styles/informe.css";

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

  const location = useLocation();
  const fileId = location.state?.fileId; // Asumiendo que 'informe' se pasa desde el estado
  console.log(fileId)
  console.log("Estado de ubicación:", location.state); 

  useEffect(() => {
    const fetchInforme = async () => {
      if (fileId) {
        try {
          const response = await fetch(`http://localhost:3000/informe/user/${fileId}`);
          if (!response.ok) {
            const errorResponse = await response.json();
            console.error("Error al obtener el informe:", errorResponse);
            throw new Error('Error al obtener el informe');
          }
          const data = await response.json();
          console.log("Datos obtenidos:", data); // Muestra los datos recibidos
          
          // Asegúrate de que las fechas estén en el formato YYYY-MM-DD
          setTitulo(data.titulo || "");
          setFechaInicio(data.fecha_inicio ? new Date(data.fecha_inicio).toISOString().split('T')[0] : ""); 
          setFechaFinal(data.fecha_final ? new Date(data.fecha_final).toISOString().split('T')[0] : ""); 
          setContenido(data.contenido || ""); 
          setSelectedInforme(data);
        } catch (error) {
          console.error("Error al obtener el informe:", error);
          setUploadMessage("Error al cargar los datos del informe.");
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
      const response = await fetch(`http://localhost:3000/informe/update/${fileId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });
      const result = await response.json();
      console.log(result)
      if (response.ok) {
        alert(result.message);
        setUploadMessage("Archivo actualizado exitosamente");
        window.location.reload();
      } else {
        const errorText = await response.text();
        console.error("Error en la respuesta del servidor:", errorText);
        setUploadMessage("Error al actualizar el archivo");
      }
    } catch (error) {
      console.error("Error al actualizar el archivo:", error);
      setUploadMessage("Error al actualizar el archivo");
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
        window.location.reload();
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

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files);
    setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  return (
    <>
      <Header />
      <div className="formulario-container">
        <form onSubmit={selectedInforme ? handleFileUpdate : handleFileUpload} className="form-container">
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
                  style={{ display: 'none' }} 
                />
                <div className="divBotonSubir">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="botonSubir"
                  >
                    {uploading ? "Subiendo..." : selectedInforme ? "Guardar Informe" : "Crear Informe"}
                  </button>
                </div>
              </div>
            </div>
            {uploadMessage && <p>{uploadMessage}</p>}
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Informe;

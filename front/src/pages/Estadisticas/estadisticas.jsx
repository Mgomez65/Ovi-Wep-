import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line, LineChart } from "recharts";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import './estadisticas.css';
import axios from 'axios'; // Importa axios

const EstadisticasVinedo = () => {
  const [datos, setDatos] = useState([]); // Contendrá todos los datos de ambos años para la tabla
  const [datosAñoSeleccionadoRaw, setDatosAñoSeleccionadoRaw] = useState([]); // Datos del año principal
  const [datosAñoComparacionRaw, setDatosAñoComparacionRaw] = useState([]); // Datos del año de comparación

  const [filtroAño, setFiltroAño] = useState(new Date().getFullYear().toString()); // Año actual por defecto
  const [filtroAñoComparacion, setFiltroAñoComparacion] = useState((new Date().getFullYear() - 1).toString()); // Año anterior por defecto
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroDia, setFiltroDia] = useState("");
  const [filtroSector, setFiltroSector] = useState("todos");
  const [filtroPlantacion, setFiltroPlantacion] = useState("todos");
  const [tipoDato, setTipoDato] = useState("humedad_med"); // Ajustado para coincidir con la base de datos
  const [tipoGrafico, setTipoGrafico] = useState("barras");

  const axiosInstance = axios.create({
    withCredentials: true, // Esto es crucial para enviar la cookie de sesión
    baseURL: 'http://localhost:3000', // Tu backend principal
  });

  // Función para obtener los datos de la API
  const fetchData = async () => {
    try {
      // Función auxiliar para obtener las fechas de inicio y fin basadas en los filtros
      const getDatesForFilter = (year, month, day) => {
        let fechaInicio, fechaFin;
        if (day && month && year) {
          fechaInicio = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          fechaFin = fechaInicio;
        } else if (month && year) {
          const lastDay = new Date(parseInt(year), parseInt(month), 0).getDate();
          fechaInicio = `${year}-${month.padStart(2, '0')}-01`;
          fechaFin = `${year}-${month.padStart(2, '0')}-${lastDay}`;
        } else if (year) {
          fechaInicio = `${year}-01-01`;
          fechaFin = `${year}-12-31`;
        } else {
            const today = new Date();
            const currentYear = today.getFullYear();
            const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
            const currentDay = today.getDate().toString().padStart(2, '0');

            fechaInicio = `${currentYear}-${currentMonth}-01`;
            fechaFin = `${currentYear}-${currentMonth}-${currentDay}`;
        }
        return { fechaInicio, fechaFin };
      };

      // Obtener fechas para el año seleccionado
      const { fechaInicio: fechaInicioSel, fechaFin: fechaFinSel } = getDatesForFilter(filtroAño, filtroMes, filtroDia);
      const paramsAñoSeleccionado = {
        fechaInicio: fechaInicioSel,
        fechaFin: fechaFinSel,
        sector: filtroSector,
        plantacion: filtroPlantacion,
      };

      // Obtener fechas para el año de comparación
      const { fechaInicio: fechaInicioComp, fechaFin: fechaFinComp } = getDatesForFilter(filtroAñoComparacion, filtroMes, filtroDia);
      const paramsAñoComparacion = {
        fechaInicio: fechaInicioComp,
        fechaFin: fechaFinComp,
        sector: filtroSector,
        plantacion: filtroPlantacion,
      };

      // Realizar ambas peticiones en paralelo
      const [responseAñoSeleccionado, responseAñoComparacion] = await Promise.all([
        axiosInstance.get('/api/estadisticas', { params: paramsAñoSeleccionado }),
        axiosInstance.get('/api/estadisticas', { params: paramsAñoComparacion })
      ]);
      
      // Filtrar y almacenar los datos crudos válidos
      const validDatosSel = responseAñoSeleccionado.data.filter(d => d && d.fecha && !isNaN(new Date(d.fecha)));
      const validDatosComp = responseAñoComparacion.data.filter(d => d && d.fecha && !isNaN(new Date(d.fecha)));

      setDatosAñoSeleccionadoRaw(validDatosSel);
      setDatosAñoComparacionRaw(validDatosComp);

      // Combinar todos los datos para la tabla (si es necesario mostrar ambos años en la tabla)
      // Si la tabla solo debe mostrar el año principal, ajusta esto.
      setDatos([...validDatosSel, ...validDatosComp]);


    } catch (error) {
      console.error("Error al cargar los datos de la API:", error);
      setDatos([]); // Limpia los datos si hay un error
      setDatosAñoSeleccionadoRaw([]);
      setDatosAñoComparacionRaw([]);

      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          console.warn("No autorizado para ver estadísticas. Por favor, inicie sesión como administrador.");
        } else if (error.response.status === 404) {
          console.warn("No se encontraron datos para los filtros seleccionados.");
        } else {
          console.error("Error al cargar estadísticas: " + (error.response.data.message || error.message));
        }
      } else {
        console.error("Error de red o servidor al cargar estadísticas: " + error.message);
      }
    }
  };

  // Cargar datos cuando cambien los filtros
  useEffect(() => {
    fetchData();
  }, [filtroAño, filtroAñoComparacion, filtroMes, filtroDia, filtroSector, filtroPlantacion]);


  const añoActual = new Date().getFullYear();
  // Obtener años disponibles de los datos existentes (de ambos conjuntos de datos crudos)
  const allYearsFromData = new Set();
  datosAñoSeleccionadoRaw.forEach(d => allYearsFromData.add(new Date(d.fecha).getFullYear().toString()));
  datosAñoComparacionRaw.forEach(d => allYearsFromData.add(new Date(d.fecha).getFullYear().toString()));
  
  const añosDisponibles = Array.from(allYearsFromData).sort((a, b) => b - a);
  // Asegurarse de que los años por defecto estén en la lista si no hay datos
  if (!añosDisponibles.includes(añoActual.toString())) {
    añosDisponibles.unshift(añoActual.toString());
  }
  if (!añosDisponibles.includes((añoActual - 1).toString())) {
    añosDisponibles.unshift((añoActual - 1).toString());
  }


  // Mapear y procesar los datos crudos para el gráfico y la tabla
  const processedDatosParaGrafico = (rawDatos) => rawDatos.map(dato => {
    if (!dato || !dato.fecha) {
        return null;
    }
    const fechaObj = new Date(dato.fecha);
    if (isNaN(fechaObj.getTime())) {
        return null;
    }
    const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const dia = fechaObj.getDate().toString().padStart(2, '0');
    return {
      ...dato,
      fechaFormatted: `${dia}/${mes}`,
      año: fechaObj.getFullYear()
    };
  }).filter(Boolean);

  const datosParaGraficoAñoSeleccionado = processedDatosParaGrafico(datosAñoSeleccionadoRaw);
  const datosParaGraficoAñoComparacion = processedDatosParaGrafico(datosAñoComparacionRaw);

  const datosCombinadosParaLineChart = [];
  // Obtener todas las fechas únicas (DD/MM) de ambos conjuntos de datos
  const fechasUnicas = new Set([
    ...datosParaGraficoAñoSeleccionado.map(d => d.fechaFormatted),
    ...datosParaGraficoAñoComparacion.map(d => d.fechaFormatted)
  ]);
  
  // Ordenar las fechas y combinar los datos
  Array.from(fechasUnicas).sort((a, b) => {
    const [diaA, mesA] = a.split('/').map(Number);
    const [diaB, mesB] = b.split('/').map(Number);
    return (mesA * 100 + diaA) - (mesB * 100 + diaB);
  }).forEach(fechaFormatted => {
    const datoAñoSeleccionado = datosParaGraficoAñoSeleccionado.find(d => d.fechaFormatted === fechaFormatted);
    const datoAñoComparacion = datosParaGraficoAñoComparacion.find(d => d.fechaFormatted === fechaFormatted);

    datosCombinadosParaLineChart.push({
      fecha: fechaFormatted,
      tipoDatoAñoSeleccionado: datoAñoSeleccionado ? parseFloat(datoAñoSeleccionado[tipoDato]) : null,
      tipoDatoAñoComparado: datoAñoComparacion ? parseFloat(datoAñoComparacion[tipoDato]) : null,
    });
  });

  // Meses y Días para los selectores
  const meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const dias = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  return (
    <>
      <Header />
      <div className="estadisticas-container">
        <h2>Estadísticas del Viñedo</h2>

        <div className="filters-container">
          {/* Filtro por Año */}
          <select value={filtroAño} onChange={(e) => setFiltroAño(e.target.value)}>
            <option value="">Selecciona un Año</option>
            {añosDisponibles.map(año => (
              <option key={año} value={año}>{año}</option>
            ))}
          </select>

          {/* Filtro por Mes */}
          <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
            <option value="">Selecciona un Mes</option>
            {[...Array(12).keys()].map(i => {
              const month = (i + 1).toString().padStart(2, '0');
              return <option key={month} value={month}>{new Date(2000, i, 1).toLocaleString('es', { month: 'long' })}</option>;
            })}
          </select>

          {/* Filtro por Día (opcional, solo si se selecciona un mes) */}
          {filtroMes && (
            <input
              type="number"
              placeholder="Día"
              min="1"
              max={new Date(parseInt(filtroAño), parseInt(filtroMes), 0).getDate()}
              value={filtroDia}
              onChange={(e) => setFiltroDia(e.target.value)}
            />
          )}

          {/* Filtro por Sector */}
          <select value={filtroSector} onChange={(e) => setFiltroSector(e.target.value)}>
            <option value="todos">Todos los Sectores</option>
            <option value="Sector A">Sector A</option>
            <option value="Sector B">Sector B</option>
            {/* Agrega más opciones de sector si las tienes */}
          </select>

          {/* Filtro por Plantación */}
          <select value={filtroPlantacion} onChange={(e) => setFiltroPlantacion(e.target.value)}>
            <option value="todos">Todas las Plantaciones</option>
            <option value="Plantacion 1">Plantacion 1</option>
            <option value="Plantacion 2">Plantacion 2</option>
            {/* Agrega más opciones de plantación si las tienes */}
          </select>
        </div>

        {/* Tipo de Dato */}
        <div className="radio-buttons-container">
          <label>
            <input
              type="radio"
              value="humedad_med"
              checked={tipoDato === "humedad_med"}
              onChange={(e) => setTipoDato(e.target.value)}
            />
            Humedad Promedio
          </label>
          <label>
            <input
              type="radio"
              value="temperatura_med"
              checked={tipoDato === "temperatura_med"}
              onChange={(e) => setTipoDato(e.target.value)}
            />
            Temperatura Promedio
          </label>
          <label>
            <input
              type="radio"
              value="temperatura_max"
              checked={tipoDato === "temperatura_max"}
              onChange={(e) => setTipoDato(e.target.value)}
            />
            Temperatura Máxima
          </label>
          <label>
            <input
              type="radio"
              value="temperatura_min"
              checked={tipoDato === "temperatura_min"}
              onChange={(e) => setTipoDato(e.target.value)}
            />
            Temperatura Mínima
          </label>
          <label>
            <input
              type="radio"
              value="precipitacion_mm"
              checked={tipoDato === "precipitacion_mm"}
              onChange={(e) => setTipoDato(e.target.value)}
            />
            Precipitaciones
          </label>
        </div>

        {/* Comparación Anual */}
        <div className="comparison-container">
          <label>Comparar con el año:</label>
          <select
            value={filtroAñoComparacion}
            onChange={(e) => setFiltroAñoComparacion(e.target.value)}
          >
            <option value="">No comparar</option>
            {añosDisponibles
              .filter(año => año !== filtroAño) // No permitir comparar con el mismo año
              .map(año => (
                <option key={año} value={año}>{año}</option>
              ))}
          </select>
        </div>

        {/* Selector de Tipo de Gráfico */}
        <div className="chart-type-selector">
          <label>
            <input
              type="radio"
              value="barras"
              checked={tipoGrafico === "barras"}
              onChange={(e) => setTipoGrafico(e.target.value)}
            />
            Gráfico de Barras
          </label>
          <label>
            <input
              type="radio"
              value="lineas"
              checked={tipoGrafico === "lineas"}
              onChange={(e) => setTipoGrafico(e.target.value)}
            />
            Gráfico de Líneas
          </label>
        </div>

        {/* Contenedor del gráfico */}
        <ResponsiveContainer width="100%" height={400}>
          {tipoGrafico === "barras" && (
            <BarChart
              data={processedDatosParaGrafico(datosAñoSeleccionadoRaw)} // Utiliza solo los datos del año seleccionado para barras
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="fechaFormatted" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip cursor={{ fill: "#333" }} contentStyle={{ backgroundColor: "#272e3a", border: "none", borderRadius: "5px" }} />
              <Legend wrapperStyle={{ color: "#fff", paddingTop: "5px", borderRadius: "5px" }} />
              <Bar dataKey={tipoDato} fill="#8884d8" name={tipoDato.replace(/_/g, ' ').toUpperCase()} />
            </BarChart>
          )}

          {tipoGrafico === "lineas" && (
            <LineChart
              data={datosCombinadosParaLineChart}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="fecha" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ backgroundColor: "#272e3a", border: "none", borderRadius: "5px" }} />
              <Legend wrapperStyle={{ color: "#fff", paddingTop: "5px", borderRadius: "5px" }} />
              <Line
                type="monotone"
                dataKey="tipoDatoAñoSeleccionado"
                stroke="#32CD32"
                name={`${tipoDato.charAt(0).toUpperCase() + tipoDato.slice(1).replace(/_/g, ' ')} ${filtroAño}`}
              />
              {filtroAñoComparacion && (
                <Line
                  type="monotone"
                  dataKey="tipoDatoAñoComparado"
                  stroke="#00BFFF"
                  name={`${tipoDato.charAt(0).toUpperCase() + tipoDato.slice(1).replace(/_/g, ' ')} ${filtroAñoComparacion}`}
                />
              )}
            </LineChart>
          )}
        </ResponsiveContainer>

        {/* La tabla de datos ha sido eliminada de aquí */}
      </div>
      <Footer />
    </>
  );
};

export default EstadisticasVinedo;

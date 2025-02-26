import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Line, LineChart } from "recharts";
import Footer from "../../components/Footer/footer";
import Header from "../../components/Header/header";
import './estadisticas.css';

const EstadisticasVinedo = () => {
  const [datos, setDatos] = useState([]);
  const [filtroAño, setFiltroAño] = useState("2025");
  const [filtroAñoComparacion, setFiltroAñoComparacion] = useState("2024");
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroDia, setFiltroDia] = useState("");
  const [filtroSector, setFiltroSector] = useState("todos");
  const [filtroPlantacion, setFiltroPlantacion] = useState("todos");
  const [tipoDato, setTipoDato] = useState("humedad");
  const [tipoGrafico, setTipoGrafico] = useState("barras"); // Estado para seleccionar el tipo de gráfico

  useEffect(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => setDatos(data.datos))
      .catch(error => console.error("Error al cargar los datos:", error));
  }, []);

  const añoActual = new Date().getFullYear();
  const añoSeleccionado = filtroAño === "" ? añoActual : parseInt(filtroAño, 10);
  const añoComparado = filtroAñoComparacion === "" ? añoActual : parseInt(filtroAñoComparacion, 10);

  const datosFiltrados = datos.filter(dato => {
    const [dia, mes, año] = dato.fecha.split('/').map(num => parseInt(num, 10));
    const fechaDato = new Date(año, mes - 1, dia);

    const añoDato = fechaDato.getFullYear();
    const mesDato = fechaDato.getMonth() + 1;
    const diaDato = fechaDato.getDate();

    const añoValido = (añoDato === añoSeleccionado || añoDato === añoComparado);
    const mesValido = filtroMes === "" || mesDato.toString() === filtroMes;
    const diaValido = filtroDia === "" || diaDato.toString() === filtroDia;
    const sectorValido = filtroSector === "todos" || dato.sector === filtroSector;
    const plantacionValida = filtroPlantacion === "todos" || dato.plantacion === filtroPlantacion;

    return añoValido && mesValido && diaValido && sectorValido && plantacionValida;
  });

  const datosAñoSeleccionado = datosFiltrados.filter(dato => {
    const [dia, mes, año] = dato.fecha.split('/').map(num => parseInt(num, 10));
    return año === añoSeleccionado;
  }).map(dato => ({
    fecha: dato.fecha,
    tipoDato: tipoDato === "clima" ? dato.temperatura_med : dato.humedad_med,
  }));

  const datosAñoComparacion = datosFiltrados.filter(dato => {
    const [dia, mes, año] = dato.fecha.split('/').map(num => parseInt(num, 10));
    return año === añoComparado;
  }).map(dato => ({
    fecha: dato.fecha,
    tipoDato: tipoDato === "clima" ? dato.temperatura_med : dato.humedad_med,
  }));

  const datosCombinados = [];
  datosAñoSeleccionado.forEach(datoAñoSeleccionado => {
    const fecha = datoAñoSeleccionado.fecha;
    const [dia, mes] = fecha.split('/');
    const fechaSinAño = `${dia}/${mes}`;

    const datoAñoComparacion = datosAñoComparacion.find(dato => {
      const [diaComp, mesComp] = dato.fecha.split('/');
      return `${diaComp}/${mesComp}` === fechaSinAño;
    });

    datosCombinados.push({
      fecha: fechaSinAño,
      tipoDatoAñoSeleccionado: datoAñoSeleccionado.tipoDato || 0,
      tipoDatoAñoComparado: datoAñoComparacion ? datoAñoComparacion.tipoDato : 0,
    });
  });

  const años = [...new Set(datos.map(dato => new Date(dato.fecha).getFullYear()))];
  const meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const dias = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <>
      <Header/>

      <div className="estadisticas-container">
        <h2>Estadísticas del Viñedo</h2>
        <div className="filters-container">
          <select value={filtroAño} onChange={(e) => setFiltroAño(e.target.value)}>
            {años.map(año => (
              <option key={año} value={año}>{año}</option>
            ))}
          </select>
          <select value={filtroAñoComparacion} onChange={(e) => setFiltroAñoComparacion(e.target.value)}>
            {años.map(año => (
              <option key={año} value={año}>{año}</option>
            ))}
          </select>
          <select value={filtroMes} onChange={(e) => setFiltroMes(e.target.value)}>
            <option value="">Selecciona el mes</option>
            {meses.map(mes => (
              <option key={mes} value={mes}>{mes}</option>
            ))}
          </select>
          <select value={filtroDia} onChange={(e) => setFiltroDia(e.target.value)}>
            <option value="">Selecciona el día</option>
            {dias.map(dia => (
              <option key={dia} value={dia}>{dia}</option>
            ))}
          </select>
          {/* <select value={filtroSector} onChange={(e) => setFiltroSector(e.target.value)}>
            <option value="todos">Todos los sectores</option>
            <option value="norte">Norte</option>
            <option value="sur">Sur</option>
          </select>
          <select value={filtroPlantacion} onChange={(e) => setFiltroPlantacion(e.target.value)}>
            <option value="todos">Todos los tipos de plantación</option>
            <option value="uva blanca">Uva Blanca</option>
            <option value="uva tinta">Uva Tinta</option>
          </select> */}
          <select value={tipoDato} onChange={(e) => setTipoDato(e.target.value)}>
            <option value="humedad">Humedad</option>
            <option value="clima">Clima</option>
          </select>
          <select value={tipoGrafico} onChange={(e) => setTipoGrafico(e.target.value)}>
            <option value="barras">Gráfico de Barras</option>
            <option value="linea">Gráfico de Línea</option>
          </select>
        </div>

        <ResponsiveContainer width="97%" height={350}>
          {tipoGrafico === "barras" ? (
            <BarChart data={datosCombinados}>
              <XAxis dataKey="fecha" stroke="#fff"/>
              <YAxis stroke="#fff" />
              <Tooltip
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const fechaStr = payload[0].payload.fecha;

                  return (
                    <div style={{ backgroundColor: "#374151", color: "#fff", padding: "10px", borderRadius: "5px" }}>
                      <span>{`Fecha: ${fechaStr}`}</span>
                      {payload.map((entry, index) => {
                        const value = entry.value;
                        const unit = tipoDato === "clima" ? "°C" : "%"; 
                        return (
                          <div key={index}>
                            <span>{`${entry.name}: ${value}${unit}`}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              />
              <Legend wrapperStyle={{ backgroundColor: "#374151", color: "#fff", padding: "5px", borderRadius: "5px" }} />
              <Bar
                type="monotone"
                dataKey="tipoDatoAñoSeleccionado"
                fill="#32CD32"
                name={`${tipoDato.charAt(0).toUpperCase() + tipoDato.slice(1)} ${filtroAño}`}
              />
              <Bar
                type="monotone"
                dataKey="tipoDatoAñoComparado"
                fill="#00BFFF"
                name={`${tipoDato.charAt(0).toUpperCase() + tipoDato.slice(1)} ${filtroAñoComparacion}`}
              />
            </BarChart>
          ) : (
            <LineChart data={datosCombinados}>
              <XAxis dataKey="fecha" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                content={({ payload }) => {
                  if (!payload || payload.length === 0) return null;
                  const fechaStr = payload[0].payload.fecha;

                  return (
                    <div style={{ backgroundColor: "#374151", color: "#fff", padding: "10px", borderRadius: "5px" }}>
                      <span>{`Fecha: ${fechaStr}`}</span>
                      {payload.map((entry, index) => {
                        const value = entry.value;
                        const unit = tipoDato === "clima" ? "°C" : "%";
                        return (
                          <div key={index}>
                            <span>{`${entry.name}: ${value}${unit}`}</span>
                          </div>
                        );
                      })}
                    </div>
                  );
                }}
              />
              <Legend wrapperStyle={{ backgroundColor: "#374151", color: "#fff", padding: "5px", borderRadius: "5px" }} />
              <Line
                type="monotone"
                dataKey="tipoDatoAñoSeleccionado"
                stroke="#32CD32"
                name={`${tipoDato.charAt(0).toUpperCase() + tipoDato.slice(1)} ${filtroAño}`}
              />
              <Line
                type="monotone"
                dataKey="tipoDatoAñoComparado"
                stroke="#00BFFF"
                name={`${tipoDato.charAt(0).toUpperCase() + tipoDato.slice(1)} ${filtroAñoComparacion}`}
              />
            </LineChart>
          )}
        </ResponsiveContainer>

        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Humedad Promedio</th>
              <th>Temp. Promedio</th>
              <th>Temp. Máxima</th>
              <th>Temp. Mínima</th>
              <th>Precipitaciones</th>
            </tr>
          </thead>
          <tbody>
            {datosFiltrados.map((dato, index) => (
              <tr key={index}>
                <td>{dato.fecha}</td>
                <td>{dato.humedad_med}%</td>
                <td>{dato.temperatura_med}°C</td>
                <td>{dato.temperatura_max}°C</td>
                <td>{dato.temperatura_min}°C</td>
                <td>{dato.precipitacion_mm} mm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Footer/>
    </>
  );
};

export default EstadisticasVinedo;

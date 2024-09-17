import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const HumedadList = () => {
  const [humedadData, setHumedadData] = useState([]);

  useEffect(() => {
    const fetchHumedadData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/humedad');
        setHumedadData(response.data);
      } catch (error) {
        console.error("Error al obtener los datos de humedad", error);
      }
    };

    fetchHumedadData();
  }, []);

  return (
    <Container>
      <h2>Lecturas de Humedad</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Valor de Humedad</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {humedadData.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.id}</td>
              <td>{entry.valor} %</td>
              <td>{new Date(entry.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
};

export default HumedadList;

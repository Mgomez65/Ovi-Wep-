import React, { useState } from 'react';
import './mapa.css';

const VineyardMap = () => {
    const [selectedArea, setSelectedArea] = useState(null);

    const handleAreaClick = (area) => {
        setSelectedArea(area);
    };

    return (
        <div className="vineyard-map">
            <h1>Mapa Interactivo del Viñedo</h1>
            <div className="map">
                {/* Borde para Área 1 */}
                <div className="area-border area1-border"></div>
                <div
                    className="area area1"
                    onClick={() => handleAreaClick('Zona 1')}
                >
                    Zona 1
                </div>

                <div
                    className="area area2"
                    onClick={() => handleAreaClick('Zona 2')}
                >
                    Zona 2
                </div>
                <div
                    className="area area3"
                    onClick={() => handleAreaClick('Zona 3')}
                >
                    Zona 3
                </div>
                {/* Añade más áreas según sea necesario */}
            </div>
            {selectedArea && (
                <div className="info">
                    <h2>Información de {selectedArea}</h2>
                    <p>Detalles sobre {selectedArea} aquí...</p>
                </div>
            )}
        </div>
    );
};

export default VineyardMap;

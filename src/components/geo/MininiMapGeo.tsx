"use client";

import React, { useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { geoMercator } from "d3-geo";

type MiniMapProps = {
  lat: number;
  lng: number;
  radiusKm: number;
  geoJson: any; // GeoJSON France ou départements
};

const MiniMap = ({ lat, lng, radiusKm, geoJson }: MiniMapProps) => {
  // Scale dynamique selon le rayon
  const scale = useMemo(() => Math.max(1300, 13000 - radiusKm * 200), [radiusKm]);

  // Projection pour convertir lat/lng en x/y SVG
  const projection = useMemo(() => geoMercator().center([lng, lat]).scale(scale).translate([150, 150]), [lat, lng, scale]);

  // Rayon en degrés approximatif pour le SVG
  // 1° ~ 111 km => radius en px sur la projection
  const [cx, cy] = projection([lng, lat]) || [150, 150];
  const radiusPx = radiusKm * (scale / 11100); // ajustement empirique

  return (
    <ComposableMap width={300} height={300}>
      <Geographies geography={geoJson}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              style={{
                default: { fill: "#EAEAEC", stroke: "#333" },
                hover: { fill: "#F53" },
                pressed: { fill: "#E42" },
              }}
            />
          ))
        }
      </Geographies>

      {/* Cercle rayon */}
      <circle cx={cx} cy={cy} r={radiusPx} fill="rgba(245,83,83,0.2)" stroke="#F53" strokeWidth={1} />
    </ComposableMap>
  );
};

export default MiniMap;

"use client";

import { useRouter } from "next/navigation";
import React, { useState, useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// Fichiers topojson / geojson
const REGIONS_GEO_URL = "/france-regions.geojson"; // régions + DOM-TOM
const DEPARTMENTS_GEO_URL = "/france-departments.geojson"; // départements

export default function FranceMap() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const router = useRouter();

  const handleRegionClick = (regionCode: string) => {
    setSelectedRegion(regionCode);
    router.push(`/search?region=${regionCode}`);
  };

  const handleDepartmentClick = (deptCode: string) => {
    router.push(`/search?department=${deptCode}`);
  };

  // Zoom / center pour la région sélectionnée
  const projectionConfig = useMemo(() => {
    if (!selectedRegion)
      return { scale: 1000, center: [2.5, 46.5] as [number, number] }; // France entière

    // Coordonnées approximatives des centres de région
    const centers: Record<string, [number, number]> = {
      "Île-de-France": [2.35, 48.85],
      Bretagne: [-2.93, 48.1],
      // ... ajouter toutes les régions
    };

    return {
      scale: 2000,
      center: centers[selectedRegion] || ([2.5, 46.5] as [number, number]),
    };
  }, [selectedRegion]);

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={projectionConfig}
      width={800}
      height={600}
    >
      {/* Régions */}
      <Geographies geography={REGIONS_GEO_URL}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              onClick={() => handleRegionClick(geo.properties.nom)}
              style={{
                default: { fill: "#EAEAEC", stroke: "#333", strokeWidth: 0.5 },
                hover: { fill: "#F53", cursor: "pointer" },
                pressed: { fill: "#E42", cursor: "pointer" },
              }}
            />
          ))
        }
      </Geographies>

      {/* Départements (uniquement si une région est sélectionnée) */}
      {selectedRegion && (
        <Geographies geography={DEPARTMENTS_GEO_URL}>
          {({ geographies }) =>
            geographies
              .filter((geo) => geo.properties.region_nom === selectedRegion)
              .map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleDepartmentClick(geo.properties.code)}
                  style={{
                    default: {
                      fill: "#D1E8FF",
                      stroke: "#666",
                      strokeWidth: 0.3,
                    },
                    hover: { fill: "#00BFFF", cursor: "pointer" },
                    pressed: { fill: "#0099FF", cursor: "pointer" },
                  }}
                />
              ))
          }
        </Geographies>
      )}
    </ComposableMap>
  );
}

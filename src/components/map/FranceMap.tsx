// src/components/FranceMap.tsx
"use client";

import { geoCentroid } from "d3-geo";
import React, { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { DEPT_TO_REGION } from "@/data/dptToRegion"; 

const REGIONS_GEO_URL = "/france-regions.geojson";
const DEPARTMENTS_GEO_URL = "/france-departments.geojson";

export default function FranceMap() {
  const [regionsGeo, setRegionsGeo] = useState<any | null>(null);
  const [departmentsGeo, setDepartmentsGeo] = useState<any | null>(null);

  const [selectedRegionCode, setSelectedRegionCode] = useState<string | null>(
    null
  );
  const [selectedRegionName, setSelectedRegionName] = useState<string | null>(
    null
  );

  /* ---------------- LOAD GEOJSON ---------------- */
  useEffect(() => {
    console.log("⏳ Loading regions…");
    fetch(REGIONS_GEO_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Regions loaded");
        console.log("Regions sample properties:", data.features[0].properties);
        setRegionsGeo(data);
      });

    console.log("⏳ Loading departments…");
    fetch(DEPARTMENTS_GEO_URL)
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Departments loaded");
        console.log(
          "Departments sample properties:",
          data.features[0].properties
        );
        setDepartmentsGeo(data);
      });
  }, []);

  /* ---------------- PROJECTION ---------------- */
  const projectionConfig = useMemo(() => {
    if (!selectedRegionCode || !regionsGeo) {
      console.log("📍 Projection = France");
      return { scale: 1800, center: [2.5, 46.5] as [number, number] };
    }

    const regionFeature = regionsGeo.features.find(
      (f: any) => f.properties.code === selectedRegionCode
    );

    console.log("📍 Projection = REGION");
    console.log("Region centroid:", geoCentroid(regionFeature));

    return {
      scale: 6300,
      center: geoCentroid(regionFeature) as [number, number],
    };
  }, [selectedRegionCode, regionsGeo]);

  if (!regionsGeo || !departmentsGeo) {
    return <div>Loading map…</div>;
  }

  /* ---------------- HANDLERS ---------------- */
  const handleRegionClick = (geo: any) => {
    console.log("🟦 REGION CLICKED:", geo.properties.nom, geo.properties.code);
    setSelectedRegionCode(geo.properties.code);
    setSelectedRegionName(geo.properties.nom);
  };

  const handleDepartmentClick = (geo: any) => {
    console.log(
      "🟩 DEPARTMENT CLICKED:",
      geo.properties.nom,
      geo.properties.code
    );
  };

  /* ---------------- RENDER ---------------- */
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={projectionConfig}
      width={800}
      height={600}
    >
      {/* Regions */}
      <Geographies geography={regionsGeo}>
        {({ geographies }) =>
          geographies
            .filter(
              (geo) =>
                !selectedRegionCode ||
                geo.properties.code === selectedRegionCode
            )
            .map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleRegionClick(geo)}
                style={{
                  default: {
                    fill:
                      selectedRegionCode === geo.properties.code
                        ? "#F0F0F0"
                        : "#EAEAEC",
                    stroke: "#333",
                    strokeWidth: 0.5,
                  },
                  hover: {
                    fill:
                      selectedRegionCode === geo.properties.code
                        ? "#F0F0F0"
                        : "#F53",
                    cursor: "pointer",
                  },
                  pressed: { fill: "#E42" },
                }}
              />
            ))
        }
      </Geographies>

      {/* Departments */}
      {selectedRegionCode && (
        <Geographies geography={departmentsGeo}>
          {({ geographies }) =>
            geographies
              .filter(
                (geo) =>
                  DEPT_TO_REGION[geo.properties.code] === selectedRegionCode
              )
              .map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleDepartmentClick(geo)}
                  style={{
                    default: {
                      fill: "#D1E8FF",
                      stroke: "#555",
                      strokeWidth: 0.3,
                    },
                    hover: { fill: "#00BFFF", cursor: "pointer" },
                  }}
                />
              ))
          }
        </Geographies>
      )}
    </ComposableMap>
  );
}

"use client";

import { geoCentroid } from "d3-geo";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// GeoJSON URLs
const REGIONS_GEO_URL = "/france-regions.geojson"; // regions + DOM-TOM
const DEPARTMENTS_GEO_URL = "/france-departments.geojson"; // departments

export default function FranceMap() {
  const router = useRouter();

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [regionsGeo, setRegionsGeo] = useState<any[]>([]);
  const [departmentsGeo, setDepartmentsGeo] = useState<any[]>([]);

  // Load regions
  useEffect(() => {
    fetch(REGIONS_GEO_URL)
      .then((res) => res.json())
      .then((data) => setRegionsGeo(data.features));
  }, []);

  // Load departments
  useEffect(() => {
    fetch(DEPARTMENTS_GEO_URL)
      .then((res) => res.json())
      .then((data) => setDepartmentsGeo(data.features));
  }, []);

  const handleRegionClick = (regionName: string) => {
    setSelectedRegion(regionName);
    router.push(`/search?region=${regionName}`);
  };

  const handleDepartmentClick = (deptCode: string) => {
    router.push(`/search?department=${deptCode}`);
  };

  // Compute projection dynamically for zoom
  const projectionConfig = useMemo(() => {
    if (!selectedRegion)
      return { scale: 1500, center: [2.5, 46.5] as [number, number] };

    const regionGeo = regionsGeo.find(
      (g) => g.properties.nom === selectedRegion
    );
    const center = regionGeo
      ? (geoCentroid(regionGeo) as [number, number])
      : ([2.5, 46.5] as [number, number]);

    return { scale: 4500, center };
  }, [selectedRegion, regionsGeo]);

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={projectionConfig}
      width={800}
      height={600}
    >
      {/* Regions */}
      <Geographies geography={REGIONS_GEO_URL}>
        {({ geographies }) =>
          geographies
            .filter(
              (geo) => !selectedRegion || geo.properties.nom === selectedRegion
            ) // show only selected region when zoomed
            .map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                onClick={() => handleRegionClick(geo.properties.nom)}
                style={{
                  default: {
                    fill:
                      geo.properties.nom === selectedRegion
                        ? "#F0F0F0"
                        : "#EAEAEC",
                    stroke: "#333",
                    strokeWidth: 0.5,
                  },
                  hover: { fill: "#F53", cursor: "pointer" },
                  pressed: { fill: "#E42", cursor: "pointer" },
                }}
              />
            ))
        }
      </Geographies>

      {/* Departments (if a region is selected) */}
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

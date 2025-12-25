"use client";

import React, { useEffect, useMemo, useState } from "react";
import { geoCentroid, geoContains } from "d3-geo";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { DEPT_TO_REGION } from "@/data/dptToRegion";

const REGIONS_URL = "/france-regions.geojson";
const DEPTS_URL = "/france-departments.geojson";
const CANTONS_URL = "/france-cantons/{dep}.geojson";
const COMMUNES_URL = "/france-communes-enriched/{dep}.geojson";

const STYLE = {
  default: { fill: "#EAEAEC", stroke: "#333", strokeWidth: 0.5 },
  hover: { fill: "#F53", cursor: "pointer" },
  pressed: { fill: "#E42" },
};

type Level = "region" | "department" | "canton" | "commune";

export default function FranceMap() {
  const [regions, setRegions] = useState<any>(null);
  const [departments, setDepartments] = useState<any>(null);
  const [cantons, setCantons] = useState<any>(null);
  const [communes, setCommunes] = useState<any>(null);

  const [level, setLevel] = useState<Level>("region");
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [selectedCanton, setSelectedCanton] = useState<any>(null);

  /* =======================
     LOAD BASE DATA
  ======================= */
  useEffect(() => {
    fetch(REGIONS_URL).then(r => r.json()).then(setRegions);
    fetch(DEPTS_URL).then(r => r.json()).then(setDepartments);
  }, []);

  /* =======================
     PROJECTION (SAFE)
  ======================= */
  const projectionConfig = useMemo(() => {
    const focus =
      level === "region"
        ? null
        : level === "department"
          ? selectedRegion
          : level === "canton"
            ? selectedDept
            : selectedCanton;

    if (!focus?.geometry) {
      return {
        scale: 1800,
        center: [2.5, 46.5] as [number, number],
      };
    }

    return {
      scale: level === "commune" ? 13000 : 6500,
      center: geoCentroid({
        type: "Feature",
        geometry: focus.geometry,
        properties: {},
      }) as [number, number],
    };
  }, [level, selectedRegion, selectedDept, selectedCanton]);

  if (!regions || !departments) return <div>Loading…</div>;

  /* =======================
     HANDLERS
  ======================= */

  const onRegionClick = (geo: any) => {
    setSelectedRegion(geo);
    setSelectedDept(null);
    setSelectedCanton(null);
    setCantons(null);
    setCommunes(null);
    setLevel("department");
  };

  const onDeptClick = async (geo: any) => {
    setSelectedDept(geo);
    setSelectedCanton(null);
    setCommunes(null);
    setLevel("canton");

    const data = await fetch(
      CANTONS_URL.replace("{dep}", geo.properties.code)
    ).then(r => r.json());

    setCantons(data);
  };

  const onCantonClick = async (geo: any) => {
    setSelectedCanton(geo);
    setLevel("commune");

    const data = await fetch(
      COMMUNES_URL.replace("{dep}", selectedDept.properties.code)
    ).then(r => r.json());

    // 🔑 Canton as GeoJSON Feature
    const cantonFeature = {
      type: "Feature",
      geometry: geo.geometry,
      properties: {},
    };

    // 🔑 Keep only communes whose centroid is inside the canton
    const filtered = data.features.filter((commune: any) => {
      const centroid = geoCentroid(commune);
      return geoContains(cantonFeature, centroid);
    });

    console.log("🏘 Communes in selected canton:", filtered.length);

    setCommunes({
      ...data,
      features: filtered,
    });
  };

  const back = () => {
    if (level === "commune") setLevel("canton");
    else if (level === "canton") setLevel("department");
    else if (level === "department") setLevel("region");
  };

  /* =======================
     RENDER
  ======================= */

  return (
    <div>
      <button onClick={back} disabled={level === "region"}>
        🔙 Back
      </button>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={projectionConfig}
        width={800}
        height={600}
      >
        {/* REGIONS */}
        {level === "region" && (
          <Geographies geography={regions}>
            {({ geographies }) =>
              geographies.map(g => (
                <Geography
                  key={g.rsmKey}
                  geography={g}
                  onClick={() => onRegionClick(g)}
                  style={STYLE}
                />
              ))
            }
          </Geographies>
        )}

        {/* DEPARTMENTS */}
        {level === "department" && (
          <Geographies geography={departments}>
            {({ geographies }) =>
              geographies
                .filter(
                  g =>
                    DEPT_TO_REGION[g.properties.code] ===
                    selectedRegion.properties.code
                )
                .map(g => (
                  <Geography
                    key={g.rsmKey}
                    geography={g}
                    onClick={() => onDeptClick(g)}
                    style={STYLE}
                  />
                ))
            }
          </Geographies>
        )}

        {/* CANTONS */}
        {level === "canton" && cantons && (
          <Geographies geography={cantons}>
            {({ geographies }) =>
              geographies.map(g => (
                <Geography
                  key={g.rsmKey}
                  geography={g}
                  onClick={() => onCantonClick(g)}
                  style={STYLE}
                />
              ))
            }
          </Geographies>
        )}

        {/* COMMUNES (ONLY IN SELECTED CANTON) */}
        {level === "commune" && communes && (
          <Geographies geography={communes}>
            {({ geographies }) =>
              geographies.map(g => (
                <Geography
                  key={g.rsmKey}
                  geography={g}
                  style={{
                    default: { fill: "#9ecae1", stroke: "#333", strokeWidth: 0.3 },
                    hover: { fill: "#3182bd" },
                    pressed: { fill: "#08519c" },
                  }}
                />
              ))
            }
          </Geographies>
        )}
      </ComposableMap>
    </div>
  );
}

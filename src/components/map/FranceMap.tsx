"use client";

import { geoCentroid } from "d3-geo";
import React, { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { DEPT_TO_REGION } from "@/data/dptToRegion";

const REGIONS_URL = "/france-regions.geojson";
const DEPTS_URL = "/france-departments.geojson";

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

  /* LOAD BASE FILES */
  useEffect(() => {
    fetch(REGIONS_URL)
      .then((r) => r.json())
      .then(setRegions);
    fetch(DEPTS_URL)
      .then((r) => r.json())
      .then(setDepartments);
  }, []);

  /* PROJECTION */
  const projectionConfig = useMemo(() => {
    const focus =
      level === "region"
        ? null
        : level === "department"
          ? selectedRegion
          : level === "canton"
            ? selectedDept
            : selectedCanton;

    if (!focus) {
      return { scale: 1800, center: [2.5, 46.5] as [number, number] };
    }

    return {
      scale: level === "commune" ? 13000 : 6500,
      center: geoCentroid(focus) as [number, number],
    };
  }, [level, selectedRegion, selectedDept, selectedCanton]);

  if (!regions || !departments) return <div>Loading…</div>;

  /* HANDLERS */
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
      `/france-cantons/${geo.properties.code}.geojson`
    ).then((r) => r.json());

    setCantons(data);
  };

  const onCantonClick = async (geo: any) => {
    setSelectedCanton(geo);
    setLevel("commune");

    // Charger toutes les communes du département
    const deptCode = selectedDept.properties.code;
    const data = await fetch(`/france-communes/${deptCode}.geojson`).then((r) =>
      r.json()
    );

    setCommunes(data); // NE PAS FILTRER ici si pas de canton_code
  };

  const back = () => {
    if (level === "commune") setLevel("canton");
    else if (level === "canton") setLevel("department");
    else if (level === "department") setLevel("region");
  };

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
              geographies.map((g) => (
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
                  (g) =>
                    DEPT_TO_REGION[g.properties.code] ===
                    selectedRegion.properties.code
                )
                .map((g) => (
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
              geographies.map((g) => (
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

        {/* COMMUNES */}
        {level === "commune" && communes && selectedCanton && (
          <Geographies geography={communes}>
            {({ geographies }) =>
              geographies.map((g) => (
                <Geography key={g.rsmKey} geography={g} style={STYLE} />
              ))
            }
          </Geographies>
        )}
      </ComposableMap>
    </div>
  );
}

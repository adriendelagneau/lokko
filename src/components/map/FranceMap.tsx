/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { geoCentroid } from "d3-geo";
import { ArrowLeftIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { DEPT_TO_REGION } from "@/data/dptToRegion";

/* =======================
   DATA URLS
======================= */
const REGIONS_URL = "/france-regions.geojson";
const DEPTS_URL = "/france-departments.geojson";

/* =======================
   TYPES
======================= */
type Level = "region" | "department";

/* =======================
   BASE STYLE
======================= */
const BASE_STYLE = {
  stroke: "#333",
  strokeWidth: 0.5,
};

export default function FranceMap() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* =======================
     STATE
  ======================= */
  const [regions, setRegions] = useState<any>(null);
  const [departments, setDepartments] = useState<any>(null);

  const [level, setLevel] = useState<Level>("region");
  const [selectedRegion, setSelectedRegion] = useState<any>(null);
  const [selectedDeptCode, setSelectedDeptCode] = useState<string | null>(null);

  /* =======================
     LOAD DATA
  ======================= */
  useEffect(() => {
    fetch(REGIONS_URL)
      .then((r) => r.json())
      .then(setRegions);
    fetch(DEPTS_URL)
      .then((r) => r.json())
      .then(setDepartments);
  }, []);

  /* =======================
     URL → STATE SYNC
  ======================= */
  useEffect(() => {
    if (!regions) return;

    const regionCode = searchParams.get("region");
    const deptCode = searchParams.get("dept");

    if (regionCode) {
      const region = regions.features.find(
        (r: any) => r.properties.code === regionCode
      );

      if (region) {
        setSelectedRegion(region);
        setLevel("department");
      }
    }

    if (deptCode) {
      setSelectedDeptCode(deptCode);
    }
  }, [regions, searchParams]);

  /* =======================
     PROJECTION
  ======================= */
  const projectionConfig = useMemo(() => {
    if (level === "region" || !selectedRegion?.geometry) {
      return {
        scale: 1800,
        center: [2.5, 46.5] as [number, number],
      };
    }

    return {
      scale: 6500,
      center: geoCentroid(selectedRegion) as [number, number],
    };
  }, [level, selectedRegion]);

  if (!regions || !departments) return <div>Loading…</div>;

  /* =======================
     HANDLERS
  ======================= */
  const onRegionClick = (geo: any) => {
    const regionCode = geo.properties.code;

    setSelectedRegion(geo);
    setSelectedDeptCode(null);
    setLevel("department");

    router.push(`?region=${regionCode}`, { scroll: false });
  };

  const onDepartmentClick = (geo: any) => {
    const deptCode = geo.properties.code;
    const regionCode = selectedRegion.properties.code;

    setSelectedDeptCode(deptCode);

    router.push(`?region=${regionCode}&dept=${deptCode}`, {
      scroll: false,
    });
  };

  const back = () => {
    setLevel("region");
    setSelectedRegion(null);
    setSelectedDeptCode(null);

    router.push("?", { scroll: false });
  };

  /* =======================
     STYLE HELPERS
  ======================= */
  const getRegionStyle = () => ({
    default: { fill: "#EAEAEC", ...BASE_STYLE },
    hover: { fill: "#F53", cursor: "pointer" },
    pressed: { fill: "#E42" },
  });

  const getDeptStyle = (deptCode: string) => {
    const isSelected = deptCode === selectedDeptCode;

    return {
      default: {
        fill: isSelected ? "#E42" : "#EAEAEC",
        ...BASE_STYLE,
      },
      hover: {
        fill: "#F53",
        cursor: "pointer",
      },
      pressed: {
        fill: "#E42",
      },
    };
  };

  /* =======================
     RENDER
  ======================= */
  return (
    <div>
      {level === "department" && (
        <button onClick={back} className="mb-2 flex items-center">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </button>
      )}

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
                  style={getRegionStyle()}
                />
              ))
            }
          </Geographies>
        )}

        {/* DEPARTMENTS */}
        {level === "department" && selectedRegion && (
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
                    onClick={() => onDepartmentClick(g)}
                    style={getDeptStyle(g.properties.code)}
                  />
                ))
            }
          </Geographies>
        )}
      </ComposableMap>
    </div>
  );
}

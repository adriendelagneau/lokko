"use client";

import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import MiniMap from "./MininiMapGeo";

export default function GeoSearchMiniMap({ geoJson }: { geoJson: any }) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [radius, setRadius] = useState(10);

  const handleGeoLocate = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    });
  };

  return (
    <div className="space-y-4">
      <button onClick={handleGeoLocate}>📍 Se géolocaliser</button>

      {coords && (
        <>
          <MiniMap lat={coords.lat} lng={coords.lng} radiusKm={radius} geoJson={geoJson} />

          <div className="flex items-center space-x-2">
            <span>Rayon: {radius} km</span>
            <Slider
              value={[radius]}
              min={1}
              max={50}
              step={1}
              onValueChange={(val) => setRadius(val[0])}
            />
          </div>
        </>
      )}
    </div>
  );
}

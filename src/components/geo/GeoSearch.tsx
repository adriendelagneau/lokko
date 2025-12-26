"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface UserCoords {
  lat: number;
  lng: number;
}

// Leaflet Map uniquement côté client
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

export default function GeoSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);
  const [isGeoLocated, setIsGeoLocated] = useState(false);
  const [radius, setRadius] = useState(
    parseInt(searchParams.get("geoRadiusKm") || "10")
  );
  const [city, setCity] = useState(searchParams.get("locationCity") || "");

  // Mettre à jour l'URL
  const updateUrl = (params: Record<string, string | null>) => {
    const current = Object.fromEntries(searchParams.entries());
    const newParams = { ...current, ...params };
    const url = new URL(window.location.href);
    Object.keys(newParams).forEach((key) => {
      if (!newParams[key]) url.searchParams.delete(key);
      else url.searchParams.set(key, newParams[key]!);
    });
    router.replace(url.pathname + url.search);
  };

  // Géolocalisation
  const handleGeoLocate = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        setIsGeoLocated(true);
        updateUrl({
          geoLat: coords.lat.toString(),
          geoLng: coords.lng.toString(),
          geoRadiusKm: radius.toString(),
        });
      },
      (err) => alert(`Impossible de récupérer votre position : ${err.message}`),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
      {/* Ville input */}
      <div>
        <Label htmlFor="city">Votre ville</Label>
        <Input
          id="city"
          placeholder="Ex: Paris"
          value={city}
          onChange={(e) => {
            setCity(e.target.value);
            updateUrl({ locationCity: e.target.value || null });
          }}
        />
      </div>

      {/* Géolocalisation */}
      <div>
        <Button onClick={handleGeoLocate}>Me géolocaliser</Button>
        {isGeoLocated && userCoords && (
          <div className="mt-2 text-sm text-gray-700">
            Position détectée : {userCoords.lat.toFixed(5)},{" "}
            {userCoords.lng.toFixed(5)}
          </div>
        )}
      </div>

      {/* Rayon */}
      {isGeoLocated && (
        <div>
          <Label htmlFor="radius">
            Rayon autour de votre position (km): {radius}
          </Label>
          <Slider
            id="radius"
            value={[radius]}
            onValueChange={(val) => {
              setRadius(val[0]);
              updateUrl({ geoRadiusKm: val[0].toString() });
            }}
            max={100}
            step={1}
          />
        </div>
      )}

      {/* Mini-map */}
      {isGeoLocated && userCoords && (
        <div className="mt-4 h-64 w-full overflow-hidden rounded-lg">
          <LeafletMap center={userCoords} radius={radius} />
        </div>
      )}
    </div>
  );
}

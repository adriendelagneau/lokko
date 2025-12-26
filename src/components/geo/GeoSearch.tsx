"use client";

import debounce from "lodash.debounce";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

/* ---------------- Types ---------------- */

type Commune = {
  nom: string;
  codesPostaux: string[];
  departement: { nom: string; code: string };
  region: { nom: string; code: string };
  centre?: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
};

type UserCoords = {
  lat: number;
  lng: number;
};

function getCoordinates(commune: Commune): UserCoords | null {
  if (!commune.centre?.coordinates) return null;
  const [lng, lat] = commune.centre.coordinates;
  return { lat, lng };
}

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

/* ---------------- Component ---------------- */

export default function GeoSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);
  const [isGeoLocated, setIsGeoLocated] = useState(false);

  const [radius, setRadius] = useState(
    parseInt(searchParams.get("geoRadiusKm") || "10")
  );

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Commune[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  /* ---------------- URL sync ---------------- */

  const updateUrl = (params: Record<string, string | null>) => {
    const current = Object.fromEntries(searchParams.entries());
    const next = { ...current, ...params };

    const url = new URL(window.location.href);
    Object.entries(next).forEach(([k, v]) => {
      if (!v) url.searchParams.delete(k);
      else url.searchParams.set(k, v);
    });

    router.replace(url.pathname + url.search);
  };

  /* ---------------- Init from URL ---------------- */

  useEffect(() => {
    const lat = searchParams.get("geoLat");
    const lng = searchParams.get("geoLng");

    if (lat && lng) {
      setUserCoords({ lat: parseFloat(lat), lng: parseFloat(lng) });
      setIsGeoLocated(true);
    }
  }, []);

  /* ---------------- Commune autocomplete ---------------- */

  const fetchCities = async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/city?q=${encodeURIComponent(q)}`);
      const data: Commune[] = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchCities, 250), []);

  useEffect(() => {
    if (isFocused) debouncedFetch(query);
  }, [query, isFocused, debouncedFetch]);

  const handleSelectCity = (commune: Commune) => {
    const coords = getCoordinates(commune);
    if (!coords) return;

    setQuery(`${commune.nom} (${commune.codesPostaux[0]})`);
    setUserCoords(coords);
    setIsGeoLocated(true);
    setSuggestions([]);
    setIsFocused(false);

    updateUrl({
      geoLat: coords.lat.toString(),
      geoLng: coords.lng.toString(),
      geoRadiusKm: radius.toString(),
    });
  };

  /* ---------------- Geolocation ---------------- */

  const handleGeoLocate = () => {
    if (!navigator.geolocation) return alert("Géolocalisation non supportée");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        setUserCoords(coords);
        setIsGeoLocated(true);
        setQuery("");

        updateUrl({
          geoLat: coords.lat.toString(),
          geoLng: coords.lng.toString(),
          geoRadiusKm: radius.toString(),
        });
      },
      (err) => alert(err.message),
      { enableHighAccuracy: true }
    );
  };

  /* ---------------- Reset ---------------- */

  const resetLocation = () => {
    setUserCoords(null);
    setIsGeoLocated(false);
    setQuery("");
    setSuggestions([]);

    updateUrl({
      geoLat: null,
      geoLng: null,
      geoRadiusKm: null,
    });
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="space-y-4 rounded-lg border p-4 shadow-sm">
      {/* Commune */}
      <div className="relative">
        <Label className="mb-2 text-lg">Une Commune :</Label>
        <Input
          placeholder="Commencez à taper une commune..."
          value={query}
          disabled={isGeoLocated}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          className="w-64"
        />

        {isFocused && loading && (
          <p className="text-muted-foreground mt-1 text-sm">Recherche…</p>
        )}

        {isFocused && suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow">
            {suggestions.map((commune) => {
              const hasCoords = !!commune.centre?.coordinates;

              return (
                <li
                  key={`${commune.nom}-${commune.codesPostaux[0]}`}
                  className={`px-3 py-2 ${
                    hasCoords
                      ? "cursor-pointer hover:bg-gray-100"
                      : "text-muted-foreground cursor-not-allowed"
                  }`}
                  onMouseDown={() => hasCoords && handleSelectCity(commune)}
                >
                  {commune.nom} ({commune.codesPostaux[0]}) –{" "}
                  {commune.departement.nom}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Actions */}
      <div className="text-lg">Me Geolocaliser :</div>
      <div className="flex gap-2">
        <Button onClick={handleGeoLocate}>Me géolocaliser</Button>
        {isGeoLocated && (
          <Button variant="ghost" onClick={resetLocation}>
            Changer de zone
          </Button>
        )}
      </div>

      {/* Radius */}
      {isGeoLocated && (
        <div>
          <Label className="text-lg">Rayon : {radius} km</Label>
          <Slider
            value={[radius]}
            onValueChange={(v) => {
              setRadius(v[0]);
              updateUrl({ geoRadiusKm: v[0].toString() });
            }}
            max={100}
            step={5}
            className="w-64"
          />
        </div>
      )}

      {/* Map */}
      {isGeoLocated && userCoords && (
        <div className="h-64 w-full overflow-hidden rounded-lg">
          <LeafletMap center={userCoords} radius={radius} />
        </div>
      )}
    </div>
  );
}

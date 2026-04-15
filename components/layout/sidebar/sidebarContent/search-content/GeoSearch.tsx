"use client";

import debounce from "lodash.debounce";
import { MapPinIcon, Loader2, X, Check } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useSearchState } from "@/hooks/use-search-state";

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
  const { queryObj, updateSearch } = useSearchState();

  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);
  const [isGeoLocated, setIsGeoLocated] = useState(false);

  const radius = Number(queryObj.geoRadiusKm ?? 10);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Commune[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [isLocating, setIsLocating] = useState(false);
  const [geoStatus, setGeoStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );

  /* ---------------- Init from URL ---------------- */

  useEffect(() => {
    const lat = Number(queryObj.geoLat);
    const lng = Number(queryObj.geoLng);

    if (lat && lng) {
      setUserCoords({ lat, lng });
      setIsGeoLocated(true);
      setGeoStatus("success");
    }
  }, [queryObj.geoLat, queryObj.geoLng]);

  /* ---------------- Commune autocomplete ---------------- */

  const fetchCities = async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoadingCities(true);
    try {
      const res = await fetch(`/api/city?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error();
      const data: Commune[] = await res.json();
      setSuggestions(data);
    } catch {
      setSuggestions([]);
    } finally {
      setLoadingCities(false);
    }
  };

  const debouncedFetch = useMemo(() => debounce(fetchCities, 250), []);

  useEffect(() => {
    if (isFocused) debouncedFetch(query);
  }, [query, isFocused, debouncedFetch]);

  const handleSelectCity = (commune: Commune) => {
    const coords = getCoordinates(commune);
    if (!coords) return;

    setQuery(`${commune.nom} (${commune.codesPostaux[0]})`);
    setUserCoords(coords);
    setIsGeoLocated(true);
    setGeoStatus("success");
    setSuggestions([]);
    setIsFocused(false);

    updateSearch({
      geoLat: coords.lat,
      geoLng: coords.lng,
      geoRadiusKm: radius,
    });
  };

  /* ---------------- Geolocation ---------------- */

  const handleGeoLocate = async () => {
    if (!navigator.geolocation) {
      toast.error("Géolocalisation non supportée par votre navigateur");
      return;
    }

    setIsLocating(true);
    setGeoStatus("idle");

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permission.state === "denied") {
        toast.error("Veuillez autoriser la géolocalisation dans vos paramètres");
        setGeoStatus("error");
        setIsLocating(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };

          setUserCoords(coords);
          setIsGeoLocated(true);
          setQuery("");
          setGeoStatus("success");
          setIsLocating(false);

          updateSearch({
            geoLat: coords.lat,
            geoLng: coords.lng,
            geoRadiusKm: radius,
          });
          
          toast.success("Position actualisée");
        },
        (err) => {
          console.warn("Geolocation error:", err.message);
          setGeoStatus("error");
          setIsLocating(false);
          toast.error("Impossible de vous localiser");
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        }
      );
    } catch {
      setGeoStatus("error");
      setIsLocating(false);
      toast.error("Une erreur est survenue lors de la géolocalisation");
    }
  };

  /* ---------------- Reset ---------------- */

  const resetLocation = () => {
    setUserCoords(null);
    setIsGeoLocated(false);
    setQuery("");
    setSuggestions([]);
    setGeoStatus("idle");

    updateSearch({
      geoLat: null,
      geoLng: null,
      geoRadiusKm: null,
    });
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="space-y-4 rounded-lg border p-4 shadow-sm">
      {/* Commune */}
      <div className="relative space-y-2">
        <Label className="text-lg font-medium">Une commune</Label>
        <Input
          placeholder="Ex: Paris, Lyon..."
          value={query}
          disabled={isGeoLocated}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full"
        />

        {isFocused && loadingCities && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            Recherche…
          </div>
        )}

        {isFocused && suggestions.length > 0 && (
          <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background shadow-lg">
            {suggestions.map((commune) => {
              const hasCoords = !!commune.centre?.coordinates;

              return (
                <li
                  key={`${commune.nom}-${commune.codesPostaux[0]}`}
                  className={`px-3 py-2 text-sm transition-colors ${
                    hasCoords
                      ? "cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      : "text-muted-foreground cursor-not-allowed"
                  }`}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    if (hasCoords) handleSelectCity(commune);
                  }}
                >
                  <span className="font-medium">{commune.nom}</span> ({commune.codesPostaux[0]})
                  <div className="text-xs opacity-70">{commune.departement.nom}</div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <div className="space-y-1">
          <Label className="text-sm font-medium">Autour de moi</Label>
          <div className="flex items-center gap-2">
            <Button 
              size="sm"
              variant={geoStatus === "success" ? "default" : "outline"}
              onClick={handleGeoLocate} 
              disabled={isLocating}
              className="h-9 w-9 p-0"
            >
              {isLocating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPinIcon className="h-4 w-4" />
              )}
            </Button>

            {geoStatus === "success" && (
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <Check className="h-3 w-3" /> Connecté
              </span>
            )}

            {geoStatus === "error" && (
              <span className="flex items-center gap-1 text-xs text-red-600 font-medium">
                <X className="h-3 w-3" /> Échec
              </span>
            )}
          </div>
        </div>

        {isGeoLocated && (
          <Button variant="ghost" size="sm" onClick={resetLocation} className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10">
            Réinitialiser
          </Button>
        )}
      </div>

      {isGeoLocated && (
        <div className="space-y-4 border-t pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">Rayon d&apos;action</Label>
            <span className="text-sm font-bold text-primary">{radius} km</span>
          </div>
          <Slider
            value={[radius]}
            onValueChange={(v) => {
              updateSearch({ geoRadiusKm: v[0] });
            }}
            max={100}
            step={5}
            className="w-full"
          />
        </div>
      )}

      {/* Map */}
      {isGeoLocated && userCoords && (
        <div className="h-48 w-full overflow-hidden rounded-lg border bg-muted ring-1 ring-border">
          <LeafletMap center={userCoords} radius={radius} />
        </div>
      )}
    </div>
  );
}

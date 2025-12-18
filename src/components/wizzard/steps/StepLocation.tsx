"use client";

import debounce from "lodash.debounce";
import { useState, useEffect, useCallback } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ListingDraft } from "@/lib/schemas/listing.schema";

/**
 * Type retourné par geo.api.gouv.fr
 */
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

/**
 * Extraction safe des coordonnées
 */
function getCoordinates(commune: Commune): { lat: number; lng: number } | null {
  if (!commune.centre?.coordinates) return null;
  const [lng, lat] = commune.centre.coordinates;
  return { lat, lng };
}

type StepLocationProps = {
  onNext: () => void;
  onPrev: () => void;
};

export default function StepLocation({ onNext, onPrev }: StepLocationProps) {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
    clearErrors,
  } = useFormContext<ListingDraft>();

  const locationFromForm = watch("location") ?? {
    region: "",
    department: "",
    city: "",
    postalCode: "",
    lat: 0,
    lng: 0,
  };

  const [query, setQuery] = useState(locationFromForm.city);
  const [suggestions, setSuggestions] = useState<Commune[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // auto-clear error if location has valid coordinates
  if (errors.location && locationFromForm.lat && locationFromForm.lng) {
    clearErrors("location");
  }

  // -------- Fetch autocomplete
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
    } catch (err) {
      console.error("City search failed:", err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchCities, 250), []);

  useEffect(() => {
    if (isFocused) debouncedFetch(query);
  }, [query, isFocused, debouncedFetch]);

  // -------- Selection
  const handleSelect = (commune: Commune) => {
    const coords = getCoordinates(commune);
    if (!coords) return;

    const newLocation = {
      region: commune.region.nom,
      department: commune.departement.nom,
      city: commune.nom,
      postalCode: commune.codesPostaux[0],
      lat: coords.lat,
      lng: coords.lng,
    };

    setValue("location", newLocation, { shouldValidate: true });
    setQuery(`${commune.nom} (${commune.codesPostaux[0]})`);
    setSuggestions([]);
    setIsFocused(false);
  };

  const handleNext = async () => {
    const valid = await trigger("location");
    if (valid) onNext();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Où se situe votre annonce ?</h2>

      <div className="relative">
        <input
          type="text"
          placeholder="Commencez à taper une ville..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          className="w-full rounded-md border p-2"
        />

        {isFocused && loading && (
          <p className="text-muted-foreground mt-1 text-sm">Recherche...</p>
        )}

        {isFocused && suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-white shadow-md">
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
                  onMouseDown={() => hasCoords && handleSelect(commune)}
                >
                  {commune.nom} ({commune.codesPostaux[0]}) –{" "}
                  {commune.departement.nom}
                  {!hasCoords && " (coordonnées indisponibles)"}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {errors.location && (
        <p className="text-destructive text-sm">
          {errors.location.message?.toString()}
        </p>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onPrev}>
          Retour
        </Button>
        <Button
          onClick={handleNext}
          disabled={!locationFromForm.lat || !locationFromForm.lng || loading}
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}

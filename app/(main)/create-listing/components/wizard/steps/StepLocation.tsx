"use client";

import debounce from "lodash.debounce";
import { useState, useEffect, useRef, useMemo } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { ListingDraft } from "@/validations/listing-schemas";

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
    city: "",
    postalCode: "",
    lat: 0,
    lng: 0,
  };

  const [query, setQuery] = useState(locationFromForm.city);
  const [suggestions, setSuggestions] = useState<Commune[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (errors.location && locationFromForm.lat && locationFromForm.lng) {
      clearErrors("location");
    }
  }, [
    errors.location,
    locationFromForm.lat,
    locationFromForm.lng,
    clearErrors,
  ]);

  // -------- Fetch autocomplete
  const debouncedFetch = useMemo(
    () =>
      debounce(async (q: string) => {
        if (q.length < 2) {
          setSuggestions([]);
          return;
        }

        setLoading(true);
        try {
          const res = await fetch(`/api/city?q=${encodeURIComponent(q)}`);
          const data: Commune[] = await res.json();
          setSuggestions(data.slice(0, 5)); // limit to 5
        } catch (err) {
          console.error("City search failed:", err);
          setSuggestions([]);
        } finally {
          setLoading(false);
        }
      }, 250),
    [],
  );

  useEffect(() => {
    if (isFocused) debouncedFetch(query);
  }, [query, isFocused, debouncedFetch]);

  // reset active index when suggestions change
  useEffect(() => {
    setActiveIndex(-1);
  }, [suggestions]);

  // auto-scroll active item into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const activeItem = list.children[activeIndex] as HTMLElement;
    if (activeItem) {
      activeItem.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
        break;

      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          const selected = suggestions[activeIndex];
          if (selected.centre?.coordinates) {
            handleSelect(selected);
          }
        }
        break;

      case "Escape":
        setSuggestions([]);
        setActiveIndex(-1);
        break;
    }
  };

 
  const handleSelect = (commune: Commune) => {
    const coords = getCoordinates(commune);
    if (!coords) return;

    const newLocation = {
      city: commune.nom,
      postalCode: commune.codesPostaux[0],
      lat: coords.lat,
      lng: coords.lng,
    };

    setValue("location", newLocation, { shouldValidate: true });
    setQuery(`${commune.nom} (${commune.codesPostaux[0]})`);
    setSuggestions([]);
    setIsFocused(false);
    setActiveIndex(-1);
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
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
          className="w-full rounded-md border p-2"
        />

        {isFocused && loading && (
          <p className="text-muted-foreground mt-1 text-sm">Recherche...</p>
        )}

        {isFocused && suggestions.length > 0 && (
          <ul
            ref={listRef}
            className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-background shadow-md"
          >
            {suggestions.map((commune, index) => {
              const hasCoords = !!commune.centre?.coordinates;
              const isActive = index === activeIndex;

              return (
                <li
                  key={`${commune.nom}-${commune.codesPostaux[0]}`}
                  className={`px-3 py-2 ${
                    hasCoords
                      ? "cursor-pointer"
                      : "text-muted-foreground cursor-not-allowed"
                  } ${isActive ? "bg-gray-200" : "hover:bg-gray-100"}`}
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

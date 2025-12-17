"use client";

import debounce from "lodash.debounce";
import { useState, useEffect, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { useListingWizard } from "@/lib/store/listingWizard.store";

type Commune = {
  nom: string;
  codesPostaux: string[];
  departement: { nom: string; code: string };
  region: { nom: string; code: string };
};

export default function StepLocation() {
  const { data, update, next, prev, errors } = useListingWizard();

  const location = data.location ?? {
    region: "",
    department: "",
    city: "",
    postalCode: "",
  };

  const [query, setQuery] = useState(location.city);
  const [suggestions, setSuggestions] = useState<Commune[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // ---- Fetch autocomplete
  const fetchCities = async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/city?q=${encodeURIComponent(q)}`);
      const data: Commune[] = await res.json();
      setSuggestions(data.slice(0, 5));
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchCities, 250), []);

  useEffect(() => {
    if (isFocused) {
      debouncedFetch(query);
    }
  }, [query, isFocused, debouncedFetch]);

  // ---- Selection
  const handleSelect = (commune: Commune) => {
    setQuery(`${commune.nom} (${commune.codesPostaux[0]})`);
    setSuggestions([]);
    setIsFocused(false);

    update({
      location: {
        region: commune.region.nom,
        department: commune.departement.nom,
        city: commune.nom,
        postalCode: commune.codesPostaux[0],
      },
    });
  };

  const handleOther = () => {
    setSuggestions([]);
    setIsFocused(false);

    update({
      location: {
        region: "",
        department: "",
        city: query,
        postalCode: "",
      },
    });
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
            {suggestions.map((commune) => (
              <li
                key={commune.nom + commune.codesPostaux[0]}
                className="cursor-pointer px-3 py-2 hover:bg-gray-100"
                onMouseDown={() => handleSelect(commune)}
              >
                {commune.nom} ({commune.codesPostaux[0]}) –{" "}
                {commune.departement.nom}
              </li>
            ))}

            <li
              className="text-muted-foreground cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
              onMouseDown={handleOther}
            >
              Autre ville : &quot;{query}&quot;
            </li>
          </ul>
        )}
      </div>

      {errors.location && (
        <p className="text-destructive text-sm">{errors.location[0]}</p>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={prev}>
          Retour
        </Button>
        <Button onClick={next} disabled={!query || loading}>
          Continuer
        </Button>
      </div>
    </div>
  );
}

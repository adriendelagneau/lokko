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

  // Lire la location actuelle depuis le store
  const location = data.location ?? {
    region: "",
    department: "",
    city: "",
    postalCode: "",
  };

  const [query, setQuery] = useState(location.city ?? "");
  const [suggestions, setSuggestions] = useState<Commune[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Commune | null>(null);

  // Fetch autocomplete
  const fetchCities = async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/city?q=${encodeURIComponent(q)}`);
      const data: Commune[] = await res.json();
      setSuggestions(data.slice(0, 5)); // max 5 suggestions
    } catch (err) {
      console.error(err);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = useCallback(debounce(fetchCities, 200), []);

  useEffect(() => {
    debouncedFetch(query);
  }, [query, debouncedFetch]);

  const handleSelect = (commune: Commune) => {
    setQuery(`${commune.nom} (${commune.codesPostaux[0]})`);
    setSuggestions([]);
    setSelected(commune);

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
    setSelected(null);
    setSuggestions([]);

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

      <input
        type="text"
        placeholder="Commencez à taper une ville..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-md border p-2"
      />

      {loading && (
        <p className="text-muted-foreground text-sm">Recherche...</p>
      )}

      {suggestions.length > 0 && (
        <ul className="mt-1 max-h-60 overflow-auto rounded-md border bg-white shadow-md">
          {suggestions.map((commune) => (
            <li
              key={commune.nom + commune.codesPostaux[0]}
              className="cursor-pointer px-3 py-2 hover:bg-gray-100"
              onClick={() => handleSelect(commune)}
            >
              {commune.nom} ({commune.codesPostaux[0]}) -{" "}
              {commune.departement.nom}
            </li>
          ))}
          <li
            className="text-muted-foreground cursor-pointer px-3 py-2 text-sm hover:bg-gray-100"
            onClick={handleOther}
          >
            Autre ville : &quot;{query}&quot;
          </li>
        </ul>
      )}

      {/* Affichage d’erreurs Zod si nécessaire */}
      {errors.location?.city && (
        <p className="text-destructive text-sm">{errors.location.city[0]}</p>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={prev}>
          Retour
        </Button>
        <Button
          onClick={next}
          disabled={!query || loading} // bloque si vide ou en cours de recherche
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}

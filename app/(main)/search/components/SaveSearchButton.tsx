"use client";

import { Button } from "@/components/ui/button";
import { useModalStore } from "@/store/useModalStore";

interface SearchQuery {
  query?: string;
  category?: string;
  subCategory?: string;
  product?: string;
  geoLat?: number;
  geoLng?: number;
  geoRadiusKm?: number;
  priceMin?: number;
  priceMax?: number;
}

type Props = {
  query: SearchQuery;
};

export default function SaveSearchButton({ query }: Props) {
  const { openModal } = useModalStore();

  return (
    <Button
      variant="outline"
      size="sm"
   
      onClick={() => openModal("save-search", { query })}
    >
      Enregistrer la recherche
    </Button>
  );
}

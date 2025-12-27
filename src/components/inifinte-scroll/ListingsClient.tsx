"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import { getListings, ListingFromGetListings } from "@/actions/listing-actions";

import SearchCard from "../cards/SearchCard";

export default function ListingsClient() {
  const searchParams = useSearchParams();
  const [pages, setPages] = useState<ListingFromGetListings[][]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Convertir searchParams en object utilisable par getListings
  const params = Object.fromEntries(searchParams.entries());

  const fetchPage = async (pageNum: number, reset = false) => {
    setLoading(true);
    const result = await getListings({ ...params, page: pageNum });
    setPages((prev) =>
      reset ? [result.listings] : [...prev, result.listings]
    );
    setHasMore(result.hasMore);
    setLoading(false);
  };

  // Quand l'URL change -> reset pagination et fetch page 1
  useEffect(() => {
    setPage(1);
    fetchPage(1, true);
  }, [searchParams.toString()]); // attention à stringify pour trigger useEffect

  // Quand page change -> fetch page suivante
  useEffect(() => {
    if (page === 1) return; // déjà fetché par le useEffect précédent
    fetchPage(page);
  }, [page]);

  // Intersection Observer pour infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, loading]);

  return (
    <div className="space-y-4">
      {pages.flat().map((listing) => (
        <SearchCard key={listing.id} listing={listing} />
      ))}

      <div ref={loadMoreRef} className="h-6">
        {loading && <div>Chargement...</div>}
      </div>
    </div>
  );
}

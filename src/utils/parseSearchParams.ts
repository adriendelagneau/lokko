export function parseSearchParams(
  searchParams: URLSearchParams
): Record<string, string | number> {
  const numberKeys = [
    "page",
    "pageSize",
    "priceMin",
    "priceMax",
    "geoLat",
    "geoLng",
    "geoRadiusKm",
  ];

  return Object.fromEntries(
    Array.from(searchParams.entries()).map(([key, value]) => {
      if (numberKeys.includes(key)) {
        const n = Number(value);
        return [key, isNaN(n) ? undefined : n];
      }
      return [key, value];
    })
  );
}

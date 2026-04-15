const NUMBER_KEYS = [
  "page",
  "pageSize",
  "priceMin",
  "priceMax",
  "geoLat",
  "geoLng",
  "geoRadiusKm",
];

export function parseSearchParams(
  searchParams: URLSearchParams
): Record<string, string | number> {
  const result: Record<string, string | number> = {};

  searchParams.forEach((value, key) => {
    if (NUMBER_KEYS.includes(key)) {
      const n = Number(value);
      if (!isNaN(n)) {
        result[key] = n;
      }
    } else if (value) {
      result[key] = value;
    }
  });

  return result;
}

export function buildSearchUrl(query: unknown) {
  if (
    typeof query !== "object" ||
    query === null ||
    Array.isArray(query)
  ) {
    return "/search";
  }

  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  return `/search?${params.toString()}`;
}

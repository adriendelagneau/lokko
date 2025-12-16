// app/api/communes/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const query = url.searchParams.get("q");

  if (!query || query.length < 2) return NextResponse.json([], { status: 200 });

  const res = await fetch(
    `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
      query
    )}&fields=departement,region,codesPostaux&limit=5`
  );

  const data = await res.json();
  return NextResponse.json(data);
}

import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const res = await fetch(
    `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(
      q
    )}&limit=5&fields=nom,codesPostaux,departement,region,centre`
  );

  const data = await res.json();
  return NextResponse.json(data);
}

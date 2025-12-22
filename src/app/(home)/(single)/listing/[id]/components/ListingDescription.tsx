"use client";

type Props = {
  description?: string | null;
};

export function ListingDetails({ description }: Props) {
  if (!description) return null;

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">Détails</h2>

      <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
        {description}
      </p>
    </section>
  );
}

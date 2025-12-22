"use client";

type Props = {
  description?: string | null;
};

export function ListingDetails({ description }: Props) {
  if (!description) return null;

  return (
    <section className=" p-4">
      <h2 className="mb-3 text-xl font-semibold">Détails :</h2>

      <p className=" whitespace-pre-line leading-relaxed text-lg">
        {description}
      </p>
    </section>
  );
}

import Link from "next/link";

import { ListingCard } from "@/actions/listing-actions";
import { Button } from "@/components/ui/button";

import { ListingCarousel } from "./ListingCarousel"; 

type Props = {
  title: string;
  listings: ListingCard[];
  href: string;
};

export function ListingsSection({ title, listings, href }: Props) {
  if (!listings.length) return null;

  return (
    <section className="space-y-3 w-full max-w-5xl mx-auto my-12">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-semibold">{title}</h2>

        <Button asChild variant="link" className="text-sm">
          <Link href={href}>Voir plus d&apos;annonce</Link>
        </Button>
      </div>

      {/* Carousel */}
      <ListingCarousel listings={listings} />
    </section>
  );
}

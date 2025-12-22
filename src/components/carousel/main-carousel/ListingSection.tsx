import { MoveRightIcon } from "lucide-react";
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
    <section className="mx-auto my-4 w-full max-w-5xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-xl font-semibold">{title} :</h2>

        <Button asChild variant="link" className="">
          <Link href={href} className="group">
            Voir plus d&apos;annonce{" "}
            <span>
              <MoveRightIcon className="group-hover:text-primary "/>
            </span>
          </Link>
        </Button>
      </div>

      {/* Carousel */}
      <ListingCarousel listings={listings} />
    </section>
  );
}

import { MoveRightIcon } from "lucide-react";
import Link from "next/link";

import { ListingFromGetListings } from "@/actions/listing-actions";
import { Button } from "@/components/ui/button";

import { ListingCarousel } from "./ListingCarousel";

type Props = {
  title: string;
  listings: ListingFromGetListings[];
  href: string;
};

export function ListingsSection({ title, listings, href }: Props) {
  if (!listings.length) return null;

  return (
    <section className="mx-auto mt-4 my-2 lg:my-24 w-full max-w-6xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-md lg:text-xl font-semibold">{title} :</h2>

        <Button asChild variant="link" className="">
          <Link href={href} className="group">
            Voir plus d&apos;annonces{" "}
            <span>
              <MoveRightIcon className="group-hover:text-primary" />
            </span>
          </Link>
        </Button>
      </div>

      {/* Carousel */}
      <ListingCarousel listings={listings} />
    </section>
  );
}

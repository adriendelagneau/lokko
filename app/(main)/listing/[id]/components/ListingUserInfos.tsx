"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { MessageSquare, User } from "lucide-react";

import { ListingSingle } from "@/actions/listing-actions";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { useModalStore } from "@/store/useModalStore";

type Props = {
  listing: ListingSingle;
};

export function ListingUserInfo({ listing }: Props) {
  const { owner } = listing;
  const router = useRouter();
  const { openModal } = useModalStore();

  const { data: session } = authClient.useSession();
  const currentUserId = session?.user?.id ?? "";
  const isOwner = owner.id === currentUserId;

  const goToProfile = () => {
    router.push(`/profile/${owner.id}`);
  };

  return (
    <div className="bg-background flex flex-col gap-6 rounded-2xl border p-6 shadow-sm">
      
      <button
        onClick={goToProfile}
        className="group flex w-full items-center gap-4 rounded-xl transition-all hover:bg-muted/50 focus:outline-none"
      >
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border bg-muted ring-offset-2 group-hover:ring-2 group-hover:ring-primary/20">
          {owner.image ? (
            <Image
              src={owner.image}
              alt={owner.name || "Avatar"}
              fill
              sizes="56px"
              className="object-cover transition-transform group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
              <User className="h-6 w-6" />
            </div>
          )}
        </div>
        
        <div className="flex flex-col items-start overflow-hidden">
          <span className="w-full truncate text-base font-semibold text-primary group-hover:text-primary/80">
            {owner.name}
          </span>
          <span className="text-sm text-muted-foreground">Voir le profil</span>
        </div>
      </button>

      <div className="flex flex-col gap-3">
        {!isOwner ? (
          <Button
            size="lg"
            className="w-full gap-2 rounded-xl"
            onClick={() => openModal("contact-seller", { listingId: listing.id })}
          >
            <MessageSquare className="h-5 w-5" />
            Contacter
          </Button>
        ) : (
          <div className="rounded-xl bg-muted/50 p-4 text-center text-sm font-medium text-muted-foreground">
            C&apos;est votre annonce
          </div>
        )}
      </div>
    </div>
  );
}

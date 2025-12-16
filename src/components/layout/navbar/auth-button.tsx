"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { useAuthModal } from "@/lib/store/useAuthStore";

import { UserButton } from "./user-button";

// Inner logic component for session logic
export const AuthButton = () => {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const { toggle } = useAuthModal();

  return (
    <div className="">
      {isPending ? (
        <Button className="text-md cursor-pointer" onClick={() => toggle()}>
          Connexion
        </Button>
      ) : user ? (
        <UserButton />
      ) : (
        <Button className="text-md cursor-pointer" onClick={() => toggle()}>
          Connexion
        </Button>
      )}
    </div>
  );
};

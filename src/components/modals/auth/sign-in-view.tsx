"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { useModalStore } from "@/lib/store/useModalStore";
import {
  MagicLinkSignInSchema,
  MagicLinkSignInSchemaType,
} from "@/lib/validation";

import FormError from "./form-error";
import SocialButton from "./social-button";

/* ============================================================
   COMPONENT
============================================================ */

export const SignInView = () => {
  const router = useRouter();
  const { data, closeModal } = useModalStore();

  const redirectTo = (data && "redirectTo" in data && data.redirectTo) || "/";

  const form = useForm<MagicLinkSignInSchemaType>({
    resolver: zodResolver(MagicLinkSignInSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    handleSubmit,
    control,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  /* ================= MAGIC LINK ================= */

  const onSubmit = async (values: MagicLinkSignInSchemaType) => {
    try {
      await authClient.signIn.magicLink(
        { email: values.email },
        {
          onSuccess: () => {
            toast.success("Un lien magique a été envoyé à votre email.");
            closeModal();
          },
          onError: (ctx) => {
            setError("email", {
              message: ctx.error?.message || "Échec de l’envoi du lien.",
            });
          },
        }
      );
    } catch {
      setError("email", {
        message: "Erreur inattendue. Veuillez réessayer.",
      });
    }
  };

  /* ================= OAUTH ================= */

  const handleProviderSignIn = async (provider: "google" | "github") => {
    try {
      await authClient.signIn.social(
        { provider },
        {
          onSuccess: async () => {
            closeModal();
            router.push(redirectTo);
            router.refresh();
          },
          onError: (ctx) => {
            setError("root", {
              message:
                ctx.error?.message || "Erreur lors de la connexion sociale.",
            });
          },
        }
      );
    } catch {
      setError("root", {
        message: "Impossible de se connecter.",
      });
    }
  };

  /* ================= UI ================= */

  return (
    <Card className="mx-auto w-full max-w-md border-none p-0 shadow-none">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* EMAIL */}
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <MailIcon className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                    <Input
                      type="email"
                      placeholder="Adresse email"
                      className="pl-12"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* GLOBAL ERROR */}
          <FormError message={errors.root?.message} />

          {/* SUBMIT */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            Envoyer un lien magique
          </Button>

          {/* DIVIDER */}
          <div className="text-muted-foreground flex items-center py-5 text-sm">
            <div className="flex-1 border-t" />
            <span className="px-3">ou</span>
            <div className="flex-1 border-t" />
          </div>

          {/* SOCIAL */}
          <div className="space-y-2">
            <SocialButton
              provider="google"
              icon={<FcGoogle size={22} />}
              label="Continuer avec Google"
              onClick={() => handleProviderSignIn("google")}
              disabled={isSubmitting}
            />

            <SocialButton
              provider="github"
              icon={<FaGithub size={22} />}
              label="Continuer avec GitHub"
              onClick={() => handleProviderSignIn("github")}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </Form>
    </Card>
  );
};

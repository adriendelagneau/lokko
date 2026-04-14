"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth/auth-client";
import { useModalStore } from "@/store/useModalStore";
import {
  MagicLinkSignInSchema,
  MagicLinkSignInSchemaType,
} from "@/validations/email-schemas";

import SocialButton from "./social-button";
import { DialogTitle } from "@/components/ui/dialog";

/* ============================================================
   COMPONENT
============================================================ */
export const SignInView = () => {
  const { closeModal } = useModalStore();

  const [socialLoading, setSocialLoading] = useState(false);

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
    formState: { isSubmitting },
  } = form;

  const authLoading = isSubmitting || socialLoading;

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
      setSocialLoading(true);

      await authClient.signIn.social({ provider });
      // ⛔ nothing after this line will be seen
    } catch {
      setSocialLoading(false);
      setError("root", {
        message: "Impossible de se connecter.",
      });
    }
  };

  /* ================= UI ================= */

  return (
    <>
      <DialogTitle className="mb-6">Connexion ou Inscription</DialogTitle>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`space-y-5 ${authLoading ? "pointer-events-none" : ""}`}
        noValidate
      >
        {form.formState.errors.root && (
          <div className="bg-destructive/15 border-destructive/20 text-destructive rounded-md border p-3 text-sm font-medium">
            {form.formState.errors.root.message}
          </div>
        )}
        {/* EMAIL FIELD */}
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Adresse email</FieldLabel>

              <div className="relative">
                <MailIcon className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
                <Input
                  {...field}
                  id={field.name}
                  type="email"
                  placeholder="Adresse email"
                  className="pl-12"
                  disabled={authLoading}
                  aria-invalid={fieldState.invalid}
                />
              </div>

              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />

        {/* SUBMIT */}
        <Button type="submit" disabled={authLoading} className="w-full">
          {authLoading ? "Envoi en cours..." : "Envoyer un lien magique"}
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
            disabled={authLoading}
          />

          <SocialButton
            provider="github"
            icon={<FaGithub size={22} />}
            label="Continuer avec GitHub"
            onClick={() => handleProviderSignIn("github")}
            disabled={authLoading}
          />
        </div>
      </form>
    </>
  );
};

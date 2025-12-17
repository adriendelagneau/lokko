"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { z } from "zod";

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
import {
  MagicLinkSignInSchema,
  MagicLinkSignInSchemaType,
} from "@/lib/validation";

import FormError from "./form-error";
import SocialButton from "./social-button";

// Schema

export const SignInView = () => {
  const router = useRouter();

  const form = useForm<MagicLinkSignInSchemaType>({
    resolver: zodResolver(MagicLinkSignInSchema),
    defaultValues: { email: "" },
  });

  const {
    handleSubmit,
    control,
    setError,
    formState: { isSubmitting, errors },
  } = form;

  /**
   * MAGIC LINK
   */
  const onSubmit = async (values: MagicLinkSignInSchemaType) => {
    try {
      await authClient.signIn.magicLink(
        { email: values.email },
        {
          onSuccess: () => {
            toast("A magic link has been sent to your email.");
          },
          onError: (ctx) => {
            setError("email", {
              message: ctx.error.message || "Failed to send magic link.",
            });
          },
        }
      );
    } catch (err) {
      setError("email", {
        message: "Unexpected error. Please try again.",
      });
    }
  };

  /**
   * OAUTH PROVIDER SIGN-IN
   */
  const handleSignInWithProvider = async (provider: "google" | "github") => {
    try {
      await authClient.signIn.social(
        { provider },
        {
          onSuccess: async () => {
            router.push("/");
            router.refresh();
          },
          onError: (ctx) => {
            setError("root", {
              message:
                ctx.error?.message || "Something went wrong with social login.",
            });
          },
        }
      );
    } catch (err) {
      setError("root", { message: "Sign-in failed. Please try again." });
    }
  };

  return (
    <Card className="mx-auto w-full max-w-md p-6">
      <Form {...form}>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
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

          {/* GLOBAL AUTH ERRORS */}
          <FormError message={errors.root?.message} />

          <Button disabled={isSubmitting} type="submit" className="w-full">
            Envoyez un mail
          </Button>

          <div className="text-muted-foreground flex w-full items-center py-5 text-sm">
            <div className="border-secondary-foreground flex-1 border-t" />
            <span className="px-3 text-lg">ou</span>
            <div className="border-secondary-foreground flex-1 border-t" />
          </div>

          <div className="mt-4 space-y-2">
            <SocialButton
              provider="google"
              icon={<FcGoogle size={22} />}
              label="continuer avec Google"
              onClick={() => handleSignInWithProvider("google")}
              disabled={isSubmitting}
            />
            <SocialButton
              provider="github"
              icon={<FaGithub size={22} />}
              label="continuer avec GitHub"
              onClick={() => handleSignInWithProvider("github")}
              disabled={isSubmitting}
            />
          </div>
        </form>
      </Form>
    </Card>
  );
};

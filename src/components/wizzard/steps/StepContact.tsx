"use client";

import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";

import FormError from "@/components/modals/auth/form-error";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/auth-client";
import { ListingDraft } from "@/lib/schemas/listing.schema";

type StepContactProps = {
  onNext: () => void;
  onPrev: () => void;
};

export default function StepContact({ onNext, onPrev }: StepContactProps) {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<ListingDraft>();

  const contact = watch("contact") ?? {};
  const { data: session } = authClient.useSession();

  const [useEmail, setUseEmail] = useState(false);
  const [usePhone, setUsePhone] = useState(false);

  useEffect(() => {
    if (contact.email || session?.user?.email) setUseEmail(true);
    if (contact.phone) setUsePhone(true);

    if (!contact.email && session?.user?.email) {
      setValue("contact.email", session.user.email, { shouldValidate: true });
    }
  }, [contact.email, contact.phone, session?.user?.email, setValue]);

  const handleEmailToggle = (checked: boolean) => {
    setUseEmail(checked);
    if (checked && session?.user?.email) {
      setValue("contact.email", session.user.email, { shouldValidate: true });
    } else {
      setValue("contact.email", undefined, { shouldValidate: true });
    }
  };

  const handlePhoneToggle = (checked: boolean) => {
    setUsePhone(checked);
    if (!checked) {
      setValue("contact.phone", undefined, { shouldValidate: true });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("contact.phone", e.target.value, { shouldValidate: true });
  };

  const handleNext = async () => {
    const valid = await trigger("contact");
    if (valid) onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">
        Comment souhaitez-vous être contacté ?
      </h2>
      <p className="text-muted-foreground text-sm">
        Choisissez au moins un moyen de contact. Votre email de compte est
        utilisé par défaut.
      </p>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="useEmail"
            checked={useEmail}
            onCheckedChange={handleEmailToggle}
          />
          <Label htmlFor="useEmail" className="font-medium">
            Par email
          </Label>
        </div>
        {useEmail && (
          <Input
            value={contact.email ?? ""}
            readOnly
            disabled
            placeholder="Votre email de compte"
          />
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="usePhone"
            checked={usePhone}
            onCheckedChange={handlePhoneToggle}
          />
          <Label htmlFor="usePhone" className="font-medium">
            Par téléphone
          </Label>
        </div>
        {usePhone && (
          <Input
            placeholder="Votre numéro de téléphone"
            value={contact.phone ?? ""}
            onChange={handlePhoneChange}
          />
        )}
      </div>

      {errors.contact && (
        <FormError message={errors.contact?.message?.toString()} />
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onPrev}>
          Retour
        </Button>
        <Button onClick={handleNext}>Continuer</Button>
      </div>
    </div>
  );
}

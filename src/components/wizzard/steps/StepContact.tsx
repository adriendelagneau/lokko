"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useListingWizard } from "@/lib/store/listingWizard.store";
import { useSession } from "@/lib/auth/auth-client";
import { useEffect, useState } from "react";
import { FormError } from "@/components/auth/form-error";

export default function StepContact() {
  const { data, update, next, prev, errors } = useListingWizard();
  const { session } = useSession();

  const [useEmail, setUseEmail] = useState(false);
  const [usePhone, setUsePhone] = useState(false);

  useEffect(() => {
    const contactEmail = data.contact?.email;
    const contactPhone = data.contact?.phone;

    if (contactEmail) {
      setUseEmail(true);
    } else if (session?.user?.email) {
      // Pre-select email if user is logged in and hasn't made a choice
      setUseEmail(true);
      update({
        contact: { ...data.contact, email: session.user.email },
      });
    }

    if (contactPhone) {
      setUsePhone(true);
    }
  }, [session, data.contact, update]);

  const handleEmailToggle = (checked: boolean) => {
    setUseEmail(checked);
    if (checked && session?.user?.email) {
      update({
        contact: { ...data.contact, email: session.user.email },
      });
    } else {
      const { email, ...rest } = data.contact || {};
      update({ contact: rest });
    }
  };

  const handlePhoneToggle = (checked: boolean) => {
    setUsePhone(checked);
    if (!checked) {
      const { phone, ...rest } = data.contact || {};
      update({ contact: rest });
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update({
      contact: { ...data.contact, phone: e.target.value },
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Comment souhaitez-vous être contacté ?</h2>
      <p className="text-sm text-muted-foreground">
        Choisissez au moins un moyen de contact. Votre email de compte est utilisé par défaut.
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
            value={data.contact?.email ?? ""}
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
            value={data.contact?.phone ?? ""}
            onChange={handlePhoneChange}
          />
        )}
      </div>

      {errors.contact && <FormError message={errors.contact[0]} />}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={prev}>
          Retour
        </Button>
        <Button onClick={next}>
          Continuer
        </Button>
      </div>
    </div>
  );
}
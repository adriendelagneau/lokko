"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

import type {
  GetContactModalDataResult,
  ContactModalMessage,
} from "@/actions/messages-actioons";
import { sendMessage } from "@/actions/messages-actioons"; // ✅ server action
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  sendMessageSchema,
  SendMessageInput,
} from "@/lib/schemas/messsagesSchemas";
import { useModalStore } from "@/lib/store/useModalStore";

/* ============================================================
   PROPS
============================================================ */

type Props = {
  data: GetContactModalDataResult;
};

/* ============================================================
COMPONENT
============================================================ */

type SendMessageInputForForm = Omit<SendMessageInput, "listingId">;

export function ContactSellerModal({ data }: Props) {
  const { closeModal } = useModalStore();
  const [isPending, startTransition] = useTransition();


const form = useForm<SendMessageInputForForm>({
  resolver: zodResolver(sendMessageSchema.pick({ content: true })),
  defaultValues: { content: "" },
});


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  console.log(errors);
  const handleSend = handleSubmit((values) => {
    startTransition(async () => {
      console.log("sending");
      await sendMessage({
        listingId: data.listing.id,
        content: values.content,
      });

      reset();
      // optional: refresh messages / router.refresh()
    });
  });

  return (
    <>
      <DialogTitle>Contacter le vendeur</DialogTitle>
      <div className="space-y-4 mt-8">
        {/* ---------------- LISTING RECAP ---------------- */}
        <div className="flex gap-3 border-b pb-4">
          {data.listing.image && (
            <img
              src={data.listing.image}
              alt={data.listing.title}
              className="h-16 w-16 rounded object-cover"
            />
          )}
          <div>
            <p className="font-medium">{data.listing.title}</p>
            <p className="text-muted-foreground text-sm">
              {data.listing.price} €
            </p>
          </div>
        </div>

        {/* ---------------- SELLER ---------------- */}
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={data.seller.image ?? undefined} />
            <AvatarFallback>{data.seller.name?.[0] ?? "U"}</AvatarFallback>
          </Avatar>
          <p className="font-medium">{data.seller.name ?? "Vendeur"}</p>
        </div>

        {/* ---------------- EXISTING MESSAGES ---------------- */}
        {data.conversation?.messages.length > 0 && (
          <div className="max-h-48 space-y-3 overflow-y-auto rounded-md border p-3">
            {[...data.conversation.messages]
              .reverse()
              .map((msg: ContactModalMessage) => {
                const isMine = msg.senderId === data.currentUserId;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        isMine
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className="mt-1 text-xs opacity-70">
                        {formatDistanceToNow(new Date(msg.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* ---------------- FORM ---------------- */}
        <form onSubmit={handleSend} className="space-y-3">
          <Textarea
            placeholder="Écrire un message..."
            {...register("content")}
          />

          {errors.content && (
            <p className="text-destructive text-sm">{errors.content.message}</p>
          )}

          <div className="flex justify-end gap-2">
            {/* <Button type="button" variant="ghost" onClick={closeModal}>
              Annuler
            </Button> */}
            <Button type="submit" disabled={isPending}>
              Envoyer
            </Button>
          </div>
        </form>

        {/* ---------------- CTA FULL CONVERSATION ---------------- */}
        {data.conversation && (
          <div className="pt-2 text-center">
            <Button variant="link" asChild>
              <a href={`/user/conversation/${data.conversation.id}`}>
                Voir toute la conversation →
              </a>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

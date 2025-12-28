"use server";

import { getUser } from "@/lib/auth/auth-session";
import prisma from "@/lib/prisma/prisma";
import { sendMessageSchema } from "@/lib/schemas/messsagesSchemas";

/* ============================================================
   SEND MESSAGE
============================================================ */

export async function sendMessage(input: unknown) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const parsed = sendMessageSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const { listingId, content } = parsed.data;

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: {
      id: true,
      ownerId: true,
    },
  });

  if (!listing) throw new Error("Listing not found");

  if (listing.ownerId === user.id) {
    throw new Error("Cannot message yourself");
  }

  // 1️⃣ Find or create conversation
  const conversation = await prisma.conversation.upsert({
    where: {
      listingId_contactUserId: {
        listingId,
        contactUserId: user.id,
      },
    },
    update: {
      updatedAt: new Date(),
    },
    create: {
      listingId,
      contactUserId: user.id,
      participants: {
        createMany: {
          data: [
            { userId: user.id },
            { userId: listing.ownerId },
          ],
        },
      },
    },
  });

  // 2️⃣ Create message
  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: user.id,
      content,
    },
  });

  return {
    conversationId: conversation.id,
    messageId: message.id,
  };
}

/* ---------------- TYPES ---------------- */

export type SendMessageResult = Awaited<
  ReturnType<typeof sendMessage>
>;

/* ============================================================
   CONTACT MODAL DATA
============================================================ */

export async function getContactModalData(listingId: string) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: {
      id: true,
      title: true,
      price: true,
      ownerId: true,
      images: {
        take: 1,
        select: { url: true },
      },
      owner: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  if (!listing) throw new Error("Listing not found");

  if (listing.ownerId === user.id) {
    throw new Error("Cannot contact yourself");
  }

  const conversation = await prisma.conversation.findUnique({
    where: {
      listingId_contactUserId: {
        listingId: listing.id,
        contactUserId: user.id,
      },
    },
    include: {
      messages: {
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          content: true,
          createdAt: true,
          senderId: true,
        },
      },
    },
  });

  return {
    listing: {
      id: listing.id,
      title: listing.title,
      price: listing.price,
      image: listing.images[0]?.url,
    },
    seller: {
      id: listing.owner.id,
      name: listing.owner.name,
      image: listing.owner.image,
    },
    conversation,
    currentUserId: user.id,
  };
}

/* ---------------- TYPES ---------------- */

export type GetContactModalDataResult = Awaited<
  ReturnType<typeof getContactModalData>
>;

export type ContactModalConversation =
  NonNullable<GetContactModalDataResult["conversation"]>;

export type ContactModalMessage =
  ContactModalConversation["messages"][number];

"use server";

import { z } from "zod";

import { getUser } from "@/lib/auth/auth-session";
import prisma from "@/lib/prisma/prisma";
import { listingSchema, ListingDraft } from "@/validations/listing-schemas";



type CreateListingResult = {
  success: boolean;
  error?: string;
  fieldErrors?: z.core.$ZodIssue["path"][];
  listingId?: string;
};

export type BaseListing = {
  id: string;
  title: string;
  price: number;
  priceUnit: string;
  createdAt: Date;
  location: {
    lat: number;
    lng: number;
    city: string;
    postalCode: string;
  };
  category: { slug: string } | null;
  subCategory: { slug: string } | null;
  product: { slug: string } | null;
  images: { url: string; altText: string | null }[];
  owner: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

export type ListingWithDistance = BaseListing & {
  distance?: number;
};

export async function createListing(
  data: ListingDraft
): Promise<CreateListingResult> {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const validation = listingSchema.safeParse(data);
    if (!validation.success) {
      return {
        success: false,
        error: "Invalid data.",
        fieldErrors: validation.error.issues.map((issue) => issue.path),
      };
    }

    const {
      title,
      description,
      categoryId,
      subCategoryId,
      productId,
      location,
      price,
      images,
    } = validation.data;

    // Find existing location or create a new one
    let locationData = await prisma.location.findFirst({
      where: {
        city: location.city,
        postalCode: location.postalCode,
        lat: location.lat,
        lng: location.lng,
      },
    });

    if (!locationData) {
      const id = crypto.randomUUID();
      await prisma.$executeRaw`
        INSERT INTO location (id, city, "postalCode", lat, lng, coords, "createdAt")
        VALUES (${id}, ${location.city}, ${location.postalCode}, ${location.lat}, ${location.lng}, ST_SetSRID(ST_MakePoint(${location.lng}, ${location.lat}), 4326)::geography, NOW())
      `;
      locationData = await prisma.location.findUnique({ where: { id } });
    }

    if (!locationData) {
      throw new Error("Failed to create or retrieve location data.");
    }

    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        price: price.value,
        priceUnit: price.unit,
        ownerId: user.id,
        categoryId,
        subCategoryId:
          subCategoryId && subCategoryId.length > 0 ? subCategoryId : null,
        productId: productId && productId.length > 0 ? productId : null,
        locationId: locationData.id,
        images: {
          create: images.map((img) => ({
            url: img.url,
            index: img.index,
          })),
        },
      },
      select: {
        id: true,
        title: true,
        price: true,
        categoryId: true,
        subCategoryId: true,
        productId: true,
        category: { select: { slug: true } },
        subCategory: { select: { slug: true } },
        product: { select: { slug: true } },
        location: {
          select: { lat: true, lng: true, city: true, postalCode: true },
        },
        images: {
          take: 1,
          select: { url: true },
        },
      },
    });



    return { success: true, listingId: newListing.id };
  } catch (error) {
    console.error("Failed to create listing:", error);
    return {
      success: false,
      error: "An unexpected error occurred while creating the listing.",
    };
  }
}



"use server";

import { z } from "zod";

import { getUser } from "@/lib/auth/auth-session";
import { ContactMethod } from "@/lib/prisma/generated/prisma/client";
import { Prisma } from "@/lib/prisma/generated/prisma/client";
import prisma from "@/lib/prisma/prisma";
import { listingSchema, ListingDraft } from "@/lib/schemas/listing.schema";

type CreateListingResult = {
  success: boolean;
  error?: string;
  fieldErrors?: z.ZodIssue["path"][];
  listingId?: string;
};

export async function createListing(
  data: ListingDraft
): Promise<CreateListingResult> {
  const user = await getUser();
  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

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
    location,
    price,
    images,
    contact,
  } = validation.data;

  try {
    // Find existing location or create a new one
    let locationData = await prisma.location.findFirst({
      where: {
        city: location.city,
        postalCode: location.postalCode,
        department: location.department,
        region: location.region,
      },
    });

    if (!locationData) {
      locationData = await prisma.location.create({
        data: location,
      });
    }

    // Determine contact method
    let contactMethod: ContactMethod = ContactMethod.NONE;
    if (contact?.email && contact?.phone) {
      contactMethod = ContactMethod.BOTH;
    } else if (contact?.email) {
      contactMethod = ContactMethod.EMAIL;
    } else if (contact?.phone) {
      contactMethod = ContactMethod.PHONE;
    }

    // Create listing
    // Create listing
    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        price: price.value,
        priceUnit: price.unit,
        ownerId: user.id,
        categoryId,
        subCategoryId,
        locationId: locationData.id,
        contactMethod,
        contactEmail: contact?.email,
        contactPhone: contact?.phone,
        images: {
          create: images?.filter((url): url is string => !!url).map((url) => ({ url })) ?? [],
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








export type GetListingsParams = {
  query?: string;
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  subCategorySlug?: string;
  orderBy?: "newest" | "priceAsc" | "priceDesc";
};

export async function getListings({
  query,
  page = 1,
  pageSize = 12,
  categorySlug,
  subCategorySlug,
  orderBy = "newest",
}: GetListingsParams) {
  const skip = (page - 1) * pageSize;

  // 🔎 WHERE
  const where: Prisma.ListingWhereInput = {
    isActive: true,
    deletedAt: null,

    ...(categorySlug && {
      category: { is: { slug: categorySlug } }, // ✅ relational filter
    }),

    ...(subCategorySlug && {
      subCategory: { is: { slug: subCategorySlug } }, // ✅ relational filter
    }),

    ...(query && {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    }),
  };

  // 🔃 ORDER BY
  const orderByClause: Prisma.ListingOrderByWithRelationInput =
    orderBy === "priceAsc"
      ? { price: "asc" }
      : orderBy === "priceDesc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: orderByClause,
      select: {
        id: true,
        title: true,
        category: {
          select: { slug: true }, // ✅ select slug only
        },
        subCategory: {
          select: { slug: true }, // ✅ select slug only
        },
        price: true,
        priceUnit: true,
        createdAt: true,
        images: {
          take: 1,
          select: {
            url: true,
            altText: true,
          },
        },
        location: {
          select: {
            city: true,
            postalCode: true,
          },
        },
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            ratingAverage: true,
            ratingCount: true,
            _count: {
              select: {
                listings: true,
              },
            },
          },
        },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    listings,
    hasMore: skip + listings.length < total,
  };
}

export type GetListingsResult = Awaited<ReturnType<typeof getListings>>;
export type ListingCard = GetListingsResult["listings"][number];
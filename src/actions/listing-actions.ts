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
  locationCity?: string;
  locationDepartment?: string;
  locationRegion?: string;
  orderBy?: "newest" | "priceAsc" | "priceDesc";
  geoLat?: number;
  geoLng?: number;
  geoRadiusKm?: number; // rayon en km
};

// fonction Haversine
function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function getListings({
  query,
  page = 1,
  pageSize = 12,
  categorySlug,
  subCategorySlug,
  locationCity,
  locationDepartment,
  locationRegion,
  orderBy = "newest",
  geoLat,
  geoLng,
  geoRadiusKm,
}: GetListingsParams) {
  const skip = (page - 1) * pageSize;

  const where: Prisma.ListingWhereInput = {
    isActive: true,
    deletedAt: null,

    ...(categorySlug && { category: { is: { slug: categorySlug } } }),
    ...(subCategorySlug && { subCategory: { is: { slug: subCategorySlug } } }),

    ...(locationCity && { location: { city: { equals: locationCity, mode: "insensitive" } } }),
    ...(locationDepartment && { location: { department: { equals: locationDepartment, mode: "insensitive" } } }),
    ...(locationRegion && { location: { region: { equals: locationRegion, mode: "insensitive" } } }),

    ...(query && {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    }),
  };

  // si géoloc définie
  let listings: ListingCard[] = [];
  let total = 0;

  if (geoLat != null && geoLng != null && geoRadiusKm != null) {
    // récupérer toutes les annonces qui matchent les autres filtres
    const allListings = await prisma.listing.findMany({
      where,
      select: {
        id: true,
        title: true,
        price: true,
        priceUnit: true,
        location: { select: { lat: true, lng: true, city: true, department: true, region: true } },
        category: { select: { slug: true } },
        subCategory: { select: { slug: true } },
        images: { take: 1, select: { url: true, altText: true } },
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            ratingAverage: true,
            ratingCount: true,
            _count: { select: { listings: true } },
          },
        },
      },
    });

    // filtrer par rayon
    const filtered = allListings.filter((l) => {
      if (!l.location.lat || !l.location.lng) return false;
      const d = distanceKm(geoLat, geoLng, l.location.lat, l.location.lng);
      return d <= geoRadiusKm;
    });

    total = filtered.length;
    listings = filtered.slice(skip, skip + pageSize);
  } else {
    // sans géoloc
    total = await prisma.listing.count({ where });
    listings = await prisma.listing.findMany({
      where,
      skip,
      take: pageSize,
      orderBy:
        orderBy === "priceAsc"
          ? { price: "asc" }
          : orderBy === "priceDesc"
            ? { price: "desc" }
            : { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        price: true,
            priceUnit: true,
        category: { select: { slug: true } },
        subCategory: { select: { slug: true } },
        images: { take: 1, select: { url: true, altText: true } },
        owner: {
          select: {
            id: true,
            name: true,
            image: true,
            ratingAverage: true,
            ratingCount: true,
            _count: { select: { listings: true } },
          },
        },
        location: { select: { lat: true, lng: true, city: true, department: true, region: true } },
      },
    });
  }

  return {
    listings,
    hasMore: skip + listings.length < total,
  };
}


export async function getListingById(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      images: true,
      price: true,
      priceUnit: true,
      createdAt: true,

      category: {
        select: {
          name: true,
          slug: true,
        },
      },

      subCategory: {
        select: {
          name: true,
          slug: true,
        },
      },

      location: {
        select: {
          region: true,
          department: true,
          city: true,
          postalCode: true,
          lat: true,
          lng: true,
        },
      },

      owner: {
        select: {
          id: true,
          name: true,
          image: true,
          ratingAverage: true,
          ratingCount: true,
        },
      },

    },
  });
}

// actions/listing-actions.ts

export type GetListingByIdResult = Awaited<
  ReturnType<typeof getListingById>
>;

export type ListingSingle = NonNullable<GetListingByIdResult>;

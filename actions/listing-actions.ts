"use server";

import { z } from "zod";

import { getUser } from "@/lib/auth/auth-session";
import prisma from "@/lib/prisma/prisma";
import { listingSchema, ListingDraft } from "@/validations/listing-schemas";
import { Prisma } from "@/lib/prisma/generated/prisma/client";


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




export type GetListingsParams = {
  query?: string;
  page?: number;
  pageSize?: number;

  category?: string;
  subCategory?: string;
  product?: string;

  locationCity?: string;
  locationDepartment?: string;
  locationRegion?: string;

  orderBy?: "newest" | "priceAsc" | "priceDesc";

  geoLat?: number;
  geoLng?: number;
  geoRadiusKm?: number;

  priceMin?: number;
  priceMax?: number;
};

export async function getListings({
  query,
  page = 1,
  pageSize = 8,
  category,
  subCategory,
  product,
  orderBy = "newest",
  geoLat,
  geoLng,
  geoRadiusKm,
  priceMin,
  priceMax,
}: GetListingsParams) {
  const skip = (page - 1) * pageSize;

  const where: Prisma.ListingWhereInput = {
    status: "ACTIVE",
    deletedAt: null,

    ...(category && {
      category: { is: { slug: category } },
    }),

    ...(subCategory && {
      subCategory: { is: { slug: subCategory } },
    }),
    ...(product && {
      product: { is: { slug: product } },
    }),

    ...(query && {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    }),

    ...(priceMin != null || priceMax != null
      ? {
          price: {
            ...(priceMin != null ? { gte: priceMin } : {}),
            ...(priceMax != null ? { lte: priceMax } : {}),
          },
        }
      : {}),
  };

  let listings: ListingWithDistance[] = [];
  let total = 0;

  // 🌍 GEO MODE
  if (geoLat != null && geoLng != null && geoRadiusKm != null) {
    // We use a raw query to leverage PostGIS index
    // Note: This requires the where conditions to be handled manually or via a partial Prisma where
    // For simplicity here, we'll fetch the IDs from Prisma first if where is complex, 
    // or better, build the raw SQL for the entire query.
    
    // To keep it clean, we find IDs that match our basic filters first
    const matchingListingIds = await prisma.listing.findMany({
      where,
      select: { id: true },
    });
    
    const ids: string[] = matchingListingIds.map(l => l.id);
    if (ids.length === 0) return { listings: [], hasMore: false };

    const rawListings = (await prisma.$queryRaw`
      SELECT 
        l.id, l.title, l.price, l."priceUnit", l."createdAt",
        loc.lat, loc.lng, loc.city, loc."postalCode",
        ST_Distance(loc.coords, ST_SetSRID(ST_MakePoint(${geoLng}, ${geoLat}), 4326)::geography) / 1000 as distance
      FROM listing l
      JOIN location loc ON l."locationId" = loc.id
      WHERE l.id IN (${Prisma.join(ids)})
        AND ST_DWithin(loc.coords, ST_SetSRID(ST_MakePoint(${geoLng}, ${geoLat}), 4326)::geography, ${geoRadiusKm * 1000})
      ORDER BY distance ASC
      LIMIT ${pageSize} OFFSET ${skip}
    `) as { id: string; distance: number }[];

    // Calculate total for pagination
    const totalCount = (await prisma.$queryRaw`
      SELECT COUNT(*)::int as count
      FROM listing l
      JOIN location loc ON l."locationId" = loc.id
      WHERE l.id IN (${Prisma.join(ids)})
        AND ST_DWithin(loc.coords, ST_SetSRID(ST_MakePoint(${geoLng}, ${geoLat}), 4326)::geography, ${geoRadiusKm * 1000})
    `) as { count: number }[];
    
    total = totalCount[0]?.count ?? 0;

    // Format the raw results to match the expected structure
    // We need to fetch the relations separately or refine the raw query
    // Let's do a findMany for the final results to get all relations cleanly
    const finalIds = rawListings.map(l => l.id);
    const enrichedListings = await prisma.listing.findMany({
      where: { id: { in: finalIds } },
      select: {
        id: true,
        title: true,
        price: true,
        priceUnit: true,
        createdAt: true,
        location: {
          select: { lat: true, lng: true, city: true, postalCode: true },
        },
        category: { select: { slug: true } },
        subCategory: { select: { slug: true } },
        product: { select: { slug: true } },
        images: {
          take: 3,
          orderBy: { index: "desc" },
          select: { url: true, altText: true },
        },
        owner: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // Re-sort enriched results by the distance we calculated
    listings = rawListings.map(rl => {
      const enriched = enrichedListings.find(el => el.id === rl.id);
      if (!enriched) return null;
      return { ...enriched, distance: rl.distance };
    }).filter((l): l is NonNullable<typeof l> => l !== null);
    
  } else {
    // 📦 NORMAL MODE
    total = await prisma.listing.count({ where });

    listings = (await prisma.listing.findMany({
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
        createdAt: true,
        location: {
          select: { lat: true, lng: true, city: true, postalCode: true },
        },
        category: { select: { slug: true } },
        subCategory: { select: { slug: true } },
        product: { select: { slug: true } },
        images: {
          take: 3,
          orderBy: { index: "desc" },
          select: { url: true, altText: true },
        },
        owner: {
          select: { id: true, name: true, image: true },
        },
      },
    })) as ListingWithDistance[];
  }

  return {
    listings,
    hasMore: skip + listings.length < total,
  };
}

export type GetListingsResult = Awaited<ReturnType<typeof getListings>>;
export type ListingFromGetListings = NonNullable<
  GetListingsResult["listings"][number]
  >;





export async function getListingById(id: string) {
  try {
    const uuidSchema = z.uuid("Invalid listing ID");
    const validation = uuidSchema.safeParse(id);

    if (!validation.success) throw new Error("Invalid listing ID");

    return await prisma.listing.findUnique({
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

        product: {
          select: {
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            bookmarks: true,
          },
        },

        location: {
          select: {
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
          },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch listing:", error);
    throw new Error("Failed to fetch listing");
  }
}

export type GetListingByIdResult = Awaited<ReturnType<typeof getListingById>>;

export type ListingSingle = NonNullable<GetListingByIdResult>;



export async function toggleBookmark(listingId: string) {
  try {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    return await prisma.$transaction(async (tx) => {
      try {
        const existing = await tx.bookmark.findUnique({
          where: {
            userId_listingId: {
              userId: user.id,
              listingId,
            },
          },
        });

        if (existing) {
          await tx.bookmark.delete({
            where: {
              userId_listingId: {
                userId: user.id,
                listingId,
              },
            },
          });

          return { bookmarked: false, listingId };
        }

        await tx.bookmark.create({
          data: {
            userId: user.id,
            listingId,
          },
        });

        return { bookmarked: true, listingId };
      } catch (txError) {
        console.error("Failed transaction in toggleBookmark:", txError);
        throw new Error("Failed to toggle bookmark");
      }
    });
  } catch (error) {
    console.error("Failed to toggle bookmark:", error);
    throw new Error("Failed to toggle bookmark");
  }
}

export async function getIsBookmarked(listingId: string) {
  try {
    const user = await getUser();
    if (!user) return false;

    return Boolean(
      await prisma.bookmark.findUnique({
        where: {
          userId_listingId: {
            userId: user.id,
            listingId,
          },
        },
      })
    );
  } catch (error) {
    console.error("Failed to check bookmark status:", error);
    throw new Error("Failed to check bookmark status");
  }
}
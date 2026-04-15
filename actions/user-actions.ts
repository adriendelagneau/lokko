"use server";

import { getUser } from "@/lib/auth/auth-session";
import { Prisma } from "@/lib/prisma/generated/prisma/client";
import prisma from "@/lib/prisma/prisma";
import {
  savedSearchSchema,
  
} from "@/validations/user-validation";
import { SavedSearchQuery } from "@/validations/json-schemas";

export async function getUserRole() {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, role: true },
  });

  if (!dbUser) {
    throw new Error("User not found");
  }

  return {
    id: dbUser.id,
    email: dbUser.email,
    role: dbUser.role,
  };
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
      },
    });

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getUserInfos() {
  const sessionUser = await getUser();
  if (!sessionUser) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,

      accounts: {
        select: {
          id: true,
          providerId: true,
          accountId: true,
        },
      },
    },
  });

  if (!user) throw new Error("User not found");

  // renommer accounts => providers pour le front
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    image: user.image,
    role: user.role,

    providers: user.accounts ?? [],
  } as const;
}

// actions/user-actions.ts

export type GetUserInfosResult = Awaited<ReturnType<typeof getUserInfos>>;
export type UserInfos = NonNullable<GetUserInfosResult>;

export type GetUserSavedSearchesParams = {
  page?: number;
  pageSize?: number;
  includeInactive?: boolean; // optional, useful if you want inactive searches
};

export async function getUserSavedSearches({
  page = 1,
  pageSize = 10,
  includeInactive = false,
}: GetUserSavedSearchesParams) {
  const user = await getUser();
  if (!user) throw new Error("Unauthorized");

  const skip = (page - 1) * pageSize;

  const where: Prisma.SavedSearchWhereInput = {
    userId: user.id,
    ...(includeInactive ? {} : { isActive: true }),
  };

  const total = await prisma.savedSearch.count({ where });

  const savedSearches = await prisma.savedSearch.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
  });

  const typedSavedSearches = savedSearches.map((s) => ({
    ...s,
    query: s.query as SavedSearchQuery,
  }));

  return {
    savedSearches: typedSavedSearches,
    hasMore: skip + typedSavedSearches.length < total,
  };
}

export type GetUserSavedSearchesResult = Awaited<
  ReturnType<typeof getUserSavedSearches>
>;

export type SavedSearchType =
  GetUserSavedSearchesResult["savedSearches"][number];

export async function saveUserSearch(input: unknown) {
  try {
    const parsed = savedSearchSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const { title, query } = parsed.data;

    const user = await getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    const search = await prisma.savedSearch.create({
      data: {
        userId: user.id,
        title,
        query,
      },
    });
    return { success: true, data: search };
  } catch (error) {
    console.error("Failed to save search:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function renameSavedSearch(savedSearchId: string, title: string) {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    if (!title.trim()) {
      return { success: false, error: "Title is required" };
    }

    const savedSearch = await prisma.savedSearch.findUnique({
      where: { id: savedSearchId },
      select: { userId: true },
    });

    if (!savedSearch)
      return { success: false, error: "Saved search not found" };
    if (savedSearch.userId !== user.id)
      return { success: false, error: "Unauthorized" };

    const updated = await prisma.savedSearch.update({
      where: { id: savedSearchId },
      data: { title },
    });
    return { success: true, data: updated };
  } catch (error) {
    console.error("Failed to rename search:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function deleteSavedSearch(id: string) {
  try {
    const user = await getUser();
    if (!user) return { success: false, error: "Unauthorized" };

    await prisma.savedSearch.deleteMany({
      where: { id, userId: user.id },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete search:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

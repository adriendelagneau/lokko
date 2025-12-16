"use server";

import prisma from "@/lib/prisma/prisma";

export async function getCategories() {
  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      children: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
        orderBy: {
          name: "asc",
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  // 🔁 normalize shape for the UI
  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    subcategories: cat.children,
  }));
}

export type Category = Awaited<ReturnType<typeof getCategories>>[number];


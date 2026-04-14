"use server";

import prisma from "@/lib/prisma/prisma";

export async function getCategories() {
  try {
    const categories = await prisma.category.findMany({
      where: { parentId: null },
      select: {
        id: true,
        name: true,
        slug: true,
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
            products: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
          orderBy: { name: "asc" },
        },
      },
      orderBy: { name: "asc" },
    });

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      subcategories: cat.children.map((sub) => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        products: sub.products ?? [],
      })),
    }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

export type Category = Awaited<ReturnType<typeof getCategories>>[number];


export const getProductsBySubCategory = async (subCategorySlug: string) => {
  try {
    return await prisma.product.findMany({
      where: {
        isActive: true,
        category: {
          slug: subCategorySlug,
        },
      },
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch products by subcategory:", error);
    throw new Error("Failed to fetch products");
  }
};

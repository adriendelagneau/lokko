import { z } from "zod";

export const listingSchema = z.object({
  title: z.string().min(5, "Titre trop court"),

  categoryId: z.string().min(1, "Catégorie obligatoire"),

  subCategoryId: z
    .string()
    .optional()
    .or(z.literal("")),

  productId: z
    .string()
    .optional()
    .or(z.literal("")),

  images: z
    .array(
      z.object({
        url: z.string().url(),
        index: z.number(),
      })
    )
    .length(3, "Veuillez ajouter exactement 3 images"),

  location: z.object({
    city: z.string().min(1, "Ville obligatoire"),
    postalCode: z.string().min(1, "Code postal obligatoire"),
    lat: z.number(),
    lng: z.number(),
  }),
  price: z.object({
    value: z.number().positive("Le prix doit être supérieur à 0"),
    unit: z.enum(["UNIT", "KG", "L"]),
  }),
  description: z.string().min(10, "Description trop courte (10 caractères min)"),
});

export type ListingDraft = z.infer<typeof listingSchema>;

export const stepSchemas = [
  listingSchema.pick({ title: true }),
  listingSchema.pick({ categoryId: true, subCategoryId: true, productId: true }),
  listingSchema.pick({ images: true }),
  listingSchema.pick({ location: true }),
  listingSchema.pick({ price: true }),
  listingSchema.pick({ description: true }),
];


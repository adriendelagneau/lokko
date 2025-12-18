import { z } from "zod";

export const listingSchema = z.object({
  title: z.string().min(5, "Titre trop court"),

  categoryId: z.string().uuid(),
  subCategoryId: z.string().uuid(),

  images: z.array(z.string().url()).min(1, "Ajoutez au moins une image"),

location: z.object({
  region: z.string().min(1),
  department: z.string().min(1),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
}),


  price: z.object({
    value: z.number().positive("Prix invalide"),
    unit: z.enum(["UNIT", "KG", "L"]),
  }),

  contact: z
    .object({
      email: z.email().optional(),
      phone: z.string().optional(),
    })
    .refine(
      (v) => !v || v.email || v.phone,
      {
        message: "Email ou téléphone requis",
      }
    )
    .optional(),
  
  description: z.string().min(10, "Description trop courte"),

});

export type ListingDraft = z.infer<typeof listingSchema>;


export const stepSchemas = [
  // 0 - Title
  listingSchema.pick({ title: true }),

  // 1 - Category + SubCategory
  listingSchema.pick({ categoryId: true, subCategoryId: true }),

  // 2 - Images
  listingSchema.pick({ images: true }),

  // 3 - Location
  listingSchema.pick({ location: true }),

  // 4 - Price
  listingSchema.pick({ price: true }),

  // 6 - Contact (optionnel mais cohérent)
  listingSchema.pick({ contact: true }),

  // 5 - Description
  listingSchema.pick({ description: true }),
];


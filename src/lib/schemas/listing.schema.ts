import { z } from "zod";

export const listingSchema = z.object({
  // Step 1
  title: z.string().min(5, "Titre trop court"),

  // Step 2
  categoryId: z.string().uuid("Catégorie invalide"),
  subCategoryId: z.string().uuid("Sous-catégorie invalide"),

  // Step 3
  images: z.array(z.string().url()).min(1, "Au moins une image est requise"),

  // Step 4
  location: z.object({
    region: z.string().min(1, "Région requise"),
    department: z.string().min(1, "Département requis"),
    city: z.string().min(1, "Ville requise"),
    postalCode: z.string().min(4, "Code postal invalide"),
  }),

  // Step 5
  price: z.object({
    value: z.number().positive("Prix invalide"),
    unit: z.enum(["kg", "l", "unit"]),
  }),

  // Step 6
  description: z.string().min(20, "Annonce trop courte"),

  // Step 7 (optionnel)
  contact: z.object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
  }).optional(),
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

  // 5 - Description
  listingSchema.pick({ description: true }),

  // 6 - Contact (toujours valide)
  listingSchema.pick({ contact: true }),
];

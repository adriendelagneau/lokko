import { z } from "zod";
import { savedSearchQuerySchema } from "./json-schemas";

export const locationSchema = z.object({
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  lat: z.number().finite(),
  lng: z.number().finite(),
});

export const imageSchema = z.object({
  url: z.url(),
  index: z.number().min(0),
});



export const savedSearchSchema = z.object({
  title: z.string().min(1, "Title is required"),
  query: savedSearchQuerySchema,
});

export type SaveSearchInput = z.infer<typeof savedSearchSchema>;

export const updateTitleSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export type UpdateTitleForm = z.infer<typeof updateTitleSchema>;

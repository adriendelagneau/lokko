import { z } from "zod";

/**
 * Schema for SavedSearch.query JSON field
 */
export const savedSearchQuerySchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  product: z.string().optional(),
  priceMin: z.number().optional(),
  priceMax: z.number().optional(),
  geoLat: z.number().optional(),
  geoLng: z.number().optional(),
  geoRadiusKm: z.number().optional(),
});

export type SavedSearchQuery = z.infer<typeof savedSearchQuerySchema>;

/**
 * Schema for Notification.payload JSON field
 */
export const notificationPayloadSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("NEW_MESSAGE"),
    conversationId: z.string(),
    messageId: z.string(),
    senderName: z.string(),
    contentPreview: z.string(),
  }),
  z.object({
    type: z.literal("NEW_LISTING"),
    listingId: z.string(),
    listingTitle: z.string(),
    listingImage: z.string().optional(),
    savedSearchId: z.string(),
    savedSearchTitle: z.string().optional(),
  }),
  z.object({
    type: z.literal("LISTING_APPROVED"),
    listingId: z.string(),
    listingTitle: z.string(),
  }),
  z.object({
    type: z.literal("LISTING_REJECTED"),
    listingId: z.string(),
    listingTitle: z.string(),
    reason: z.string().optional(),
  }),
]);

export type NotificationPayload = z.infer<typeof notificationPayloadSchema>;

/**
 * Schema for Listing.nsfwResults JSON field (optional)
 */
export const nsfwResultsSchema = z.object({
  isSafe: z.boolean(),
  score: z.number().optional(),
  label: z.string().optional(),
}).optional();

export type NsfwResults = z.infer<typeof nsfwResultsSchema>;

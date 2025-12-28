import { z } from "zod";

export const sendMessageSchema = z.object({
  listingId: z.string().uuid(),
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(2000, "Message too long"),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;

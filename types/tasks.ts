import { z } from "zod";

export const aiStatusFeedSchema = z.object({
  type: z.literal("ai-status-feed"),
  status: z.string(),
  text: z.string().optional(),
});

export type AiStatusFeedMessage = z.infer<typeof aiStatusFeedSchema>;

export const aiChatFeedSchema = z.object({
  type: z.literal("ai-chat"),
  sender: z.string(),
  role: z.enum(["user", "ai", "system"]),
  content: z.string(),
  timestamp: z.number(),
});

export type AiChatFeedMessage = z.infer<typeof aiChatFeedSchema>;

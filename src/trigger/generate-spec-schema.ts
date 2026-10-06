import { z } from 'zod';

export const InputSchema = z.object({
  projectId: z.string(),
  roomId: z.string(),
  chatHistory: z.array(z.unknown()),
  nodes: z.array(z.unknown()),
  edges: z.array(z.unknown()),
});

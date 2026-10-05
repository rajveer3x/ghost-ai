import { Liveblocks } from "@liveblocks/node";

const secretKey = process.env.LIVEBLOCK_SECRET_KEY || process.env.LIVEBLOCKS_SECRET_KEY;

if (!secretKey) {
  throw new Error("LIVEBLOCK_SECRET_KEY or LIVEBLOCKS_SECRET_KEY is missing in environment variables");
}

export const liveblocks = new Liveblocks({
  secret: secretKey,
});

const COLORS = [
  "#e81416",
  "#ffa500",
  "#faeb36",
  "#79c314",
  "#487de7",
  "#4b369d",
  "#70369d",
];

export function getUserColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
}

import { Liveblocks } from "@liveblocks/node";

let _liveblocks: Liveblocks | null = null;

export function getLiveblocks() {
  if (!_liveblocks) {
    const secretKey = process.env.LIVEBLOCK_SECRET_KEY || process.env.LIVEBLOCKS_SECRET_KEY || "sk_dev_dummy_key_for_build";
    _liveblocks = new Liveblocks({
      secret: secretKey as string,
    });
  }
  return _liveblocks;
}

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

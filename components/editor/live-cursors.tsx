import { useOthers } from "@liveblocks/react";
import { useUser } from "@clerk/nextjs";
import { useStore } from "@xyflow/react";

export function LiveCursors() {
  const others = useOthers();
  const { user } = useUser();

  return (
    <>
      {others.map((other) => {
        if (!other.presence?.cursor) return null;
        if (user && other.id === user.id) return null;
        return (
          <Cursor
            key={other.connectionId}
            x={other.presence.cursor.x}
            y={other.presence.cursor.y}
            color={other.info?.color || "#00D4FF"}
            name={other.info?.name || "Anonymous"}
          />
        );
      })}
    </>
  );
}

function Cursor({ x, y, color, name }: { x: number; y: number; color: string; name: string }) {
  // Use React Flow's internal store to get the current transform (pan and zoom)
  const transform = useStore((state) => state.transform);
  
  // Convert flow coordinates back to screen coordinates
  const screenX = x * transform[2] + transform[0];
  const screenY = y * transform[2] + transform[1];

  return (
    <div
      className="absolute top-0 left-0 z-50 pointer-events-none transition-all duration-100 ease-out"
      style={{
        transform: `translate(${screenX}px, ${screenY}px)`,
      }}
    >
      <svg
        width="24"
        height="36"
        viewBox="0 0 24 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md"
      >
        <path
          d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
          fill={color}
        />
      </svg>
      <div
        className="absolute top-5 left-2 px-2 py-0.5 rounded text-xs font-semibold text-white whitespace-nowrap drop-shadow-md"
        style={{ backgroundColor: color }}
      >
        {name}
      </div>
    </div>
  );
}

import { useOthers } from "@liveblocks/react";
import { UserButton, useUser } from "@clerk/nextjs";

export function PresenceAvatars() {
  const { user } = useUser();
  const others = useOthers();

  // Filter out any other connections from the same user ID
  // Also de-duplicate based on user ID so we don't show the same collaborator twice
  const uniqueCollaborators = new Map();
  for (const other of others) {
    if (other.info && (!user || other.id !== user.id) && !uniqueCollaborators.has(other.id)) {
      uniqueCollaborators.set(other.id, other.info);
    }
  }

  const collaborators = Array.from(uniqueCollaborators.values());
  const maxAvatars = 5;
  const visibleCollaborators = collaborators.slice(0, maxAvatars);
  const overflowCount = collaborators.length - maxAvatars;

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
      {collaborators.length > 0 && (
        <div className="flex items-center -space-x-2">
          {visibleCollaborators.map((info, idx) => (
            <div
              key={idx}
              className="relative h-8 w-8 rounded-full border-2 border-[#141415] flex items-center justify-center bg-zinc-700 overflow-hidden"
              style={{ boxShadow: `0 0 0 1px ${info.color || 'transparent'}` }}
              title={info.name}
            >
              {info.avatar ? (
                <img src={info.avatar} alt={info.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs font-medium text-white">
                  {info.name?.charAt(0)?.toUpperCase()}
                </span>
              )}
            </div>
          ))}
          {overflowCount > 0 && (
            <div className="relative h-8 w-8 rounded-full border-2 border-[#141415] flex items-center justify-center bg-zinc-800 text-xs font-medium text-zinc-300">
              +{overflowCount}
            </div>
          )}
        </div>
      )}
      
      {collaborators.length > 0 && (
        <div className="h-4 w-px bg-zinc-800" />
      )}
      
      <div className="flex items-center justify-center">
        <UserButton 
          appearance={{
            elements: {
              avatarBox: "h-8 w-8 border border-zinc-800"
            }
          }}
        />
      </div>
    </div>
  );
}

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { ReactNode } from "react";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  projectName?: string;
  actions?: ReactNode;
}

export function EditorNavbar({ isSidebarOpen, onToggleSidebar, projectName, actions }: EditorNavbarProps) {
  return (
    <nav className="h-14 shrink-0 flex items-center justify-between px-4 bg-[#0E0E10] border-b border-zinc-800/50 z-40">
      <div className="flex items-center flex-1 gap-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
          {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </Button>
        <div className="flex flex-col">
          <span className="font-semibold text-sm text-zinc-100">Liveblocks Live Room</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Workspace</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center flex-1">
      </div>
      
      <div className="flex items-center justify-end flex-1 gap-3">
        {actions}
        <div className="pl-2 border-l border-zinc-800">
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "h-8 w-8"
              }
            }}
          />
        </div>
      </div>
    </nav>
  );
}

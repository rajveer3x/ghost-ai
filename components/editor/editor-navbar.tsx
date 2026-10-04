import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function EditorNavbar({ isSidebarOpen, onToggleSidebar }: EditorNavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 bg-background border-b border-border z-40">
      <div className="flex items-center flex-1">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          {isSidebarOpen ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeftOpen className="h-5 w-5" />}
        </Button>
      </div>
      <div className="flex items-center justify-center flex-1">
        {/* Center section */}
      </div>
      <div className="flex items-center justify-end flex-1">
        <UserButton />
      </div>
    </nav>
  );
}


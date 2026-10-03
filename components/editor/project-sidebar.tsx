import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <div
      className={cn(
        "fixed top-14 left-0 bottom-0 w-64 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-r border-border shadow-lg transition-transform duration-300 ease-in-out z-30 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Projects</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden p-4">
        <Tabs defaultValue="my-projects" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            <TabsTrigger value="shared">Shared</TabsTrigger>
          </TabsList>
          <TabsContent value="my-projects" className="flex-1 flex items-center justify-center text-muted-foreground text-sm mt-4">
            No projects found.
          </TabsContent>
          <TabsContent value="shared" className="flex-1 flex items-center justify-center text-muted-foreground text-sm mt-4">
            No shared projects.
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <Button className="w-full">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>
    </div>
  );
}

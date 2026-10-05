import { Plus, X, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Project {
  id: string;
  name: string;
}

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  myProjects: Project[];
  sharedProjects: Project[];
  onCreateProject?: () => void;
  onRenameProject?: (id: string, currentName: string) => void;
  onDeleteProject?: (id: string) => void;
  activeProjectId?: string;
}

export function ProjectSidebar({ 
  isOpen, 
  onClose,
  myProjects,
  sharedProjects,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
  activeProjectId
}: ProjectSidebarProps) {
  return (
    <div className="h-full w-full bg-[#141415] rounded-xl border border-zinc-800 flex flex-col overflow-hidden shadow-lg">
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
        <h2 className="text-sm font-semibold text-zinc-100">Projects</h2>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6 text-zinc-500 hover:text-zinc-100 md:hidden">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden p-3">
        <Tabs defaultValue="my-projects" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-zinc-900/80 p-1 border border-zinc-800/50 rounded-lg">
            <TabsTrigger value="my-projects" className="text-xs data-[state=active]:bg-[#1A1A1C] data-[state=active]:text-zinc-100 text-zinc-400">My Projects</TabsTrigger>
            <TabsTrigger value="shared" className="text-xs data-[state=active]:bg-[#1A1A1C] data-[state=active]:text-zinc-100 text-zinc-400">Shared</TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-projects" className="flex-1 overflow-hidden mt-3">
            <ScrollArea className="h-full">
              {myProjects.length === 0 ? (
                <div className="flex items-center justify-center text-zinc-500 text-xs h-full">
                  No projects found.
                </div>
              ) : (
                <div className="space-y-1">
                  {myProjects.map((project) => {
                    const isActive = activeProjectId === project.id;
                    return (
                      <Link
                        href={`/editor/${project.id}`}
                        key={project.id}
                        className={cn(
                          "group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border",
                          isActive 
                            ? "bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30 font-medium" 
                            : "text-zinc-300 border-transparent hover:bg-zinc-800/50 hover:text-zinc-100"
                        )}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", isActive ? "bg-[#00D4FF]" : "bg-transparent group-hover:bg-zinc-600")} />
                          <span className="truncate">{project.name}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onRenameProject?.(project.id, project.name);
                            }}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 text-zinc-500 hover:text-red-400 hover:bg-red-400/10"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onDeleteProject?.(project.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="shared" className="flex-1 overflow-hidden mt-3">
            <ScrollArea className="h-full">
              {sharedProjects.length === 0 ? (
                <div className="flex items-center justify-center text-zinc-500 text-xs h-full">
                  No shared projects.
                </div>
              ) : (
                <div className="space-y-1">
                  {sharedProjects.map((project) => {
                    const isActive = activeProjectId === project.id;
                    return (
                      <Link
                        href={`/editor/${project.id}`}
                        key={project.id}
                        className={cn(
                          "group flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 border",
                          isActive 
                            ? "bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30 font-medium" 
                            : "text-zinc-300 border-transparent hover:bg-zinc-800/50 hover:text-zinc-100"
                        )}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", isActive ? "bg-[#00D4FF]" : "bg-transparent group-hover:bg-zinc-600")} />
                          <span className="truncate">{project.name}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      <div className="p-3 border-t border-zinc-800/50 mt-auto">
        <Button 
          className="w-full bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-black font-semibold rounded-lg h-10" 
          onClick={onCreateProject}
        >
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>
    </div>
  );
}

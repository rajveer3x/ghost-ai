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
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 top-14 bg-background/80 backdrop-blur-sm z-20 md:hidden"
          onClick={onClose}
        />
      )}
      
      <div
        className={cn(
          "fixed top-14 left-0 bottom-0 w-64 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-r border-border shadow-lg transition-transform duration-300 ease-in-out z-30 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Projects</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-hidden p-4">
          <Tabs defaultValue="my-projects" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="my-projects">My Projects</TabsTrigger>
              <TabsTrigger value="shared">Shared</TabsTrigger>
            </TabsList>
            <TabsContent value="my-projects" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full pr-4">
                {myProjects.length === 0 ? (
                  <div className="flex items-center justify-center text-muted-foreground text-sm h-full">
                    No projects found.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {myProjects.map((project) => (
                      <Link
                        href={`/editor/${project.id}`}
                        key={project.id}
                        className={cn(
                          "group flex items-center justify-between p-2 rounded-md hover:bg-muted/50 text-sm transition-colors",
                          activeProjectId === project.id ? "bg-muted font-medium" : ""
                        )}
                      >
                        <span className="truncate flex-1">{project.name}</span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onRenameProject?.(project.id, project.name);
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-muted-foreground hover:text-destructive"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              onDeleteProject?.(project.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="shared" className="flex-1 overflow-hidden mt-4">
              <ScrollArea className="h-full pr-4">
                {sharedProjects.length === 0 ? (
                  <div className="flex items-center justify-center text-muted-foreground text-sm h-full">
                    No shared projects.
                  </div>
                ) : (
                  <div className="space-y-1">
                    {sharedProjects.map((project) => (
                      <Link
                        href={`/editor/${project.id}`}
                        key={project.id}
                        className={cn(
                          "flex items-center p-2 rounded-md hover:bg-muted/50 text-sm transition-colors",
                          activeProjectId === project.id ? "bg-muted font-medium" : ""
                        )}
                      >
                        <span className="truncate">{project.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-4 border-t border-border mt-auto">
          <Button className="w-full" onClick={onCreateProject}>
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Button>
        </div>
      </div>
    </>
  );
}
